"use client";

import { useState, useEffect, useMemo } from "react";

const LIVE_STATUSES = ["IN_PLAY", "PAUSED", "LIVE", "IN_PLAY_PENALTIES", "EXTRA_TIME"];

function formatMatchDate(utcDateString: string) {
  try {
    const matchDate = new Date(utcDateString);
    const now = new Date();

    const isToday = matchDate.toDateString() === now.toDateString();

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = matchDate.toDateString() === yesterday.toDateString();

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow = matchDate.toDateString() === tomorrow.toDateString();

    const timeStr = matchDate.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    if (isToday) return `Hoy ${timeStr}`;
    if (isYesterday) return `Ayer ${timeStr}`;
    if (isTomorrow) return `Mañana ${timeStr}`;

    const dateStr = matchDate.toLocaleDateString("es-ES", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
    return `${dateStr} · ${timeStr}`;
  } catch {
    return "";
  }
}

function getLeagueDisplayName(name: string = ""): string {
  if (name.includes("Primera Division")) return "LaLiga";
  if (name.includes("Campeonato Brasileiro")) return "Brasileirão";
  return name;
}

export default function LiveMatchesList({
  initialMatches,
}: {
  initialMatches: any[];
}) {
  const [matches, setMatches] = useState<any[]>(initialMatches || []);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "live" | "finished" | "upcoming">("all");
  const [selectedLeague, setSelectedLeague] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    setLastUpdated(
      new Date().toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    );
  }, []);

  const liveMatches = useMemo(() => {
    return matches.filter((m) => LIVE_STATUSES.includes(m.status));
  }, [matches]);

  const finishedMatches = useMemo(() => {
    return matches.filter((m) => m.status === "FINISHED");
  }, [matches]);

  const upcomingMatches = useMemo(() => {
    return matches.filter((m) => m.status === "TIMED" || m.status === "SCHEDULED");
  }, [matches]);

  // Si hay partidos en juego en tiempo real, abrir por defecto la pestaña En Vivo
  useEffect(() => {
    if (liveMatches.length > 0 && activeFilter === "all") {
      setActiveFilter("live");
    }
  }, [liveMatches.length, activeFilter]);

  // Extraer las ligas disponibles dinámicamente con su conteo y emblema
  const competitions = useMemo(() => {
    const map = new Map<string, { name: string; emblem?: string; count: number }>();
    matches.forEach((m) => {
      const compName = m.competition?.name || "Otras";
      const existing = map.get(compName);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(compName, {
          name: compName,
          emblem: m.competition?.emblem,
          count: 1,
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [matches]);

  const refreshMatches = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/football");
      if (!res.ok) throw new Error("Error en la API");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setMatches(data);
        setLastUpdated(
          new Date().toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        );
      }
    } catch (e) {
      console.error("Error al refrescar partidos:", e);
    } finally {
      setLoading(false);
    }
  };

  // Cargar en cliente al montar y refresco cada 45 segundos
  useEffect(() => {
    if (!initialMatches || initialMatches.length === 0) {
      refreshMatches();
    }
    const interval = setInterval(refreshMatches, 45000);
    return () => clearInterval(interval);
  }, [initialMatches]);

  const filteredMatches = useMemo(() => {
    let result = matches;

    // 1. Filtro por estado
    switch (activeFilter) {
      case "live":
        result = liveMatches;
        break;
      case "finished":
        result = finishedMatches;
        break;
      case "upcoming":
        result = upcomingMatches;
        break;
      default:
        result = matches;
        break;
    }

    // 2. Filtro por liga
    if (selectedLeague !== "all") {
      result = result.filter((m) => m.competition?.name === selectedLeague);
    }

    // 3. Filtro por búsqueda de equipo o liga
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((m) => {
        const home = (m.homeTeam?.name || "").toLowerCase();
        const away = (m.awayTeam?.name || "").toLowerCase();
        const comp = (m.competition?.name || "").toLowerCase();
        return home.includes(q) || away.includes(q) || comp.includes(q);
      });
    }

    return result;
  }, [activeFilter, selectedLeague, searchQuery, matches, liveMatches, finishedMatches, upcomingMatches]);

  return (
    <div className="w-full">
      {/* CABECERA SUPERIOR DE ESTADO Y BOTÓN DE ACTUALIZACIÓN */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 bg-sky-500 rounded-full animate-pulse shrink-0"></div>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white">
              Marcadores y Resultados en Directo
            </h2>
          </div>
          {lastUpdated && (
            <p className="text-[11px] text-zinc-400 mt-1 pl-6">
              Sincronizado a las <span className="text-sky-400 font-mono font-medium">{lastUpdated}</span> · Datos oficiales de ligas de primera división
            </p>
          )}
        </div>

        <button
          onClick={refreshMatches}
          disabled={loading}
          className="news-button text-xs py-2.5 px-5 disabled:opacity-50 w-full sm:w-auto inline-flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-sky-950/20"
        >
          <svg
            className={`w-3.5 h-3.5 ${loading ? "animate-spin text-sky-400" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {loading ? "ACTUALIZANDO..." : "ACTUALIZAR RESULTADOS"}
        </button>
      </div>

      {/* PESTAÑAS DE FILTRO POR ESTADO */}
      <div className="flex flex-wrap items-center gap-2 mb-4 pb-2 border-b border-zinc-800">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeFilter === "all"
              ? "bg-sky-500 text-white shadow-lg shadow-sky-950/40"
              : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
          }`}
        >
          Todos ({matches.length})
        </button>

        <button
          onClick={() => setActiveFilter("live")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-1.5 ${
            activeFilter === "live"
              ? "bg-red-500/20 text-red-400 border border-red-500/50 shadow-lg shadow-red-950/50 font-black"
              : liveMatches.length > 0
              ? "bg-red-950/40 text-red-400 hover:bg-red-900/60 border border-red-800/40 animate-pulse"
              : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${liveMatches.length > 0 ? "bg-red-500 animate-ping" : "bg-zinc-500"}`} />
          En Vivo ({liveMatches.length})
        </button>

        <button
          onClick={() => setActiveFilter("finished")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeFilter === "finished"
              ? "bg-sky-500 text-white shadow-lg shadow-sky-950/40"
              : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
          }`}
        >
          Finalizados ({finishedMatches.length})
        </button>

        <button
          onClick={() => setActiveFilter("upcoming")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeFilter === "upcoming"
              ? "bg-sky-500 text-white shadow-lg shadow-sky-950/40"
              : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
          }`}
        >
          Próximos ({upcomingMatches.length})
        </button>
      </div>

      {/* BARRA DE BÚSQUEDA Y SELECTOR DE LIGAS */}
      <div className="flex flex-col md:flex-row gap-3 mb-6 items-stretch md:items-center justify-between">
        {/* BUSCADOR */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por equipo o liga (ej: Madrid, City, Barcelona...)"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 pl-9 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-sky-500 transition"
          />
          <svg
            className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2 text-zinc-500 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* SELECTOR DE COMPETICIÓN */}
        {competitions.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none max-w-full">
            <button
              onClick={() => setSelectedLeague("all")}
              className={`px-3 py-1 rounded-lg text-[11px] font-semibold shrink-0 transition cursor-pointer ${
                selectedLeague === "all"
                  ? "bg-sky-400/20 text-sky-400 border border-sky-400/40"
                  : "bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              Todas las ligas
            </button>
            {competitions.slice(0, 8).map((comp) => (
              <button
                key={comp.name}
                onClick={() => setSelectedLeague(comp.name)}
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold shrink-0 transition flex items-center gap-1.5 cursor-pointer ${
                  selectedLeague === comp.name
                    ? "bg-sky-400/20 text-sky-400 border border-sky-400/40"
                    : "bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-800"
                }`}
              >
                {comp.emblem && (
                  <img src={comp.emblem} alt="" className="w-3.5 h-3.5 object-contain" />
                )}
                <span>{getLeagueDisplayName(comp.name)}</span>
                <span className="text-[9px] opacity-60">({comp.count})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* LISTADO DE PARTIDOS */}
      <div className="grid gap-3 sm:gap-4 mb-16">
        {filteredMatches && filteredMatches.length > 0 ? (
          filteredMatches.map((match: any) => {
            const isLive = LIVE_STATUSES.includes(match.status);
            const isPaused = match.status === "PAUSED";
            const isFinished = match.status === "FINISHED";
            const isUpcoming = match.status === "TIMED" || match.status === "SCHEDULED";

            const homeScore =
              match.score?.fullTime?.home ??
              match.score?.regularTime?.home ??
              match.score?.halfTime?.home ??
              (isFinished ? 0 : null);

            const awayScore =
              match.score?.fullTime?.away ??
              match.score?.regularTime?.away ??
              match.score?.halfTime?.away ??
              (isFinished ? 0 : null);

            const hasHalfTime =
              match.score?.halfTime?.home !== null &&
              match.score?.halfTime?.home !== undefined &&
              match.score?.halfTime?.away !== null &&
              match.score?.halfTime?.away !== undefined;

            return (
              <div
                key={match.id}
                className={`news-card p-3.5 sm:p-5 flex justify-between items-center group transition-all ${
                  isLive
                    ? "border-red-500/50 bg-gradient-to-r from-red-950/20 via-zinc-950 to-red-950/20 shadow-lg shadow-red-950/30"
                    : "hover:border-sky-400/60"
                }`}
              >
                {/* EQUIPO LOCAL */}
                <div className="flex-1 flex items-center justify-end gap-2 sm:gap-3 font-bold uppercase text-xs sm:text-sm text-white group-hover:text-sky-400 transition text-right">
                  <span className="hidden md:inline line-clamp-1">{match.homeTeam?.name}</span>
                  <span className="md:hidden line-clamp-1">
                    {match.homeTeam?.shortName || match.homeTeam?.tla || match.homeTeam?.name}
                  </span>
                  {match.homeTeam?.crest ? (
                    <img
                      src={match.homeTeam.crest}
                      alt={match.homeTeam?.name || "Local"}
                      className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0 drop-shadow"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400 shrink-0">
                      ⚽
                    </div>
                  )}
                </div>

                {/* MARCADOR O HORARIO */}
                <div className="mx-2 sm:mx-4 md:mx-6 bg-black/90 px-3 sm:px-4 py-2 rounded-xl border border-sky-500/50 text-center min-w-[100px] sm:min-w-[130px] shrink-0 shadow-lg">
                  {/* COMPETICIÓN */}
                  {match.competition?.name && (
                    <div className="flex items-center justify-center gap-1 text-[8px] sm:text-[9px] text-zinc-400 font-bold uppercase truncate max-w-[95px] sm:max-w-[125px] mx-auto mb-1">
                      {match.competition.emblem && (
                        <img src={match.competition.emblem} alt="" className="w-2.5 h-2.5 object-contain" />
                      )}
                      <span className="truncate">{getLeagueDisplayName(match.competition.name)}</span>
                    </div>
                  )}

                  {/* RESULTADO O HORA */}
                  {isUpcoming ? (
                    <div className="text-sky-400 font-mono font-bold text-xs sm:text-sm py-0.5">
                      {formatMatchDate(match.utcDate)}
                    </div>
                  ) : (
                    <div>
                      <span className={`font-mono font-black text-base sm:text-xl tracking-wider ${isLive ? "text-red-400" : "text-sky-400"}`}>
                        {homeScore ?? 0} - {awayScore ?? 0}
                      </span>
                      {hasHalfTime && (
                        <div className="text-[8px] text-zinc-500 font-mono">
                          (MT {match.score.halfTime.home}-{match.score.halfTime.away})
                        </div>
                      )}
                    </div>
                  )}

                  {/* ESTADO */}
                  <div className="text-[9px] font-bold tracking-tight uppercase mt-1">
                    {isPaused ? (
                      <span className="text-amber-400 font-black">Entretiempo</span>
                    ) : isLive ? (
                      <span className="text-red-400 animate-pulse font-black flex items-center justify-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        En Vivo
                      </span>
                    ) : isFinished ? (
                      <span className="text-zinc-400">{formatMatchDate(match.utcDate)}</span>
                    ) : (
                      <span className="text-sky-300 font-medium">Por Jugar</span>
                    )}
                  </div>
                </div>

                {/* EQUIPO VISITANTE */}
                <div className="flex-1 flex items-center justify-start gap-2 sm:gap-3 font-bold uppercase text-xs sm:text-sm text-white group-hover:text-sky-400 transition text-left">
                  {match.awayTeam?.crest ? (
                    <img
                      src={match.awayTeam.crest}
                      alt={match.awayTeam?.name || "Visitante"}
                      className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0 drop-shadow"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400 shrink-0">
                      ⚽
                    </div>
                  )}
                  <span className="hidden md:inline line-clamp-1">{match.awayTeam?.name}</span>
                  <span className="md:hidden line-clamp-1">
                    {match.awayTeam?.shortName || match.awayTeam?.tla || match.awayTeam?.name}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="news-card p-12 text-center">
            <p className="text-zinc-400 uppercase tracking-widest text-xs sm:text-sm italic">
              {activeFilter === "live"
                ? "No hay partidos en juego en este momento. Revisa la pestaña 'Todos' o 'Finalizados' para ver los últimos marcadores."
                : searchQuery
                ? `No se encontraron partidos para "${searchQuery}".`
                : "No se encontraron partidos para este filtro."}
            </p>
            {activeFilter !== "all" && (
              <button
                onClick={() => {
                  setActiveFilter("all");
                  setSelectedLeague("all");
                  setSearchQuery("");
                }}
                className="news-button mt-4 text-[10px]"
              >
                Ver todos los partidos
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
