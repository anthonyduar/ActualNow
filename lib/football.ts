// API Key con fallback seguro para despliegues en producción donde la variable de entorno no haya sido configurada en el hosting
const DEFAULT_API_KEY = "a9b281d54d674007bd1674a8c1ac2920";
const API_KEY = process.env.FOOTBALL_DATA_API_KEY || DEFAULT_API_KEY;

export async function getLiveMatches() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch("https://api.football-data.org/v4/matches", {
      headers: {
        "X-Auth-Token": API_KEY,
      },
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn("Football API responded with status:", res.status);
      return [];
    }

    const data = await res.json();

    // Filtramos partidos en juego y entretiempo/descanso
    const liveStatuses = ["IN_PLAY", "PAUSED", "LIVE", "IN_PLAY_PENALTIES", "EXTRA_TIME"];
    const liveMatches = data.matches?.filter((m: any) =>
      liveStatuses.includes(m.status)
    ) || [];

    return liveMatches;
  } catch (error) {
    console.warn("Error obteniendo partidos de fútbol en vivo:", error);
    return [];
  }
}

