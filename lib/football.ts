const API_KEY = "a9b281d54d674007bd1674a8c1ac2920";

export async function getLiveMatches() {
  const res = await fetch("https://api.football-data.org/v4/matches", {
    headers: { "X-Auth-Token": API_KEY },
    next: { revalidate: 60 }, // Actualiza cada minuto
  });
  const data = await res.json();
  // Filtramos solo los partidos que están ocurriendo ahora (IN_PLAY)
  return data.matches?.filter((m: any) => m.status === "IN_PLAY") || [];
}
