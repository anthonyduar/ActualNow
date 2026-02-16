import Link from "next/link";

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/posts`);
  const posts = await res.json();

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 border-b-2 border-black pb-2">
        ActualNow
      </h1>
      <div className="grid gap-6">
        {posts.map((post: any) => (
          <article key={post.id} className="group">
            <Link href={`/posts/${post.slug}`}>
              <h2 className="text-xl font-semibold group-hover:text-blue-600 transition">
                {post.title.rendered}
              </h2>
              <div
                className="text-gray-600 line-clamp-2 mt-2"
                dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
              />
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
