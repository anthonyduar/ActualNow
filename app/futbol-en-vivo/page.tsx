import Link from "next/link";
import { getLiveMatches } from "@/lib/football";
import LiveMatchesList from "../components/LiveMatchesList";
import { fetchWpNoticias } from "@/lib/wordpress";

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
    <main className='max-w-5xl mx-auto px-6 pt-10 text-white min-h-screen font-sans'>
      {/* Componente que maneja los partidos y el refresco interno */}
      <LiveMatchesList initialMatches={initialMatches} />

      <div className='text-center mt-10'>
        <Link
          href='/'
          className='inline-block bg-sky-500 text-white px-8 py-2 rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-sky-600 transition'
        >
          Volver al Inicio
        </Link>
      </div>

      {/* RECOMENDADOS */}
      <section className='mt-10 border-t border-zinc-800 pt-10'>
        <h3 className='text-lg font-bold uppercase tracking-widest mb-8 border-l-4 border-sky-500 pl-4'>
          Recomendados
        </h3>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
          {recommended.map((rec: any) => (
            <Link key={rec.id} href={`/${rec.slug}`} className='group'>
              <div className='aspect-square mb-3 overflow-hidden rounded bg-zinc-800'>
                {rec._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
                  <img
                    src={rec._embedded["wp:featuredmedia"][0].source_url}
                    className='object-cover w-full h-full group-hover:scale-105 transition duration-500'
                    alt=''
                  />
                )}
              </div>
              <h4
                className='text-sm font-bold leading-tight group-hover:text-sky-500 transition line-clamp-3'
                dangerouslySetInnerHTML={{ __html: rec.title.rendered }}
              />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
