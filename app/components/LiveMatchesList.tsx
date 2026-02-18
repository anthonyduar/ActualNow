"use client";
import { useState } from "react";

export default function LiveMatchesList({
  initialMatches,
}: {
  initialMatches: any[];
}) {
  const [matches, setMatches] = useState(initialMatches);
  const [loading, setLoading] = useState(false);

  const refreshMatches = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/football");
      if (!res.ok) throw new Error("Error en la API");
      const data = await res.json();
      setMatches(data);
    } catch (e) {
      console.error("Error al refrescar partidos:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
          <div className="h-3 w-3 bg-sky-500 rounded-full animate-pulse"></div>
          <h1 className="text-3xl font-bold uppercase tracking-tighter text-white">
            Fútbol en Vivo
          </h1>
        </div>
        <button
          onClick={refreshMatches}
          disabled={loading}
          className="bg-sky-500 hover:bg-sky-600 text-white text-[10px] tracking-widest font-bold px-4 py-2 rounded-full transition disabled:opacity-50 uppercase shadow-lg shadow-sky-500/20"
        >
          {loading ? "ACTUALIZANDO..." : "ACTUALIZAR RESULTADOS"}
        </button>
      </div>

      <div className="grid gap-4 mb-20">
        {matches && matches.length > 0 ? (
          matches.map((match: any) => (
            <div
              key={match.id}
              className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl flex justify-between items-center shadow-lg transition hover:border-sky-500/50 group"
            >
              {/* LOCAL */}
              <div className="flex-1 flex items-center justify-end gap-3 font-bold uppercase text-sm text-white group-hover:text-sky-400 transition text-right">
                <span className="hidden md:inline">{match.homeTeam.name}</span>
                <span className="md:hidden">
                  {match.homeTeam.tla || match.homeTeam.name}
                </span>
                {match.homeTeam.crest && (
                  <img
                    src={match.homeTeam.crest}
                    alt=""
                    className="w-8 h-8 object-contain"
                  />
                )}
              </div>

              {/* MARCADOR */}
              <div className="mx-4 md:mx-6 bg-black px-4 py-2 rounded-lg border border-sky-500 text-center min-w-[100px] md:min-w-[110px]">
                <span className="text-sky-500 font-mono font-bold text-xl">
                  {match.score.fullTime.home ?? 0} -{" "}
                  {match.score.fullTime.away ?? 0}
                </span>
                <div className="text-[9px] text-zinc-500 font-bold tracking-tighter uppercase">
                  En Vivo
                </div>
              </div>

              {/* VISITANTE */}
              <div className="flex-1 flex items-center justify-start gap-3 font-bold uppercase text-sm text-white group-hover:text-sky-400 transition text-left">
                {match.awayTeam.crest && (
                  <img
                    src={match.awayTeam.crest}
                    alt=""
                    className="w-8 h-8 object-contain"
                  />
                )}
                <span className="hidden md:inline">{match.awayTeam.name}</span>
                <span className="md:hidden">
                  {match.awayTeam.tla || match.awayTeam.name}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 p-20 rounded-2xl text-center">
            <p className="text-zinc-500 uppercase tracking-widest text-sm italic">
              No hay partidos en vivo en este momento.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
