"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { SearchButton } from "./ClientElements";

interface Category {
  nombre: string;
  slug: string;
}

export default function Navbar({ categorias }: { categorias: Category[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find active category from current URL or selected
  const activeCategory = categorias.find(
    (c) => pathname === `/categoria/${c.slug}` || pathname.startsWith(`/categoria/${c.slug}/`)
  );

  const [selectedCategoryName, setSelectedCategoryName] = useState<string>(
    activeCategory ? activeCategory.nombre : "Categorías"
  );

  useEffect(() => {
    if (activeCategory) {
      setSelectedCategoryName(activeCategory.nombre);
    } else if (pathname === "/") {
      setSelectedCategoryName("Categorías");
    }
  }, [pathname, activeCategory]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectCategory = (cat: Category) => {
    setSelectedCategoryName(cat.nombre);
    setDropdownOpen(false);
    router.push(`/categoria/${cat.slug}`);
  };

  return (
    <div className='sticky top-2 sm:top-3 z-40 mx-auto mt-2 sm:mt-3 mb-3 sm:mb-4 w-full max-w-6xl px-3 sm:px-6'>
      <nav className='news-surface news-chrome flex w-full items-center justify-between px-2.5 py-2 sm:px-4 sm:py-2.5 font-sans'>
        {/* LADO IZQUIERDO: INICIO Y CATEGORÍAS */}
        <div className='flex items-center gap-1.5 sm:gap-3 min-w-0 flex-shrink'>
          {/* BOTÓN INICIO CON EL MISMO TAMAÑO QUE LAS CATEGORÍAS */}
          <Link
            href='/'
            className={`flex-shrink-0 rounded-lg px-2 sm:px-3 py-1.5 text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-wider transition ${
              pathname === "/"
                ? "bg-sky-500/20 text-sky-400 border border-sky-500/40"
                : "text-zinc-300 hover:text-sky-400 hover:bg-white/5"
            }`}
          >
            Inicio
          </Link>

          {/* DESPLEGABLE EN VISTA MÓVIL Y TABLET */}
          <div className='relative lg:hidden' ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`inline-flex items-center gap-1 rounded-lg px-2 sm:px-3 py-1.5 text-[11px] sm:text-xs md:text-sm font-bold uppercase tracking-wider transition ${
                activeCategory
                  ? "bg-sky-500/20 text-sky-400 border border-sky-500/40"
                  : "text-zinc-300 hover:text-sky-400 hover:bg-white/5"
              }`}
            >
              <span className='truncate max-w-[90px] sm:max-w-[140px]'>
                {selectedCategoryName}
              </span>
              <svg
                className={`h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180 text-sky-400" : "text-zinc-400"
                }`}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2.5' d='M19 9l-7 7-7-7' />
              </svg>
            </button>

            {dropdownOpen && (
              <div className='absolute left-0 top-full mt-2 w-48 rounded-xl border border-sky-400/30 bg-black/95 p-2 shadow-2xl shadow-black/80 backdrop-blur-md z-50 flex flex-col gap-1'>
                {categorias.map((cat) => {
                  const isCatActive = pathname === `/categoria/${cat.slug}`;
                  return (
                    <button
                      key={cat.slug}
                      onClick={() => handleSelectCategory(cat)}
                      className={`w-full text-left rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition ${
                        isCatActive
                          ? "bg-sky-500/20 text-sky-400"
                          : "text-zinc-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {cat.nombre}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* LISTA HORIZONTAL EN ESCRITORIO (TODAS CON EL MISMO TAMAÑO) */}
          <div className='hidden lg:flex items-center gap-x-4 xl:gap-x-6'>
            {categorias.map((cat) => {
              const isCatActive = pathname === `/categoria/${cat.slug}`;
              return (
                <Link
                  key={cat.slug}
                  href={`/categoria/${cat.slug}`}
                  onClick={() => setSelectedCategoryName(cat.nombre)}
                  className={`text-xs md:text-sm font-bold uppercase tracking-wider transition ${
                    isCatActive
                      ? "text-sky-400"
                      : "text-zinc-300 hover:text-sky-400"
                  }`}
                >
                  {cat.nombre}
                </Link>
              );
            })}
          </div>
        </div>

        {/* LADO DERECHO: BÚSQUEDA Y FÚTBOL EN VIVO */}
        <div className='flex items-center gap-1.5 sm:gap-3 ml-auto flex-shrink-0'>
          <SearchButton />

          <Link
            href='/futbol-en-vivo'
            className='inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-red-600 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[9px] sm:text-[11px] md:text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-red-950/40 transition hover:bg-red-700 whitespace-nowrap animate-pulse'
          >
            <span className='h-1.5 w-1.5 rounded-full bg-white animate-ping' />
            FÚTBOL EN VIVO
          </Link>
        </div>
      </nav>
    </div>
  );
}
