import Link from "next/link";
import { getLiveMatches } from "@/lib/football";
import LiveMatchesList from "../components/LiveMatchesList";
import { fetchWpNoticias } from "@/lib/wordpress";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EnVivo() {
  // 1. Ejecutamos las consultas de forma segura con control de errores
  let initialMatches = [];
  let recommended = [];

  try {
    initialMatches = await getLiveMatches();
  } catch (err) {
    console.warn("No se pudieron cargar los partidos en vivo de forma segura.");
  }

  try {
    const recRes = await fetchWpNoticias(
      `per_page=4&_embed&categories_exclude=77&v=${Date.now()}`,
      { cache: "no-store" },
    );
    
    // Si la descarga se corta al cambiar de ruta, frena pacíficamente
    if (recRes.ok) {
      const data = await recRes.json();
      recommended = Array.isArray(data) ? data : [];
    }
  } catch (error) {
    console.warn("Petición de recomendados en fútbol interrumpida de forma segura.");
  }


  return (
    <main className='max-w-5xl mx-auto px-3 sm:px-6 pt-3 sm:pt-6 text-white min-h-screen font-sans bg-black'>
      <header className='mb-8 sm:mb-10 border-b border-zinc-800 pb-5 sm:pb-6 pt-6 sm:pt-10 text-center'>
        <h1 className='text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white inline-flex items-center justify-center gap-3'>
          <span className='h-3 w-3 bg-sky-500 rounded-full animate-pulse shrink-0' />
          <span>Fútbol en Vivo</span>
        </h1>
        <p className='text-zinc-500 text-[10px] uppercase tracking-[0.4em] mt-2'>
          ActualNow
        </p>
      </header>

      {/* Componente que maneja los partidos y el refresco interno */}
      <LiveMatchesList initialMatches={initialMatches} />

      <div className='text-center mt-10'>
        <Link
          href='/'
          className='news-button'
        >
          Volver al Inicio
        </Link>
      </div>

      {/* RECOMENDADOS */}
      <section className='mt-10 border-t border-zinc-800 pt-10'>
        <h3 className='text-base sm:text-lg font-bold uppercase tracking-widest mb-6 sm:mb-8 border-l-4 border-sky-500 pl-3 sm:pl-4'>
          Recomendados
        </h3>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6'>
          {recommended.map((rec: any) => (
            <Link key={rec.id} href={rec.slug ? `/${rec.slug}` : "/"} className='news-card group block p-2.5 sm:p-3'>
              <div className='aspect-square mb-2 sm:mb-3 overflow-hidden rounded bg-zinc-800'>
                {rec._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
                  <img
                    src={rec._embedded["wp:featuredmedia"][0].source_url}
                    className='object-cover w-full h-full group-hover:scale-105 transition duration-500'
                    alt=''
                  />
                )}
              </div>
              <h4
                className='text-xs sm:text-sm font-bold leading-tight group-hover:text-sky-500 transition line-clamp-2 sm:line-clamp-3'
                dangerouslySetInnerHTML={{ __html: rec.title.rendered }}
              />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
