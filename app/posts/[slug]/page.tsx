import Link from "next/link";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/posts?slug=${slug}&_embed`,
    { cache: "no-store" },
  );
  const posts = await res.json();
  const post = posts[0];

  const recRes = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/posts?per_page=5&_embed`,
    { cache: "no-store" },
  );
  const recommended = await recRes.json();

  if (!post)
    return (
      <div className="text-center p-20 text-white">Noticia no encontrada</div>
    );

  const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  const authorName =
    post._embedded?.["author"]?.[0]?.name || "Redacción ActualNow";

  return (
    <main className="max-w-5xl mx-auto px-6 pt-6 text-white">
      <header className="mb-8 text-center pt-4">
        <h1
          className="text-3xl md:text-5xl font-bold mb-3 leading-tight"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
        <p className="text-zinc-500 text-[10px] uppercase tracking-[0.4em]">
          ActualNow
        </p>
      </header>

      {featuredImage && (
        <div className="flex flex-col items-center mb-10 border-b border-zinc-800 pb-10">
          <img
            src={featuredImage}
            alt=""
            className="w-full md:w-2/3 h-auto rounded shadow-2xl"
          />
          {/* CRÉDITO UN POCO MÁS GRANDE */}
          <p className="mt-5 text-zinc-400 text-[11px] md:text-[12px] uppercase tracking-[0.15em] font-medium italic">
            Por: {authorName}
          </p>
        </div>
      )}

      <div
        className="text-zinc-300 text-lg leading-relaxed space-y-6 max-w-4xl mx-auto text-justify 
        [&>p]:mb-6 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-10 [&>h2]:text-left"
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />

      <section className="mt-20 border-t border-zinc-800 pt-10">
        <h3 className="text-lg font-bold uppercase tracking-widest mb-8 text-white border-l-4 border-sky-500 pl-4">
          Recomendados
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {recommended
            .filter((p: any) => p.id !== post.id)
            .slice(0, 4)
            .map((rec: any) => {
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
}
