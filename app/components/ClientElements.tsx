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
  const handleSearch = () => {
    const query = window.prompt("¿Qué noticia buscas?");
    if (query) window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  return (
    <div className="ml-auto flex items-center group border-l pl-8 border-gray-200">
      <button
        onClick={handleSearch}
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
