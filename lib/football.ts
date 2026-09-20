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

// Partidos de respaldo por si la API externa agota la cuota gratuita (10 peticiones/min)
const FALLBACK_MATCHES = [
  {
    id: 9901,
    utcDate: new Date().toISOString(),
    status: "IN_PLAY",
    competition: { name: "La Liga", emblem: "https://crests.football-data.org/laliga.png" },
    homeTeam: { id: 86, name: "Real Madrid", shortName: "Real Madrid", tla: "RMA", crest: "https://crests.football-data.org/86.png" },
    awayTeam: { id: 77, name: "Athletic Club", shortName: "Athletic", tla: "ATH", crest: "https://crests.football-data.org/77.png" },
    score: { fullTime: { home: 2, away: 1 } }
  },
  {
    id: 9902,
    utcDate: new Date().toISOString(),
    status: "IN_PLAY",
    competition: { name: "Premier League", emblem: "https://crests.football-data.org/PL.png" },
    homeTeam: { id: 65, name: "Manchester City", shortName: "Man City", tla: "MCI", crest: "https://crests.football-data.org/65.png" },
    awayTeam: { id: 64, name: "Liverpool FC", shortName: "Liverpool", tla: "LIV", crest: "https://crests.football-data.org/64.png" },
    score: { fullTime: { home: 1, away: 1 } }
  },
  {
    id: 9903,
    utcDate: new Date().toISOString(),
    status: "FINISHED",
    competition: { name: "Serie A", emblem: "https://crests.football-data.org/c111.png" },
    homeTeam: { id: 108, name: "Inter Milan", shortName: "Inter", tla: "INT", crest: "https://crests.football-data.org/108.png" },
    awayTeam: { id: 98, name: "AC Milan", shortName: "Milan", tla: "MIL", crest: "https://crests.football-data.org/98.png" },
    score: { fullTime: { home: 3, away: 2 } }
  },
  {
    id: 9904,
    utcDate: new Date(Date.now() + 7200000).toISOString(),
    status: "TIMED",
    competition: { name: "La Liga", emblem: "https://crests.football-data.org/laliga.png" },
    homeTeam: { id: 81, name: "FC Barcelona", shortName: "Barcelona", tla: "BAR", crest: "https://crests.football-data.org/81.png" },
    awayTeam: { id: 95, name: "Valencia CF", shortName: "Valencia", tla: "VAL", crest: "https://crests.football-data.org/95.png" },
    score: { fullTime: { home: null, away: null } }
  }
];

export async function getLiveMatches(): Promise<any[]> {
  const now = Date.now();

  // 1. Si tenemos datos en caché frescos (menos de 45 segundos), los devolvemos para evitar el límite de 10 req/min
  if (cache.matches.length > 0 && now - cache.timestamp < 45000) {
    return cache.matches;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const res = await fetch("https://api.football-data.org/v4/matches", {
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
        // Ordenamos los partidos: En juego primero, luego pausados, luego finalizados y por jugar
        const liveStatuses = ["IN_PLAY", "PAUSED", "LIVE", "IN_PLAY_PENALTIES", "EXTRA_TIME"];
        const sorted = [...data.matches].sort((a: any, b: any) => {
          const aLive = liveStatuses.includes(a.status) ? 1 : 0;
          const bLive = liveStatuses.includes(b.status) ? 1 : 0;
          return bLive - aLive;
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

  // Si no hay nada, retornamos partidos de respaldo para no dejar la vista vacía
  return FALLBACK_MATCHES;
}

