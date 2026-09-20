"use client";
import { useEffect, useState } from "react";
import { fetchWpNoticias } from "@/lib/wordpress";

export function SafeDate({ format = "full" }: { format?: "full" | "year" }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <span className='opacity-0'>...</span>;

  if (format === "year") return <>{new Date().getFullYear()}</>;
  return (
    <>
      {new Date().toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
    </>
  );
}

export function SearchButton() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(Array.isArray(data) ? data : []);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Error en búsqueda:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);

  const handleSelectResult = (slug: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    setResults([]);
    if (slug?.trim()) {
      window.location.href = `/${slug}`;
    }
  };

  return (
    <>
      <div className='flex items-center'>
        {/* BOTÓN BUSCAR */}
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          aria-label='Buscar'
          className='flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-white/5 px-2.5 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-zinc-300 transition hover:border-sky-400 hover:bg-sky-400/10 hover:text-sky-400'
        >
          <svg
            className='h-3.5 w-3.5 sm:h-4 sm:w-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2.5'
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
          <span className='hidden md:inline'>Buscar</span>
        </button>
      </div>

      {/* MODAL DE BÚSQUEDA */}
      {searchOpen && (
        <div
          className='fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/85 px-4 py-8 backdrop-blur-md sm:py-16'
          onClick={() => setSearchOpen(false)}
        >
          <div
            className='w-full max-w-2xl overflow-hidden rounded-2xl border border-sky-400/30 bg-zinc-950 shadow-2xl shadow-black/80'
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER DEL MODAL */}
            <div className='flex items-center justify-between border-b border-zinc-800 bg-black/80 px-5 py-4'>
              <h2 className='text-xs sm:text-sm font-black uppercase tracking-widest text-sky-400'>
                Buscar noticia
              </h2>
              <button
                onClick={() => setSearchOpen(false)}
                className='rounded-lg p-1.5 text-zinc-400 transition hover:bg-white/10 hover:text-white'
              >
                ✕
              </button>
            </div>

            {/* INPUT DE BÚSQUEDA */}
            <div className='border-b border-zinc-800 p-4 sm:p-5 bg-black/40'>
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Escribe el título o tema de la noticia...'
                autoFocus
                className='w-full rounded-xl border border-sky-400/30 bg-black/80 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-sky-400 focus:ring-1 focus:ring-sky-400'
              />
            </div>

            {/* RESULTADOS */}
            <div className='max-h-[60vh] overflow-y-auto p-2 sm:p-3'>
              {loading && (
                <div className='p-8 text-center text-zinc-400'>
                  <div className='inline-block h-6 w-6 animate-spin rounded-full border-2 border-sky-400 border-t-transparent mb-2' />
                  <p className='text-xs uppercase tracking-widest'>Buscando...</p>
                </div>
              )}

              {!loading && searchQuery && results.length === 0 && (
                <div className='p-8 text-center text-zinc-400'>
                  <p className='text-sm'>No se encontraron noticias para &quot;{searchQuery}&quot;</p>
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className='flex flex-col gap-1'>
                  {results.map((result: any) => {
                    const imgUrl =
                      result._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
                    return (
                      <button
                        key={result.id}
                        onClick={() => handleSelectResult(result.slug)}
                        className='group flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-zinc-900 border border-transparent hover:border-zinc-800'
                      >
                        {/* ICONO PEQUEÑO */}
                        <div className='h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0 overflow-hidden rounded-lg bg-zinc-900'>
                          {imgUrl ? (
                            <img
                              src={imgUrl}
                              className='h-full w-full object-cover transition duration-300 group-hover:scale-105'
                              alt=''
                            />
                          ) : (
                            <div className='flex h-full w-full items-center justify-center text-zinc-700 text-xs'>
                              ActualNow
                            </div>
                          )}
                        </div>
                        {/* CONTENIDO */}
                        <div className='min-w-0 flex-1'>
                          <h3
                            className='line-clamp-2 text-xs sm:text-sm font-bold text-white transition group-hover:text-sky-400'
                            dangerouslySetInnerHTML={{
                              __html: result.title.rendered,
                            }}
                          />
                          <p className='mt-1 line-clamp-1 text-[11px] text-zinc-400'>
                            {result.excerpt?.rendered
                              ? result.excerpt.rendered.replace(/<[^>]*>/g, "")
                              : "Leer noticia completa..."}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {!loading && !searchQuery && (
                <div className='p-8 text-center text-zinc-500'>
                  <p className='text-xs uppercase tracking-widest'>Escribe para buscar noticias</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function RefreshButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      className='inline-flex items-center justify-center gap-2 rounded-full border border-sky-400/30 bg-white/5 px-5 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-300 transition hover:border-sky-400 hover:bg-sky-400/10 hover:text-sky-400'
    >
      <svg
        className='h-3.5 w-3.5 text-sky-400'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='3'
          d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
        />
      </svg>
      Actualizar
    </button>
  );
}
