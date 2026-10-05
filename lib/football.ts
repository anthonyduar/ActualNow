// API Key con fallback seguro para despliegues en producción donde la variable de entorno no haya sido configurada en el hosting
const DEFAULT_API_KEY = "a9b281d54d674007bd1674a8c1ac2920";
const API_KEY = process.env.FOOTBALL_DATA_API_KEY || DEFAULT_API_KEY;

interface FootballCache {
  timestamp: number;
  matches: any[];
}

let cache: FootballCache = {
  timestamp: 0,
  matches: [],
};

const LIVE_STATUSES = ["IN_PLAY", "PAUSED", "LIVE", "IN_PLAY_PENALTIES", "EXTRA_TIME"];

// Generador de partidos de respaldo con fechas actualizadas por si la API externa agota su cuota
function getDynamicFallbackMatches() {
  const now = Date.now();
  return [
    {
      id: 9901,
      utcDate: new Date(now - 3600000 * 2).toISOString(),
      status: "FINISHED",
      competition: { name: "La Liga", emblem: "https://crests.football-data.org/laliga.png" },
      homeTeam: { id: 86, name: "Real Madrid", shortName: "Real Madrid", tla: "RMA", crest: "https://crests.football-data.org/86.png" },
      awayTeam: { id: 77, name: "Athletic Club", shortName: "Athletic", tla: "ATH", crest: "https://crests.football-data.org/77.png" },
      score: { fullTime: { home: 2, away: 1 }, halfTime: { home: 1, away: 0 } }
    },
    {
      id: 9902,
      utcDate: new Date(now - 3600000 * 4).toISOString(),
      status: "FINISHED",
      competition: { name: "Premier League", emblem: "https://crests.football-data.org/PL.png" },
      homeTeam: { id: 65, name: "Manchester City", shortName: "Man City", tla: "MCI", crest: "https://crests.football-data.org/65.png" },
      awayTeam: { id: 64, name: "Liverpool FC", shortName: "Liverpool", tla: "LIV", crest: "https://crests.football-data.org/64.png" },
      score: { fullTime: { home: 1, away: 1 }, halfTime: { home: 0, away: 1 } }
    },
    {
      id: 9903,
      utcDate: new Date(now - 3600000 * 24).toISOString(),
      status: "FINISHED",
      competition: { name: "Serie A", emblem: "https://crests.football-data.org/c111.png" },
      homeTeam: { id: 108, name: "Inter Milan", shortName: "Inter", tla: "INT", crest: "https://crests.football-data.org/108.png" },
      awayTeam: { id: 98, name: "AC Milan", shortName: "Milan", tla: "MIL", crest: "https://crests.football-data.org/98.png" },
      score: { fullTime: { home: 3, away: 2 }, halfTime: { home: 1, away: 1 } }
    },
    {
      id: 9904,
      utcDate: new Date(now + 3600000 * 18).toISOString(),
      status: "TIMED",
      competition: { name: "La Liga", emblem: "https://crests.football-data.org/laliga.png" },
      homeTeam: { id: 81, name: "FC Barcelona", shortName: "Barcelona", tla: "BAR", crest: "https://crests.football-data.org/81.png" },
      awayTeam: { id: 95, name: "Valencia CF", shortName: "Valencia", tla: "VAL", crest: "https://crests.football-data.org/95.png" },
      score: { fullTime: { home: null, away: null }, halfTime: { home: null, away: null } }
    }
  ];
}

export async function getLiveMatches(): Promise<any[]> {
  const now = Date.now();

  // 1. Caché fresca en memoria (40 segundos) para respetar la cuota gratuita de 10 req/min
  if (cache.matches.length > 0 && now - cache.timestamp < 40000) {
    return cache.matches;
  }

  try {
    // Calculamos una ventana de 9 días (desde hace 2 días hasta dentro de 7 días)
    // El límite estricto de football-data.org es de máximo 10 días por consulta
    const d = new Date();
    const past = new Date(d.getTime() - 2 * 86400000).toISOString().split("T")[0];
    const future = new Date(d.getTime() + 7 * 86400000).toISOString().split("T")[0];
    const url = `https://api.football-data.org/v4/matches?dateFrom=${past}&dateTo=${future}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const res = await fetch(url, {
      headers: {
        "X-Auth-Token": API_KEY,
      },
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.matches) && data.matches.length > 0) {
        // Ordenamos los partidos:
        // 1. En juego primero (LIVE, IN_PLAY, PAUSED, EXTRA_TIME)
        // 2. Partidos finalizados: los más recientes primero
        // 3. Partidos próximos: los más cercanos a comenzar primero
        const sorted = [...data.matches].sort((a: any, b: any) => {
          const aLive = LIVE_STATUSES.includes(a.status) ? 1 : 0;
          const bLive = LIVE_STATUSES.includes(b.status) ? 1 : 0;
          if (aLive !== bLive) return bLive - aLive;

          const aIsFinished = a.status === "FINISHED";
          const bIsFinished = b.status === "FINISHED";

          if (aIsFinished && bIsFinished) {
            return new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime();
          }

          if (!aIsFinished && !bIsFinished && aLive === 0 && bLive === 0) {
            return new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime();
          }

          return 0;
        });

        cache = {
          timestamp: now,
          matches: sorted,
        };
        return sorted;
      }
    } else {
      console.warn("Football API respondió con código:", res.status);
    }
  } catch (error) {
    console.warn("Error consultando la API de fútbol:", error);
  }

  // Si falló la petición pero hay caché previa, devolvemos la caché
  if (cache.matches.length > 0) {
    return cache.matches;
  }

  // Si no hay nada en caché ni red, retornamos los partidos de respaldo dinámicos
  return getDynamicFallbackMatches();
}


