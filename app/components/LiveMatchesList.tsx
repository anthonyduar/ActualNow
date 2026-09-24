"use client";
import { useState, useEffect, useMemo } from "react";

const LIVE_STATUSES = ["IN_PLAY", "PAUSED", "LIVE", "IN_PLAY_PENALTIES", "EXTRA_TIME"];

export default function LiveMatchesList({
  initialMatches,
}: {
  initialMatches: any[];
}) {
  const [matches, setMatches] = useState(initialMatches || []);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "live" | "finished" | "upcoming">("live");

  const liveMatches = useMemo(() => {
    return matches.filter((m) => LIVE_STATUSES.includes(m.status));
  }, [matches]);

  const finishedMatches = useMemo(() => {
    return matches.filter((m) => m.status === "FINISHED");
  }, [matches]);

  const upcomingMatches = useMemo(() => {
    return matches.filter((m) => m.status === "TIMED" || m.status === "SCHEDULED");
  }, [matches]);

  // Si no hay partidos en vivo al cargar, seleccionar 'todos' por defecto para no mostrar lista vacía
  useEffect(() => {
    if (liveMatches.length === 0 && matches.length > 0 && activeFilter === "live") {
      setActiveFilter("all");
    }
  }, [liveMatches.length, matches.length, activeFilter]);

  const refreshMatches = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/football");
      if (!res.ok) throw new Error("Error en la API");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setMatches(data);
      }
    } catch (e) {
      console.error("Error al refrescar partidos:", e);
    } finally {
      setLoading(false);
    }
  };

  // Cargar en cliente al montar si venía vacío o para refrescar
  useEffect(() => {
    if (!initialMatches || initialMatches.length === 0) {
      refreshMatches();
    }
    const interval = setInterval(refreshMatches, 45000);
    return () => clearInterval(interval);
  }, [initialMatches]);

  const filteredMatches = useMemo(() => {
    switch (activeFilter) {
      case "live":
        return liveMatches;
      case "finished":
        return finishedMatches;
      case "upcoming":
        return upcomingMatches;
      default:
        return matches;
    }
  }, [activeFilter, matches, liveMatches, finishedMatches, upcomingMatches]);

  const formatMatchTime = (utcDateString: string) => {
    try {
      const date = new Date(utcDateString);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "Hoy";
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 bg-sky-500 rounded-full animate-pulse shrink-0"></div>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white">
            Resultados de Fútbol
          </h2>
        </div>
        <button
          onClick={refreshMatches}
          disabled={loading}
          className="news-button text-xs py-2 px-4 disabled:opacity-50 w-full sm:w-auto"
        >
          {loading ? "ACTUALIZANDO..." : "ACTUALIZAR RESULTADOS"}
        </button>
      </div>

      {/* PESTAÑAS DE FILTRO */}
      <div className="flex flex-wrap items-center gap-2 mb-6 pb-2 border-b border-zinc-800">
        <button
          onClick={() => setActiveFilter("live")}
          className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
            activeFilter === "live"
              ? "bg-red-500/20 text-red-400 border border-red-500/40 shadow-lg shadow-red-950/40"
              : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
          }`}
        >
          ● En Vivo ({liveMatches.length})
        </button>

        <button
          onClick={() => setActiveFilter("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
            activeFilter === "all"
              ? "bg-sky-500 text-white shadow-lg shadow-sky-950/40"
              : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
          }`}
        >
          Todos ({matches.length})
        </button>

        <button
          onClick={() => setActiveFilter("finished")}
          className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
            activeFilter === "finished"
              ? "bg-sky-500 text-white shadow-lg shadow-sky-950/40"
              : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
          }`}
        >
          Finalizados ({finishedMatches.length})
        </button>

        <button
          onClick={() => setActiveFilter("upcoming")}
          className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
            activeFilter === "upcoming"
              ? "bg-sky-500 text-white shadow-lg shadow-sky-950/40"
              : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
          }`}
        >
          Próximos ({upcomingMatches.length})
        </button>
      </div>

      {/* LISTADO DE PARTIDOS */}
      <div className="grid gap-3 sm:gap-4 mb-16">
        {filteredMatches && filteredMatches.length > 0 ? (
          filteredMatches.map((match: any) => {
            const isLive = LIVE_STATUSES.includes(match.status);
            const isPaused = match.status === "PAUSED";
            const isFinished = match.status === "FINISHED";
            const isUpcoming = match.status === "TIMED" || match.status === "SCHEDULED";

            return (
              <div
                key={match.id}
                className="news-card p-4 sm:p-5 flex justify-between items-center group hover:border-sky-400/60 transition-all"
              >
                {/* EQUIPO LOCAL */}
                <div className="flex-1 flex items-center justify-end gap-2 sm:gap-3 font-bold uppercase text-xs sm:text-sm text-white group-hover:text-sky-400 transition text-right">
                  <span className="hidden md:inline">{match.homeTeam?.name}</span>
                  <span className="md:hidden">
                    {match.homeTeam?.tla || match.homeTeam?.shortName || match.homeTeam?.name}
                  </span>
                  {match.homeTeam?.crest && (
                    <img
                      src={match.homeTeam.crest}
                      alt=""
                      className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0"
                    />
                  )}
                </div>

                {/* MARCADOR O HORARIO */}
                <div className="mx-2 sm:mx-4 md:mx-6 bg-black px-3 sm:px-4 py-2 rounded-lg border border-sky-500/60 text-center min-w-[95px] sm:min-w-[115px] shrink-0">
                  {match.competition?.name && (
                    <div className="text-[8px] sm:text-[9px] text-zinc-400 font-bold uppercase truncate max-w-[90px] sm:max-w-[110px] mx-auto mb-0.5">
                      {match.competition.name}
                    </div>
                  )}

                  {isUpcoming ? (
                    <span className="text-sky-400 font-mono font-bold text-sm sm:text-base">
                      {formatMatchTime(match.utcDate)}
                    </span>
                  ) : (
                    <span className="text-sky-400 font-mono font-bold text-base sm:text-lg">
                      {match.score?.fullTime?.home ?? 0} - {match.score?.fullTime?.away ?? 0}
                    </span>
                  )}

                  <div className="text-[9px] font-bold tracking-tight uppercase text-zinc-400 mt-0.5">
                    {isPaused ? (
                      <span className="text-amber-400">Entretiempo</span>
                    ) : isLive ? (
                      <span className="text-red-400 animate-pulse font-extrabold">● En Vivo</span>
                    ) : isFinished ? (
                      <span className="text-zinc-400">Final</span>
                    ) : (
                      <span className="text-sky-300">Por Jugar</span>
                    )}
                  </div>
                </div>

                {/* EQUIPO VISITANTE */}
                <div className="flex-1 flex items-center justify-start gap-2 sm:gap-3 font-bold uppercase text-xs sm:text-sm text-white group-hover:text-sky-400 transition text-left">
                  {match.awayTeam?.crest && (
                    <img
                      src={match.awayTeam.crest}
                      alt=""
                      className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0"
                    />
                  )}
                  <span className="hidden md:inline">{match.awayTeam?.name}</span>
                  <span className="md:hidden">
                    {match.awayTeam?.tla || match.awayTeam?.shortName || match.awayTeam?.name}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="news-card p-12 text-center">
            <p className="text-zinc-400 uppercase tracking-widest text-sm italic">
              {activeFilter === "live"
                ? "No hay partidos en juego en este momento. Revisa la pestaña 'Todos' o 'Próximos'."
                : "No se encontraron partidos para este filtro."}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
