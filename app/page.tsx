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
                className='news-card group flex h-[445px] w-[300px] flex-shrink-0 flex-col md:w-[calc(33.33%-22px)]'
              >
                <Link href={post.slug ? `/${post.slug}` : "/"} className='group flex h-full flex-col'>
                  <div className='relative aspect-video w-full shrink-0 overflow-hidden bg-zinc-900'>
                    <span className='absolute left-3 top-3 z-10 rounded-lg border border-sky-500/10 bg-[#081923] px-3 py-2 text-[10px] font-black uppercase tracking-widest text-sky-400 shadow-lg shadow-black/20 transition hover:border-sky-400/30 hover:bg-sky-500 hover:text-white'>
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
                  <div className='flex min-h-0 flex-1 flex-col gap-2 p-5'>
                    <h3 className='text-lg font-bold text-white leading-tight uppercase line-clamp-2 group-hover:text-sky-500 transition'>
                      {plainText(post.title.rendered)}
                    </h3>
                    <p className='text-zinc-500 text-[10px] font-bold uppercase py-1'>
                      {new Date(post.date).toLocaleDateString()}
                    </p>
                    <p className='text-zinc-400 text-sm line-clamp-3 leading-relaxed'>
                      {plainText(post.excerpt.rendered) + "..."}
                    </p>
                    <span className='inline-flex w-fit self-start items-center rounded-lg border border-sky-500/10 bg-[#081923] px-3 py-2 text-[10px] font-black uppercase tracking-widest text-sky-400 transition hover:border-sky-400/30 hover:bg-sky-500 hover:text-white'>
                      Leer
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* SECCIÓN VERTICAL */}
        <div className='mx-auto grid max-w-5xl justify-items-center gap-12'>
          {posts
            .filter((p: any) => !p.categories?.includes(3))
            .map((post: any) => {
              const category = post._embedded?.["wp:term"]?.[0]?.[0];
              return (
                <article
                  key={post.id}
                  className='news-card group flex h-[510px] w-full max-w-3xl flex-shrink-0 p-0'
                >
                  <div className='flex h-full flex-col'>
                    <div className='relative aspect-video w-full shrink-0 overflow-hidden bg-zinc-900'>
                      <Link href={post.slug ? `/${post.slug}` : "/"}>
                        <div className='h-full w-full overflow-hidden bg-zinc-900'>
                          <img
                            src={
                              post._embedded?.["wp:featuredmedia"]?.[0]
                                ?.source_url
                            }
                            className='h-full w-full object-cover transition duration-500 group-hover:scale-105'
                            alt=''
                          />
                        </div>
                      </Link>
                      {category && (
                        <div className='absolute left-3 top-3 z-10'>
                          <span className='rounded-lg border border-sky-500/10 bg-[#081923] px-3 py-2 text-[10px] font-black uppercase tracking-widest text-sky-400 shadow-lg shadow-black/20 transition hover:border-sky-400/30 hover:bg-sky-500 hover:text-white'>
                            {category.name}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className='flex min-h-0 flex-1 flex-col gap-2 p-5'>
<Link href={post.slug ? `/${post.slug}` : "/"} className='block'>
                        <h2 className='line-clamp-2 text-lg font-bold uppercase leading-tight text-white transition group-hover:text-sky-400'>
                          {plainText(post.title.rendered)}
                        </h2>
                        <p className='py-1 text-[10px] font-bold uppercase text-zinc-500'>
                          {new Date(post.date).toLocaleDateString()}
                        </p>
                        <p className='line-clamp-3 text-sm leading-relaxed text-zinc-400'>
                          {plainText(post.excerpt.rendered) + "..."}
                        </p>
                      </Link>

                      <div className='mt-auto pt-2'>
                        <Link
                          href={post.slug ? `/${post.slug}` : "/"}
className='inline-flex w-fit self-start items-center rounded-lg border border-sky-500/10 bg-[#081923] px-3 py-2 text-[10px] font-black uppercase tracking-widest text-sky-400 transition hover:border-sky-400/30 hover:bg-sky-500 hover:text-white'
                    >
                      Leer
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
        </div>
      </div>
      <CookieBanner />
    </main>
  );
}
