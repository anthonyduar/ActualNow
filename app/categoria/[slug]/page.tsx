import Link from "next/link";
import { fetchWpNoticias, getWordPressBaseUrl } from "@/lib/wordpress";

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
  const baseUrl = getWordPressBaseUrl();

  // Inicializamos todas las estructuras de datos vacías por seguridad de renderizado
  let category = null;
  let posts = [];
  let recommended = [];
  let totalPages = 1;

  // 1. Bloque seguro para traer e identificar la Categoría
  try {
    const catRes = await fetch(
      `${baseUrl}/categories?slug=${slug}&v=${Date.now()}`,
      { cache: "no-store" },
    );
    
    if (catRes.ok) {
      const categories = await catRes.json();
      if (Array.isArray(categories)) {
        category = categories.find((c: any) => c.slug === slug) || categories[0];
      }
    }
  } catch (error) {
    console.warn("Petición de categoría interrumpida o fallida.");
  }

  // Si la red se corta y no hay categoría base, mostramos un aviso elegante dentro de la interfaz
  if (!category) {
    return (
      <div className='p-20 text-white text-center font-sans min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4'>
        <p>Categoría no disponible temporalmente.</p>
        <Link href='/' className='bg-sky-500 text-white px-6 py-2 rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-sky-600 transition-colors'>
          Volver al Inicio
        </Link>
      </div>
    );
  }

  // 2. Bloque seguro para traer los Posts de esta Categoría
  try {
    const postRes = await fetchWpNoticias(
      `categories=${category.id}&_embed&per_page=${postsPerPage}&page=${currentPage}&v=${Date.now()}`,
      { cache: "no-store" },
    );

    if (postRes.ok) {
      const postsData = await postRes.json();
      posts = Array.isArray(postsData) ? postsData : [];
      totalPages = parseInt(postRes.headers.get("X-WP-TotalPages") || "1");
    }
  } catch (error) {
    console.warn("Petición de posts de la categoría interrumpida o fallida.");
  }

  // 3. Bloque seguro para traer los Recomendados globales
  try {
    const recRes = await fetchWpNoticias(
      `per_page=4&_embed&categories_exclude=77&v=${Date.now()}`,
      { cache: "no-store" },
    );
    
    if (recRes.ok) {
      const recData = await recRes.json();
      recommended = Array.isArray(recData) ? recData : [];
    }
  } catch (error) {
    console.warn("Petición de recomendados en categoría interrumpida o fallida.");
  }

  return (
    <main className='max-w-5xl mx-auto px-6 pt-6 text-white min-h-screen'>
      <header className='mb-10 border-b border-zinc-800 pb-6 pt-10 text-center'>
        <h1 className='text-4xl font-bold uppercase tracking-tighter'>
          {category.name}
        </h1>
        <p className='text-zinc-500 text-[10px] uppercase tracking-[0.4em] mt-2'>
          ActualNow
        </p>
      </header>


        <div className='grid gap-8'>
          {posts.map((post: any) => (
            <article key={post.id} className='news-card p-4 md:p-5'>
              <Link
                href={post.slug ? `/${post.slug}` : "/"}
                className='flex flex-col gap-6 md:flex-row group'
              >
                <div className='md:w-1/4 aspect-square overflow-hidden rounded-xl bg-zinc-800'>
                  {post._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
                    <img
                      src={post._embedded["wp:featuredmedia"][0].source_url}
                      className='object-cover w-full h-full group-hover:scale-105 transition duration-500'
                      alt=''
                    />
                  )}
                </div>
                <div className='md:w-3/4 flex flex-col justify-center min-h-[160px] relative'>
                  <div>
                    <h2
                      className='text-xl font-bold mb-2 leading-tight group-hover:text-sky-500 transition'
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                    <p className='text-zinc-500 text-[10px] font-bold uppercase mb-4'>
                      {new Date(post.date).toLocaleDateString("es-ES")}
                    </p>
                    <div
                      className='text-zinc-400 text-sm line-clamp-2 text-justify mb-4'
                      dangerouslySetInnerHTML={{
                        __html:
                          post.excerpt.rendered
                            .replace(/<[^>]*>?/gm, "")
                            .trim() + "...",
                      }}
                    />
                  </div>
                  <div className='md:absolute bottom-0 right-0'>
                    <span className='news-read-button'>
                      Leer
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* PAGINACIÓN: 5 BOTONES MÁXIMO */}
        {totalPages > 1 && (
          <div className='mt-12 flex justify-center items-center gap-2 font-sans'>
            {currentPage > 1 && (
              <Link
                href={`/categoria/${slug}?page=${currentPage - 1}`}
                className='news-button px-3.5 py-1.5'
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
                  className={`news-button px-3.5 py-1.5 min-w-[38px] text-center ${
                    num === currentPage
                      ? "border-sky-400 bg-sky-400/20 text-sky-400 font-black shadow-md shadow-sky-400/10"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  {num}
                </Link>
              ))}

            {currentPage < totalPages && (
              <Link
                href={`/categoria/${slug}?page=${currentPage + 1}`}
                className='news-button px-3.5 py-1.5'
              >
                »
              </Link>
            )}
          </div>
        )}

        <div className='text-center mt-10'>
          <Link
            href='/'
            className='news-button'
          >
            Volver al Inicio
          </Link>
        </div>

        <section className='mt-10 border-t border-zinc-800 pt-10'>
          <h3 className='text-lg font-bold uppercase tracking-widest mb-8 border-l-4 border-sky-500 pl-4'>
            Recomendados
          </h3>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {recommended.map((rec: any) => (
              <Link key={rec.id} href={rec.slug ? `/${rec.slug}` : "/"} className='news-card group block p-3'>
                <div className='aspect-square mb-3 overflow-hidden rounded bg-zinc-800'>
                  {rec._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
                    <img
                      src={rec._embedded["wp:featuredmedia"][0].source_url}
                      className='object-cover w-full h-full group-hover:scale-105 transition duration-500'
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
                {/* Aquí termina tu sección de recomendados original */}
        </section>
      </main>
    );
  } // 👈 ESTA ES LA ÚLTIMA LLAVE QUE DEBE QUEDAR (La que cierra la función CategoryPage)
