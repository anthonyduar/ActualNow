const API_KEY = process.env.FOOTBALL_DATA_API_KEY || "";

export async function getLiveMatches() {
  try {
    const res = await fetch("https://api.football-data.org/v4/matches", {
      headers: API_KEY ? { "X-Auth-Token": API_KEY } : {},
      next: { revalidate: 60 }, // Actualiza cada minuto
    });
    if (!res.ok) {
      return [];
    }
    const data = await res.json();
    // Filtramos solo los partidos que están ocurriendo ahora (IN_PLAY)
    return data.matches?.filter((m: any) => m.status === "IN_PLAY") || [];
  } catch {
    return [];
  }
}
