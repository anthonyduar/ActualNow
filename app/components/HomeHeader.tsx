"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SafeDate } from "./ClientElements";
import LatestNewsBanner from "./LatestNewsBanner";

export default function HomeHeader({ tickerPosts }: { tickerPosts: any[] }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className='max-w-6xl mx-auto w-full px-3 sm:px-6 pt-3 sm:pt-5 pb-0'>
      {/* Barra superior: logo pegado a la izquierda y fecha/hora a la derecha, en TODAS las páginas */}
      <div className='flex items-center justify-between mb-2'>
        <Link
          href='/'
          className='inline-flex items-center group'
          aria-label='ActualNow Inicio'
        >
          <img
            src='/isotipo.webp'
            alt='ActualNow'
            className='h-6 sm:h-7 w-auto object-contain transition group-hover:opacity-85'
          />
          <img
            src='/logotipo.webp'
            alt='ActualNow'
className='h-4 sm:h-5 w-auto object-contain ml-3 translate-y-1 transition group-hover:opacity-85'          />
        </Link>
        <div className='text-[10px] font-bold text-gray-500 uppercase tracking-widest'>
          <SafeDate />
        </div>
      </div>

      {/* El banner de noticias de última hora SOLO se muestra en la página de inicio */}
      {isHome && <LatestNewsBanner posts={tickerPosts} />}
    </header>
  );
}
