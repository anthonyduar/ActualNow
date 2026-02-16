import Link from "next/link";

export default async function CategoryPage({ params }: { params: any }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

  try {
    // 1. Obtener la categoría
    const catRes = await fetch(`${baseUrl}/categories?search=${slug}`, {
      cache: "no-store",
    });
    const categories = await catRes.json();
    const category =
      categories.find((c: any) => c.slug === slug) || categories[0];

    if (!category) {
      return (
        <div className="p-20 text-white text-center font-sans">
          Categoría no encontrada.
        </div>
      );
    }

    // 2. Traer los posts de esta categoría
    const postRes = await fetch(
      `${baseUrl}/posts?categories=${category.id}&_embed&per_page=10`,
      { cache: "no-store" },
    );
    const posts = await postRes.json();

    // 3. Traer Recomendados (Igual que en PostPage)
    const recRes = await fetch(`${baseUrl}/posts?per_page=5&_embed`, {
      cache: "no-store",
    });
    const recommended = await recRes.json();

    return (
      <main className="max-w-5xl mx-auto px-6 pt-6 text-white min-h-screen">
        <header className="mb-10 border-b border-zinc-800 pb-6 pt-10 text-center">
          <h1 className="text-4xl font-bold uppercase tracking-tighter">
            {category.name}
          </h1>
          <p className="text-zinc-500 text-[10px] uppercase tracking-[0.4em] mt-2">
            ActualNow
          </p>
        </header>

        <div className="grid gap-8">
          {posts.map((post: any) => (
            <article key={post.id} className="border-b border-zinc-900 pb-8">
              <Link
                href={`/posts/${post.slug}`}
                className="flex flex-col md:flex-row gap-6 group"
              >
                <div className="md:w-1/4 aspect-video overflow-hidden rounded bg-zinc-800">
                  {post._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
                    <img
                      src={post._embedded["wp:featuredmedia"][0].source_url}
                      className="object-cover w-full h-full group-hover:scale-105 transition duration-500"
                      alt=""
                    />
                  )}
                </div>
                <div className="md:w-3/4">
                  <h2
                    className="text-xl font-bold mb-2 leading-tight group-hover:text-sky-500 transition"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                  <div
                    className="text-zinc-400 text-sm line-clamp-2 text-justify"
                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                  />
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* SECCIÓN RECOMENDADOS (IDÉNTICA A POSTPAGE) */}
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
                      />
                    )}
                  </div>
                  <h4
                    className="text-sm md:text-base font-bold leading-tight group-hover:text-sky-500 transition line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: rec.title.rendered }}
                  />
                </Link>
              );
            })}
          </div>
        </section>

        {/* BOTÓN VOLVER (IDÉNTICO A POSTPAGE) */}
        <div className="text-center mt-10 mb-2">
          <Link
            href="/"
            className="inline-block bg-sky-500 text-white px-8 py-2 rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-sky-600 transition-colors"
          >
            Volver
          </Link>
        </div>
      </main>
    );
  } catch (err) {
    return (
      <div className="p-20 text-white text-center">
        Error al cargar la categoría.
      </div>
    );
  }
}
