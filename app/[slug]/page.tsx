import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import XIGEmbed from "../components/XIGEmbed";
import { getPostOrNoticiaBySlug, fetchWpNoticias } from "@/lib/wordpress";

function plainText(html = "") {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

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
    <main className='bg-black min-h-screen text-white flex flex-col font-sans'>
      <div className='max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-8 flex-grow w-full'>
        {/* TÍTULO Y ACTUALNOW */}
        <div className='text-center mb-6 sm:mb-8'>
          <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight leading-tight mb-3 sm:mb-4 text-white break-words'>
            {plainText(post.title.rendered)}
          </h1>
          <p className='text-[10px] text-zinc-500 font-bold uppercase tracking-[0.4em] sm:tracking-[0.5em]'>
            ActualNow
          </p>
        </div>

        {/* IMAGEN + LEYENDA */}
        {img && (
          <div className='mb-4 max-w-2xl mx-auto'>
            <div className='w-full aspect-[16/10] sm:aspect-video rounded-2xl sm:rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900'>
              <img src={img} className='w-full h-full object-cover' alt='' />
            </div>
            {caption && (
              <p className='text-[10px] text-zinc-500 mt-2.5 sm:mt-3 px-1 italic text-left break-words'>
                {plainText(caption)}
              </p>
            )}
          </div>
        )}

        <div className='flex flex-col items-center text-center mt-3 mb-0 border-b border-zinc-800/80 pb-5 sm:pb-6'>
          <a
            href='https://x.com/AnthonyDuarte'
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-1.5 text-[11px] sm:text-[12px] font-medium text-zinc-400 hover:text-sky-400 mt-0 transition'
          >
            <svg className='w-3.5 h-3.5 sm:w-4 sm:h-4' fill='currentColor' viewBox='0 0 24 24'>
              <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
            </svg>
            @AnthonyDuarte
          </a>
        </div>

        {/* FECHA */}
        <div className='mt-2 mb-6 sm:mb-8'>
          <p className='text-[9px] sm:text-[10px] text-zinc-500 font-bold uppercase tracking-widest text-left'>
            {formatDate(post.date)}
          </p>
        </div>

        {/* CUERPO DE NOTICIA: FONDO BLANCO CON TEXTO GRIS OSCURO EDITORIAL */}
        <div className='max-w-3xl mx-auto w-full'>
          <article
            className="rounded-2xl bg-white p-4 sm:p-8 md:p-10 shadow-2xl border border-zinc-200 text-[#1a1a1a] text-sm sm:text-base md:text-lg leading-relaxed text-left sm:text-justify break-words overflow-hidden
                       [&_p]:mb-5 sm:[&_p]:mb-6 [&_p]:block [&_p]:text-[#222222] [&_p]:leading-relaxed [&_p]:break-words
                       [&_br]:content-[''] [&_br]:block [&_br]:mb-2 sm:[&_br]:mb-3
                       [&_h2]:text-[#111111] [&_h2]:text-lg sm:[&_h2]:text-xl md:[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 sm:[&_h2]:mt-8 [&_h2]:mb-3 sm:[&_h2]:mb-4 [&_h2]:break-words
                       [&_h3]:text-[#111111] [&_h3]:text-base sm:[&_h3]:text-lg md:[&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-5 sm:[&_h3]:mt-6 [&_h3]:mb-2 sm:[&_h3]:mb-3 [&_h3]:break-words
                       [&_strong]:text-[#111111] [&_strong]:font-bold
                       [&_em]:italic [&_em]:text-[#333333]
                       [&_ul]:list-disc [&_ul]:ml-5 sm:[&_ul]:ml-6 [&_ul]:mb-5 sm:[&_ul]:mb-6 [&_ul]:text-[#222222]
                       [&_ol]:list-decimal [&_ol]:ml-5 sm:[&_ol]:ml-6 [&_ol]:mb-5 sm:[&_ol]:mb-6 [&_ol]:text-[#222222]
                       [&_li]:mb-1.5 sm:[&_li]:mb-2
                       [&_blockquote]:border-l-4 [&_blockquote]:border-sky-500 [&_blockquote]:pl-3 sm:[&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#444444] [&_blockquote]:my-4 sm:[&_blockquote]:my-6
                       [&_a]:text-sky-600 [&_a]:underline [&_a]:hover:text-sky-800 [&_a]:font-medium [&_a]:break-all
                       [&_img]:rounded-xl [&_img]:mx-auto [&_img]:my-4 sm:[&_img]:my-6 [&_img]:shadow-md [&_img]:max-w-full [&_img]:h-auto
                       [&_iframe]:max-w-full [&_iframe]:w-full [&_iframe]:mx-auto
                       [&_figure]:max-w-full [&_figure]:mx-auto [&_figure]:my-4
                       [&_table]:w-full [&_table]:max-w-full [&_table]:overflow-x-auto [&_table]:block"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />
        </div>
      </div>

      {/* FOOTER */}
      <footer className='max-w-4xl mx-auto w-full px-3 sm:px-6 pb-12 mt-2'>
        <div className='text-center mt-8 mb-8'>
          <Link
            href='/'
            className='news-button'
          >
            Volver al Inicio
          </Link>
        </div>

        {/* SECCIÓN RECOMENDADOS */}
        <section className='mt-8 border-t border-zinc-800 pt-8'>
          <h3 className='text-base sm:text-lg font-bold uppercase tracking-widest mb-6 border-l-4 border-sky-500 pl-3 sm:pl-4'>
            Recomendados
          </h3>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6'>
            {recommended.map((rec: any) => (
              <Link key={rec.id} href={rec.slug ? `/${rec.slug}` : "/"} className='news-card group block p-2.5 sm:p-3'>
                <div className='aspect-square mb-2 sm:mb-3 overflow-hidden rounded bg-zinc-800'>
                  {rec._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
                    <img
                      src={rec._embedded["wp:featuredmedia"][0].source_url}
                      className='object-cover w-full h-full group-hover:scale-105 transition duration-500'
                      alt=''
                    />
                  )}
                </div>
                <h4
                  className='text-xs sm:text-sm font-bold leading-snug group-hover:text-sky-500 transition line-clamp-2 sm:line-clamp-3'
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
