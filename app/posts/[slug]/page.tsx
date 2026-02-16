export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  // 1. Buscamos el post por slug
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/posts?slug=${slug}`,
  );
  const posts = await res.json();
  const post = posts[0];

  if (!post) return <div>Post no encontrado</div>;

  return (
    <article className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">{post.title.rendered}</h1>
      <div
        className="prose prose-lg"
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />
    </article>
  );
}
