import Link from "next/link";
import { notFound } from "next/navigation";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

async function getPostData(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
  try {
    const postRes = await fetch(`${baseUrl}/posts?_embed&slug=${slug}`, {
      cache: "no-store",
    });
    const posts = await postRes.json();
    const post = posts[0] || null;

    const recRes = await fetch(`${baseUrl}/posts?per_page=4&_embed`, {
      cache: "no-store",
    });
    const recommended = await recRes.json();

    return { post, recommended };
  } catch {
    return { post: null, recommended: [] };
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { post, recommended } = await getPostData(slug);

  if (!post) notFound();

  const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0];
  const img = featuredMedia?.source_url;
  const caption = featuredMedia?.caption?.rendered;

  return (
    <main className="bg-zinc-950 min-h-screen text-white flex flex-col font-sans">
      <div className="max-w-4xl mx-auto p-6 md:pt-16 flex-grow">
        {/* TÍTULO Y ACTUALNOW */}
        <div className="text-center mb-10">
          <h1
            className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-4 text-white"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.5em]">
            ActualNow
          </p>
        </div>

        {/* IMAGEN + LEYENDA */}
        {img && (
          <div className="mb-2">
            <div className="w-full h-auto rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">
              <img src={img} className="w-full h-full object-cover" alt="" />
            </div>
            {caption && (
              <div
                className="text-[10px] text-zinc-500 mt-3 ml-2 italic text-left"
                dangerouslySetInnerHTML={{ __html: caption }}
              />
            )}
          </div>
        )}

        {/* FIRMA (RED SOCIAL PEGADA AL NOMBRE) */}
        <div className="flex flex-col items-center text-center mt-4 mb-0 border-b border-zinc-800 pb-8">
          <p className="text-[11px] font-light uppercase tracking-tighter text-zinc-100">
            POR: ANTHONY DUARTE
          </p>
          <a
            href="https://x.com/AnthonyDuarte"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-400 hover:text-sky-400 mt-0 transition"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            @AnthonyDuarte
          </a>
        </div>

        {/* FECHA */}
        <div className="mt-2 mb-12">
          <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest text-left">
            {formatDate(post.date)}
          </p>
        </div>

        {/* CUERPO DE NOTICIA: SEPARACIÓN AJUSTADA */}
        <div
          className="prose prose-invert max-w-none text-zinc-200 text-lg leading-relaxed text-justify 
                     [&_p]:mb-6 [&_p]:block
                     [&_br]:content-[''] [&_br]:block [&_br]:mb-3"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />
      </div>

      {/* FOOTER */}
      <footer className="max-w-4xl mx-auto w-full px-6 pb-12 mt-20">
        <section className="border-t border-zinc-900 pt-10">
          <h3 className="text-sm font-black uppercase tracking-widest mb-8 border-l-4 border-sky-500 pl-4 text-white">
            Recomendados
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recommended.map((rec: any) => (
              <Link key={rec.id} href={`/posts/${rec.slug}`} className="group">
                <div className="aspect-video mb-3 overflow-hidden rounded-xl bg-zinc-900">
                  <img
                    src={rec._embedded?.["wp:featuredmedia"]?.[0]?.source_url}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <h4
                  className="text-[13px] font-bold leading-tight group-hover:text-sky-500 transition line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: rec.title.rendered }}
                />
              </Link>
            ))}
          </div>
        </section>

        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-block bg-sky-500 text-white px-8 py-2 rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-sky-600 transition shadow-lg"
          >
            Volver
          </Link>
        </div>
      </footer>
    </main>
  );
}
