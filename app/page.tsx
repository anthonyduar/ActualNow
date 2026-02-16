import Link from "next/link";

export default async function Home() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/posts?_embed`,
    { cache: "no-store" },
  );
  const posts = await res.json();

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="grid gap-10">
        {posts.map((post: any) => {
          const featuredImage =
            post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
          return (
            <article key={post.id} className="group border-b pb-6">
              <Link
                href={`/posts/${post.slug}`}
                className="flex flex-col md:flex-row gap-6"
              >
                {featuredImage && (
                  <div className="md:w-1/3 overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={featuredImage}
                      alt=""
                      className="object-cover h-48 w-full group-hover:scale-105 transition duration-300 shadow-sm"
                    />
                  </div>
                )}
                <div className={featuredImage ? "md:w-2/3" : "w-full"}>
                  <h2
                    className="text-2xl font-bold group-hover:text-sky-500 transition mb-2"
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                  <div
                    className="text-gray-600 line-clamp-3 text-sm"
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
