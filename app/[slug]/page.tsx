import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import XIGEmbed from "../components/XIGEmbed";
import { getPostOrNoticiaBySlug, fetchWpNoticias } from "@/lib/wordpress";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

async function getPostData(slug: string) {
  return await getPostOrNoticiaBySlug(slug);
}

async function getRecommendedPosts() {
  try {
    const recRes = await fetchWpNoticias(
      `per_page=4&_embed&categories_exclude=77&v=${Date.now()}`,
      { cache: "no-store" },
    );
    return await recRes.json(); // Devuelve las recomendadas por separado
  } catch {
    return [];
  }
}

// 👇 FUNCIÓN DE METADATOS OPTIMIZADA CON ARREGLO DE DOMINIO ABSOLUTO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostData(slug);

  if (!post) {
    return {
      title: "Noticia no encontrada | ActualNow",
    };
  }

  // Limpiamos etiquetas HTML básicas del título y el extracto de WordPress
  const cleanTitle = post.title.rendered.replace(/<\/?[^>]+(>|$)/g, "");
  const cleanDescription = post.excerpt?.rendered
    ?.replace(/<\/?[^>]+(>|$)/g, "")
    ?.substring(0, 160) || "";

  let img = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "";

  // 🔄 TRUCO DE ANCLAJE ABSOLUTO:
  // Si la imagen viene como una ruta interna (ej: /wp-content/...), 
  // extraemos de forma dinámica el dominio base desde tu API de WordPress.
  if (img && !img.startsWith("http")) {
    const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "";
    try {
      const urlObj = new URL(apiUrl);
      const domainUrl = `${urlObj.protocol}//${urlObj.hostname}`;
      img = `${domainUrl}${img.startsWith("/") ? "" : "/"}${img}`;
    } catch {
      // Fallback si la conversión falla
      img = "";
    }
  }

  return {
    title: `${cleanTitle} | ActualNow`,
    description: cleanDescription,
    openGraph: {
      title: cleanTitle,
      description: cleanDescription,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modified,
      images: img ? [{ url: img, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image", // Fuerza la previsualización EN GRANDE
      title: cleanTitle,
      description: cleanDescription,
      images: img ? [img] : [],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostData(slug); // Llama a la función optimizada

  if (!post) notFound();

  const recommended = await getRecommendedPosts(); // Trae las recomendadas de forma independiente

  const featuredMedia = post._embedded?.["wp:featuredmedia"]?.[0];
  const img = featuredMedia?.source_url;
  const caption = featuredMedia?.caption?.rendered;

  return (
    <main className='bg-zinc-950 min-h-screen text-white flex flex-col font-sans'>
      <div className='max-w-4xl mx-auto p-4 md:pt-8 flex-grow'>
        {/* TÍTULO Y ACTUALNOW */}
        <div className='text-center mb-10'>
          <h1
            className='text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-4 text-white'
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
          <p className='text-[10px] text-zinc-500 font-bold uppercase tracking-[0.5em]'>
            ActualNow
          </p>
        </div>

        {/* IMAGEN + LEYENDA */}
        {img && (
          <div className='mb-1 max-w-2xl mx-auto'>
            <div className='w-full h-120 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl'>
              <img src={img} className='w-full h-full object-cover' alt='' />
            </div>
            {caption && (
              <div
                className='text-[10px] text-zinc-500 mt-3 ml-2 italic text-left'
                dangerouslySetInnerHTML={{ __html: caption }}
              />
            )}
          </div>
        )}

        <div className='flex flex-col items-center text-center mt-4 mb-0 border-b border-zinc-800 pb-8'>
          <a
            href='https://x.com/AnthonyDuarte'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-1.5 text-[12px] font-medium text-zinc-400 hover:text-sky-400 mt-0 transition'
          >
            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
              <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
            </svg>
            @AnthonyDuarte
          </a>
        </div>

        {/* FECHA */}
        <div className='mt-2 mb-12'>
          <p className='text-[9px] text-zinc-600 font-bold uppercase tracking-widest text-left'>
            {formatDate(post.date)}
          </p>
        </div>

        {/* CUERPO DE NOTICIA: FONDO BLANCO CON TEXTO GRIS */}
        <div className='max-w-3xl mx-auto w-full'>
          <div
            className="news-card bg-zinc-900/70 text-zinc-300 text-lg leading-relaxed text-justify px-8 py-10 rounded-2xl
                       [&_p]:mb-6 [&_p]:block
                       [&_br]:content-[''] [&_br]:block [&_br]:mb-3
                       [&_h2]:text-gray-800 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4
                       [&_h3]:text-gray-800 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-3
                       [&_strong]:text-gray-800 [&_strong]:font-bold
                       [&_em]:italic [&_em]:text-gray-700
                       [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4
                       [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4
                       [&_a]:text-sky-500 [&_a]:underline [&_a]:hover:text-sky-600"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />
        </div>
      </div>

      {/* FOOTER */}
      <footer className='max-w-4xl mx-auto w-full px-6 pb-12 mt-2'>
        <div className='text-center mt-10 mb-10'>
          <Link
            href='/'
            className='news-button'
          >
            Volver al Inicio
          </Link>
        </div>

        {/* SECCIÓN RECOMENDADOS */}
        <section className='mt-2 border-t border-zinc-800 pt-4'>
          <h3 className='text-lg font-bold uppercase tracking-widest mb-8 border-l-4 border-sky-500 pl-4'>
            Recomendados
          </h3>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {recommended.map((rec: any) => (
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
                  className='text-sm font-bold leading-tight group-hover:text-sky-500 transition line-clamp-3'
                  dangerouslySetInnerHTML={{ __html: rec.title.rendered }}
                />
              </Link>
            ))}
          </div>
        </section>
      </footer>
      <XIGEmbed />
      <Script
        src='https://platform.twitter.com/widgets.js'
        strategy='lazyOnload'
      />
      <Script src='https://www.instagram.com/embed.js' strategy='lazyOnload' />
    </main>
  );
}
