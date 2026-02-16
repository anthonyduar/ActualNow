import Link from "next/link";

export default async function Home() {
  // Añadimos ?_embed para traer imágenes y categorías
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/posts?_embed`,
  );
  const posts = await res.json();

  return (
    <main className="max-w-4xl mx-auto p-6">
      {/* Ticker Simple (Simulado por ahora con las últimas noticias) */}
      <div className="bg-black text-white p-2 mb-6 overflow-hidden whitespace-nowrap">
        <span className="font-bold text-red-500 mr-4">ÚLTIMA HORA:</span>
        {posts.slice(0, 3).map((post: any) => (
          <span key={post.id} className="mr-10 italic">
            {post.title.rendered} •
          </span>
        ))}
      </div>

      <h1 className="text-5xl font-extrabold mb-8 border-b-4 border-black pb-2 text-center">
        ActualNow
      </h1>

      <div className="grid gap-10">
        {posts.map((post: any) => {
          // Extraemos la URL de la imagen de forma segura
          const featuredImage =
            post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

          return (
            <article key={post.id} className="group border-b pb-6">
              <Link
                href={`/posts/${post.slug}`}
                className="flex flex-col md:flex-row gap-6"
              >
                {/* Si hay imagen, la mostramos */}
                {featuredImage && (
                  <div className="md:w-1/3 overflow-hidden rounded-lg">
                    <img
                      src={featuredImage}
                      alt={post.title.rendered}
                      className="object-cover h-48 w-full group-hover:scale-105 transition duration-300"
                    />
                  </div>
                )}

                <div className={featuredImage ? "md:w-2/3" : "w-full"}>
                  <h2 className="text-2xl font-bold group-hover:text-blue-700 transition mb-2">
                    {post.title.rendered}
                  </h2>
                  <div
                    className="text-gray-600 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                  />
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </main>
  );
}
