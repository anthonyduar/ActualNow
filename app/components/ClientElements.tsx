"use client";
import { useEffect, useState } from "react";

export function SafeDate({ format = "full" }: { format?: "full" | "year" }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <span className="opacity-0">...</span>;

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

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/posts?search=${encodeURIComponent(query)}&_embed&per_page=10&categories_exclude=77&v=${Date.now()}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error en búsqueda:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  const handleSelectResult = (slug: string) => {
    setSearchOpen(false);
    setSearchQuery("");
    setResults([]);
    window.location.href = `/posts/${slug}`;
  };

  return (
    <>
      <div className="ml-auto flex items-center group border-l pl-8 border-gray-200">
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="flex items-center gap-2 font-bold hover:text-sky-500 transition uppercase text-gray-700"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span className="hidden sm:inline">Buscar</span>
        </button>
      </div>

      {/* MODAL DE BÚSQUEDA */}
      {searchOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 flex items-start justify-center pt-20"
          onClick={() => setSearchOpen(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER DEL MODAL */}
            <div className="bg-gradient-to-r from-sky-500 to-sky-600 p-4 flex justify-between items-center">
              <h2 className="text-white font-bold uppercase tracking-wide">Buscar noticia</h2>
              <button
                onClick={() => setSearchOpen(false)}
                className="text-white hover:bg-white/20 p-1 rounded transition"
              >
                ✕
              </button>
            </div>

            {/* INPUT DE BÚSQUEDA */}
            <div className="p-4 border-b border-gray-200">
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder="Escribe el nombre de la noticia..."
                autoFocus
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-sky-500 text-gray-700"
              />
            </div>

            {/* RESULTADOS */}
            <div className="max-h-96 overflow-y-auto">
              {loading && (
                <div className="p-8 text-center text-gray-500">
                  <p>Buscando...</p>
                </div>
              )}

              {!loading && searchQuery && results.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <p>No se encontraron resultados</p>
                </div>
              )}

              {!loading && results.length > 0 && (
                <div className="divide-y divide-gray-200">
                  {results.map((result: any) => (
                    <button
                      key={result.id}
                      onClick={() => handleSelectResult(result.slug)}
                      className="w-full flex gap-3 p-3 hover:bg-gray-50 transition text-left"
                    >
                      {/* ICONO PEQUEÑO */}
                      <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-200">
                        {result._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
                          <img
                            src={result._embedded["wp:featuredmedia"][0].source_url}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        )}
                      </div>
                      {/* CONTENIDO */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-bold text-gray-900 text-sm leading-tight line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: result.title.rendered }}
                        />
                        <p className="text-gray-500 text-xs mt-1 line-clamp-1">
                          {result.excerpt.rendered ? result.excerpt.rendered.replace(/<[^>]*>/g, '') : "Sin descripción"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {!loading && !searchQuery && (
                <div className="p-8 text-center text-gray-500">
                  <p className="text-sm">Escribe para buscar noticias</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
// ... (Aquí termina tu SearchButton)

export function RefreshButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      className="flex items-center gap-2 text-xs font-bold uppercase bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg transition text-white"
    >
      <svg
        className="w-4 h-4 text-sky-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      Actualizar
    </button>
  );
}
