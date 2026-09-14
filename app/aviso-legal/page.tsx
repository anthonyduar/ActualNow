import Link from "next/link";

export default async function AvisoLegalPage() {
  const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

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
    const recRes = await fetch(
      `${baseUrl}/posts?per_page=4&_embed&categories_exclude=77&v=${Date.now()}`,
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
      <div className='p-20 text-center text-white font-sans min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4'>
        <p>Aviso Legal no disponible temporalmente.</p>
        <Link href='/' className='bg-sky-500 text-white px-6 py-2 rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-sky-600 transition-colors'>
          Volver al Inicio
        </Link>
      </div>
    );

  return (
    <main className='max-w-5xl mx-auto px-6 pt-10 text-zinc-300 font-sans min-h-screen'>
      <header className='mb-10 border-b border-zinc-800 pb-6 text-center'>
        <h1
          className='text-4xl font-bold text-white uppercase tracking-tighter'
          dangerouslySetInnerHTML={{ __html: page.title.rendered }}
        />
        <p className='text-zinc-500 text-[10px] uppercase tracking-[0.4em] mt-2'>
          Información Legal
        </p>
      </header>

      <div
        className='max-w-4xl mx-auto text-justify leading-relaxed text-lg [&>p]:mb-6 [&>h2]:text-white [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-10'
        dangerouslySetInnerHTML={{ __html: page.content.rendered }}
      />

      <div className='text-center mt-10'>
        <Link
          href='/'
          className='inline-block bg-sky-500 text-white px-8 py-2 rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-sky-600 transition-colors'
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
                className='text-sm font-bold leading-tight group-hover:text-sky-500 transition line-clamp-3 text-white'
                dangerouslySetInnerHTML={{ __html: rec.title.rendered }}
              />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
