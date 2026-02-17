import Link from "next/link";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: any;
  searchParams: any;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const slug = resolvedParams.slug;
  const currentPage = parseInt(resolvedSearchParams.page || "1");
  const postsPerPage = 5;
  const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

  try {
    const catRes = await fetch(`${baseUrl}/categories?search=${slug}`, {
      cache: "no-store",
    });
    const categories = await catRes.json();
    const category =
      categories.find((c: any) => c.slug === slug) || categories[0];

    if (!category)
      return (
        <div className="p-20 text-white text-center font-sans">
          Categoría no encontrada.
        </div>
      );

    const postRes = await fetch(
      `${baseUrl}/posts?categories=${category.id}&_embed&per_page=${postsPerPage}&page=${currentPage}`,
      { cache: "no-store" },
    );
    const posts = await postRes.json();
    const totalPages = parseInt(postRes.headers.get("X-WP-TotalPages") || "1");
    const recRes = await fetch(`${baseUrl}/posts?per_page=4&_embed`, {
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

        {/* PAGINACIÓN: 5 BOTONES MÁXIMO */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2 font-sans">
            {currentPage > 1 && (
              <Link
                href={`/categoria/${slug}?page=${currentPage - 1}`}
                className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded hover:bg-sky-500 transition"
              >
                «
              </Link>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((num) => {
                const start = Math.max(
                  1,
                  Math.min(currentPage - 2, totalPages - 4),
                );
                const end = Math.min(totalPages, Math.max(currentPage + 2, 5));
                return num >= start && num <= end;
              })
              .map((num) => (
                <Link
                  key={num}
                  href={`/categoria/${slug}?page=${num}`}
                  className={`px-4 py-2 rounded font-bold border ${num === currentPage ? "bg-sky-500 border-sky-500 text-white" : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-sky-500"}`}
                >
                  {num}
                </Link>
              ))}

            {currentPage < totalPages && (
              <Link
                href={`/categoria/${slug}?page=${currentPage + 1}`}
                className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded hover:bg-sky-500 transition"
              >
                »
              </Link>
            )}
          </div>
        )}

        <section className="mt-20 border-t border-zinc-800 pt-10">
          <h3 className="text-lg font-bold uppercase tracking-widest mb-8 border-l-4 border-sky-500 pl-4">
            Recomendados
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recommended.map((rec: any) => (
              <Link key={rec.id} href={`/posts/${rec.slug}`} className="group">
                <div className="aspect-video mb-3 overflow-hidden rounded bg-zinc-800">
                  {rec._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
                    <img
                      src={rec._embedded["wp:featuredmedia"][0].source_url}
                      className="object-cover w-full h-full group-hover:scale-105 transition duration-500"
                    />
                  )}
                </div>
                <h4
                  className="text-sm font-bold leading-tight group-hover:text-sky-500 transition line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: rec.title.rendered }}
                />
              </Link>
            ))}
          </div>
        </section>

        <div className="text-center mt-10 mb-10">
          <Link
            href="/"
            className="inline-block bg-sky-500 text-white px-8 py-2 rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-sky-600 transition"
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
