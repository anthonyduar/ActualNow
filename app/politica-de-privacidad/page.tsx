import Link from "next/link";

export default async function PrivacidadPage() {
  const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

  try {
    // 1. Obtener la página legal
    const res = await fetch(`${baseUrl}/pages?slug=privacy-policy`, {
      cache: "no-store",
    });
    const pages = await res.json();
    const page = pages[0];

    // 2. Traer Recomendados (Igual que en categorías y noticias)
    const recRes = await fetch(`${baseUrl}/posts?per_page=5&_embed`, {
      cache: "no-store",
    });
    const recommended = await recRes.json();

    if (!page) {
      return (
        <div className="p-20 text-center text-white font-sans">
          <p>Contenido no encontrado.</p>
          <Link href="/" className="text-sky-500 underline mt-4 block">
            Volver al inicio
          </Link>
        </div>
      );
    }

    return (
      <main className="max-w-5xl mx-auto px-6 pt-10 text-zinc-300 font-sans min-h-screen">
        {/* TITULO DE LA PÁGINA */}
        <header className="mb-10 border-b border-zinc-800 pb-6 text-center">
          <h1
            className="text-4xl font-bold text-white uppercase tracking-tighter"
            dangerouslySetInnerHTML={{ __html: page.title.rendered }}
          />
          <p className="text-zinc-500 text-[10px] uppercase tracking-[0.4em] mt-2">
            Información Legal
          </p>
        </header>

        {/* CUERPO DEL TEXTO */}
        <div
          className="max-w-4xl mx-auto text-justify leading-relaxed text-lg 
                     [&>p]:mb-6 [&>h2]:text-white [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-10 
                     [&>ul]:list-disc [&>ul]:ml-5 [&>ul]:mb-6"
          dangerouslySetInnerHTML={{ __html: page.content.rendered }}
        />

        {/* SECCIÓN RECOMENDADOS (IDÉNTICA) */}
        <section className="mt-20 border-t border-zinc-800 pt-10">
          <h3 className="text-lg font-bold uppercase tracking-widest mb-8 text-white border-l-4 border-sky-500 pl-4">
            Recomendados
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recommended.slice(0, 4).map((rec: any) => {
              const img = rec._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
              return (
                <Link
                  key={rec.id}
                  href={`/posts/${rec.slug}`}
                  className="group"
                >
                  <div className="aspect-video mb-3 overflow-hidden rounded bg-zinc-800">
                    {img && (
                      <img
                        src={img}
                        className="object-cover w-full h-full group-hover:scale-105 transition duration-500"
                        alt=""
                      />
                    )}
                  </div>
                  <h4
                    className="text-sm font-bold leading-tight group-hover:text-sky-500 transition line-clamp-3 text-white"
                    dangerouslySetInnerHTML={{ __html: rec.title.rendered }}
                  />
                </Link>
              );
            })}
          </div>
        </section>

        {/* BOTÓN VOLVER (EL AZUL QUE TE GUSTA) */}
        <div className="text-center mt-12 mb-10">
          <Link
            href="/"
            className="inline-block bg-sky-500 text-white px-8 py-2 rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-sky-600 transition-colors"
          >
            Volver
          </Link>
        </div>
      </main>
    );
  } catch (error) {
    return (
      <div className="p-20 text-center text-white">Error de conexión.</div>
    );
  }
}
