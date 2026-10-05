// API oficial de resultados de fútbol con integración de partidos reales
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

export const LIVE_STATUSES = ["IN_PLAY", "PAUSED", "LIVE", "IN_PLAY_PENALTIES", "EXTRA_TIME"];

// Prioridad de competiciones para dar relevancia a las ligas de mayor interés
export const COMPETITION_PRIORITY: Record<string, number> = {
  PD: 1, // LaLiga EA Sports
  CL: 2, // UEFA Champions League
  PL: 3, // Premier League
  SA: 4, // Serie A
  BL1: 5, // Bundesliga
  FL1: 6, // Ligue 1
  EC: 7, // Eurocopa
  WC: 8, // Copa Mundial
  ELC: 9, // Championship
  PPL: 10, // Primeira Liga
  DED: 11, // Eredivisie
  BSA: 12, // Brasileirão
};

export function sortMatches(matches: any[]) {
  return [...matches].sort((a: any, b: any) => {
    // 1. Partidos EN VIVO siempre tienen prioridad máxima
    const aLive = LIVE_STATUSES.includes(a.status) ? 1 : 0;
    const bLive = LIVE_STATUSES.includes(b.status) ? 1 : 0;
    if (aLive !== bLive) return bLive - aLive;

    // Si ambos están en vivo, ordenar por importancia de liga
    if (aLive && bLive) {
      const pA = COMPETITION_PRIORITY[a.competition?.code] || 99;
      const pB = COMPETITION_PRIORITY[b.competition?.code] || 99;
      return pA - pB;
    }

    const aIsFinished = a.status === "FINISHED";
    const bIsFinished = b.status === "FINISHED";

    // Si ambos están finalizados, los más recientes primero
    if (aIsFinished && bIsFinished) {
      return new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime();
    }

    // Si ambos son próximos / programados
    if (!aIsFinished && !bIsFinished) {
      const diff = new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime();
      // Si se juegan en la misma ventana de horas, ordenar por relevancia de liga
      if (Math.abs(diff) < 21600000) {
        const pA = COMPETITION_PRIORITY[a.competition?.code] || 99;
        const pB = COMPETITION_PRIORITY[b.competition?.code] || 99;
        if (pA !== pB) return pA - pB;
      }
      return diff;
    }

    // Los próximos antes que los finalizados pasados
    return aIsFinished ? 1 : -1;
  });
}

export async function getLiveMatches(force: boolean = false): Promise<any[]> {
  const now = Date.now();

  // Si no se fuerza y tenemos datos reales frescos en memoria, los entregamos
  if (!force && cache.matches.length > 0 && now - cache.timestamp < 20000) {
    return cache.matches;
  }

  try {
    // Ventana deslizante de 9 días (máximo 10 días permitido por football-data.org)
    const d = new Date();
    const past = new Date(d.getTime() - 2 * 86400000).toISOString().split("T")[0];
    const future = new Date(d.getTime() + 7 * 86400000).toISOString().split("T")[0];
    const url = `https://api.football-data.org/v4/matches?dateFrom=${past}&dateTo=${future}`;

    let res: Response | null = null;
    // Reintentos automáticos si la API externa responde 429 (límite temporal de petición por segundo)
    for (let attempt = 0; attempt < 2; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      try {
        res = await fetch(url, {
          headers: {
            "X-Auth-Token": API_KEY,
          },
          cache: "no-store",
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }

      if (res && res.status === 429) {
        await new Promise((r) => setTimeout(r, 3200));
        continue;
      }
      break;
    }

    if (res && res.ok) {
      const data = await res.json();
      if (Array.isArray(data.matches) && data.matches.length > 0) {
        const sorted = sortMatches(data.matches);
        cache = {
          timestamp: now,
          matches: sorted,
        };
        return sorted;
      }
    } else {
      console.warn("Football API respondió con código:", res?.status);
    }
  } catch (error) {
    console.warn("Error consultando la API oficial de fútbol:", error);
  }

  // Si falló la petición externa en este momento pero teníamos datos reales previos, usamos los reales
  if (cache.matches.length > 0) {
    return cache.matches;
  }

  // NUNCA devolver partidos falsos o inventados
  return [];
}
