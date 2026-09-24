import Link from "next/link";
import { getWordPressBaseUrl, fetchWpNoticias } from "@/lib/wordpress";

export default async function AvisoLegalPage() {
  const baseUrl = getWordPressBaseUrl();

  // Inicializamos las variables vacías de forma segura
  let page = null;
  let recommended = [];

  // 1. Bloque seguro para traer el contenido del Aviso Legal
  try {
    const res = await fetch(`${baseUrl}/pages?slug=sample-page&_embed`, {
      cache: "no-store",
    });
    
    if (res.ok) {
      const pages = await res.json();
      page = Array.isArray(pages) ? pages[0] : null;
    }
  } catch (error) {
    console.warn("Petición del contenido de aviso legal interrumpida o fallida.");
  }

  // 2. Bloque seguro para traer las notas recomendadas del final
  try {
    const recRes = await fetchWpNoticias(
      `per_page=4&_embed&categories_exclude=77&v=${Date.now()}`,
      { cache: "no-store" },
    );
    
    if (recRes.ok) {
      const data = await recRes.json();
      recommended = Array.isArray(data) ? data : [];
    }
  } catch (error) {
    console.warn("Petición de recomendados en aviso legal interrumpida o fallida.");
  }

  // Si no se encuentra la página por caída de red, muestra un aviso elegante en lugar de la pantalla roja
  if (!page)
    return (
      <div className='p-20 text-center text-white font-sans min-h-screen bg-black flex flex-col items-center justify-center gap-4'>
        <p>Aviso Legal no disponible temporalmente.</p>
        <Link href='/' className='news-button'>
          Volver al Inicio
        </Link>
      </div>
    );

  return (
    <main className='max-w-5xl mx-auto px-6 pt-10 text-zinc-300 font-sans min-h-screen bg-black'>
      <header className='mb-8 sm:mb-10 border-b border-zinc-800 pb-5 sm:pb-6 pt-6 sm:pt-10 text-center'>
        <h1 className='text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white inline-flex items-center justify-center gap-3'>
          <span className='h-3 w-3 bg-sky-500 rounded-full animate-pulse shrink-0' />
          <span dangerouslySetInnerHTML={{ __html: page.title.rendered }} />
        </h1>
        <p className='text-zinc-500 text-[10px] uppercase tracking-[0.4em] mt-2'>
          Información Legal
        </p>
      </header>

      {/* CUERPO DE CONTENIDO CON CAJA NEGRA, BORDES REDONDEADOS Y BORDE CIAN/AZUL */}
      <div className='max-w-4xl mx-auto w-full'>
        <article
          className="rounded-2xl bg-black p-5 sm:p-8 md:p-10 shadow-2xl border border-sky-400/40 text-zinc-200 text-sm sm:text-base md:text-lg leading-relaxed text-left sm:text-justify break-words overflow-hidden
                     [&_p]:mb-5 sm:[&_p]:mb-6 [&_p]:block [&_p]:text-zinc-300 [&_p]:leading-relaxed [&_p]:break-words
                     [&_br]:content-[''] [&_br]:block [&_br]:mb-2 sm:[&_br]:mb-3
                     [&_h2]:text-white [&_h2]:text-lg sm:[&_h2]:text-xl md:[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 sm:[&_h2]:mt-8 [&_h2]:mb-3 sm:[&_h2]:mb-4 [&_h2]:break-words
                     [&_h3]:text-white [&_h3]:text-base sm:[&_h3]:text-lg md:[&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-5 sm:[&_h3]:mt-6 [&_h3]:mb-2 sm:[&_h3]:mb-3 [&_h3]:break-words
                     [&_strong]:text-white [&_strong]:font-bold
                     [&_em]:italic [&_em]:text-zinc-300
                     [&_ul]:list-disc [&_ul]:ml-5 sm:[&_ul]:ml-6 [&_ul]:mb-5 sm:[&_ul]:mb-6 [&_ul]:text-zinc-300
                     [&_ol]:list-decimal [&_ol]:ml-5 sm:[&_ol]:ml-6 [&_ol]:mb-5 sm:[&_ol]:mb-6 [&_ol]:text-zinc-300
                     [&_li]:mb-1.5 sm:[&_li]:mb-2 [&_li]:text-zinc-300
                     [&_blockquote]:border-l-4 [&_blockquote]:border-sky-500 [&_blockquote]:pl-3 sm:[&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-zinc-400 [&_blockquote]:my-4 sm:[&_blockquote]:my-6
                     [&_a]:text-sky-400 [&_a]:underline [&_a]:hover:text-sky-300 [&_a]:font-medium [&_a]:break-all transition
                     [&_img]:rounded-xl [&_img]:mx-auto [&_img]:my-4 sm:[&_img]:my-6 [&_img]:max-w-full [&_img]:h-auto
                     [&_table]:w-full [&_table]:max-w-full [&_table]:overflow-x-auto [&_table]:block"
          dangerouslySetInnerHTML={{ __html: page.content.rendered }}
        />
      </div>

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
        <h3 className='text-lg font-bold uppercase tracking-widest mb-8 text-white border-l-4 border-sky-500 pl-4'>
          Recomendados
        </h3>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
          {recommended.slice(0, 4).map((rec: any) => (
            <Link key={rec.id} href={rec.slug ? `/${rec.slug}` : "/"} className='news-card group block p-3'>
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
