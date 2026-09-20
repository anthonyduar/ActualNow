"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import CookieBanner from "./components/CookieBanner";
import { fetchWpNoticias, getWordPressBaseUrl } from "@/lib/wordpress";

function plainText(html = "") {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [footballPosts, setFootballPosts] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

    useEffect(() => {
    setIsClient(true);
    async function getData() {
      try {
        const res = await fetchWpNoticias(
          `_embed&per_page=30&categories_exclude=77&exclude=358&v=${Date.now()}`,
          { cache: "no-store" },
        );
        
        // PROTECCIÓN CLAVE: Si cambias de página y la red cancela el fetch, frena aquí limpiamente
        if (!res.ok) return;

        const data = await res.json();

        if (Array.isArray(data)) {
          // Mantienes intacto tu filtro original de categorías de fútbol
          const nonFootball = data.filter(
            (post: any) => !post.categories?.includes(3),
          );
          setPosts(data);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.warn("Petición de noticias generales interrumpida de forma segura al cambiar de sección.");
      }
    }
    getData();
  }, []);


    useEffect(() => {
    async function getFootballData() {
      const baseUrl = getWordPressBaseUrl();
      if (!baseUrl) return;

      try {
        const categoryRes = await fetch(
          `${baseUrl}/categories?slug=futbol&v=${Date.now()}`,
          { cache: "no-store" },
        );
        
        // CORRECCIÓN 1: Evita error si la petición se interrumpe al cambiar de página
        if (!categoryRes.ok) return;
        
        const categoryData = await categoryRes.json();
        if (Array.isArray(categoryData) && categoryData.length > 0) {
          const footballCategoryId = categoryData[0].id;
          const postsRes = await fetchWpNoticias(
            `_embed&categories=${footballCategoryId}&per_page=3&v=${Date.now()}`,
            { cache: "no-store" },
          );
          
          // CORRECCIÓN 2: Evita error si la red se corta
          if (!postsRes.ok) return;

          const postsData = await postsRes.json();
          setFootballPosts(Array.isArray(postsData) ? postsData : []);
        }
      } catch (error) {
        console.warn("Petición de fútbol gestionada o interrumpida de forma segura.");
      }
    }
    getFootballData();
  }, []);

  if (!isClient) return <div className='min-h-screen bg-zinc-950' />;

  return (
    <main className='min-h-screen bg-black text-white'>
      <div className='mx-auto max-w-6xl px-6 pb-6 pt-3'>
        {/* SECCIÓN FÚTBOL */}
        <section className='mb-12'>
          <div className='flex flex-row flex-wrap justify-center gap-8 pb-4'>
            {footballPosts.map((post: any) => (
              <article
                key={post.id}
                className='news-card group flex w-[300px] flex-shrink-0 flex-col md:w-[calc(33.33%-22px)]'
              >
                <Link href={post.slug ? `/${post.slug}` : "/"} className='group flex h-full flex-col'>
                  <div className='relative aspect-video w-full shrink-0 overflow-hidden bg-zinc-900'>
                    <span className='absolute left-3 top-3 z-10 rounded-lg border border-sky-500/20 bg-[#081923] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-sky-400 shadow-lg shadow-black/40 pointer-events-none'>
                      Fútbol
                    </span>
                    <img
                      src={
                        post._embedded?.["wp:featuredmedia"]?.[0]?.source_url
                      }
                      className='h-full w-full object-cover transition duration-500 group-hover:scale-105'
                      alt=''
                    />
                  </div>
                  <div className='flex flex-col gap-2 p-4 sm:p-5 flex-1'>
                    <h3 className='text-base sm:text-lg font-bold text-white leading-snug uppercase line-clamp-2 group-hover:text-sky-400 transition'>
                      {plainText(post.title.rendered)}
                    </h3>
                    <p className='text-zinc-500 text-[10px] font-bold uppercase'>
                      {new Date(post.date).toLocaleDateString()}
                    </p>
                    <p className='text-zinc-400 text-xs sm:text-sm line-clamp-3 leading-relaxed'>
                      {plainText(post.excerpt.rendered) + "..."}
                    </p>
                    <div className='mt-2 pt-1'>
                      <span className='news-read-button'>
                        Leer
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* SECCIÓN VERTICAL */}
        <div className='mx-auto grid max-w-5xl justify-items-center gap-10'>
          {posts
            .filter((p: any) => !p.categories?.includes(3))
            .map((post: any) => {
              const category = post._embedded?.["wp:term"]?.[0]?.[0];
              const imageUrl =
                post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

              return (
                <article
                  key={post.id}
                  className='news-card group relative aspect-[16/9] w-full max-w-3xl overflow-hidden p-0'
                >
                  <Link
                    href={post.slug ? `/${post.slug}` : "/"}
                    className='relative block h-full w-full overflow-hidden'
                  >
                    {/* Imagen de fondo ocupando todo el contenedor */}
                    <div className='absolute inset-0 h-full w-full overflow-hidden bg-zinc-900'>
                      {imageUrl && (
                        <img
                          src={imageUrl}
                          className='h-full w-full object-cover transition duration-700 group-hover:scale-105'
                          alt=''
                        />
                      )}
                      <div className='absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/20' />
                    </div>

                    {/* Categoría flotando arriba a la izquierda */}
                    {category && (
                      <div className='absolute left-5 top-5 z-20'>
                        <span className='rounded-lg border border-sky-500/20 bg-[#081923]/90 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-sky-400 shadow-lg backdrop-blur-sm pointer-events-none'>
                          {category.name}
                        </span>
                      </div>
                    )}

                    {/* Título, resumen y botón Leer flotando encima de la imagen */}
                    <div className='absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-8'>
                      <h2 className='mb-2 line-clamp-2 text-xl font-black uppercase leading-tight text-white drop-shadow-md transition group-hover:text-sky-400 md:text-3xl'>
                        {plainText(post.title.rendered)}
                      </h2>
                      <p className='mb-2 text-[10px] font-bold uppercase text-zinc-400'>
                        {new Date(post.date).toLocaleDateString()}
                      </p>
                      <p className='mb-4 max-w-2xl line-clamp-2 text-sm leading-relaxed text-zinc-300 drop-shadow'>
                        {plainText(post.excerpt.rendered) + "..."}
                      </p>
                      <div>
                        <span className='news-read-button'>
                          Leer
                        </span>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
        </div>
      </div>
      <CookieBanner />
    </main>
  );
}
