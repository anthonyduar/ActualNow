"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import CookieBanner from "./components/CookieBanner";
import { fetchWpNoticias, getWordPressBaseUrl } from "@/lib/wordpress";

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
    <main className='min-h-screen bg-zinc-950 text-white'>
      <div className='mx-auto max-w-6xl px-6 pb-6 pt-3'>
        {/* SECCIÓN FÚTBOL */}
        <section className='mb-12'>
          <div className='flex flex-row gap-8 overflow-x-auto pb-4 scrollbar-hide'>
            {footballPosts.map((post: any) => (
              <article
                key={post.id}
                className='flex-shrink-0 w-[300px] md:w-[calc(33.33%-22px)]'
              >
                <Link href={`/${post.slug}`} className='group'>
                  <div className='relative h-64 w-full overflow-hidden rounded-2xl bg-zinc-900 mb-4 border border-zinc-800'>
                    <span className='absolute left-3 top-3 z-10 rounded-md bg-sky-500 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg'>
                      Fútbol
                    </span>
                    <img
                      src={
                        post._embedded?.["wp:featuredmedia"]?.[0]?.source_url
                      }
                      className='object-cover w-full h-full'
                      alt=''
                    />
                  </div>
                  <div className='space-y-2 px-1'>
                    <h3
                      className='text-lg font-bold text-white leading-tight uppercase line-clamp-2 group-hover:text-sky-500 transition'
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                    <p className='text-zinc-500 text-[10px] font-bold uppercase py-1'>
                      {new Date(post.date).toLocaleDateString()}
                    </p>
                    <div
                      className='text-zinc-400 text-sm line-clamp-3 leading-relaxed'
                      dangerouslySetInnerHTML={{
                        __html:
                          post.excerpt.rendered
                            .replace(/<[^>]*>?/gm, "")
                            .trim() + "...",
                      }}
                    />
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* SECCIÓN VERTICAL */}
        <div className='grid gap-12 max-w-5xl'>
          {posts
            .filter((p: any) => !p.categories?.includes(3))
            .map((post: any) => {
              const category = post._embedded?.["wp:term"]?.[0]?.[0];
              return (
                <article
                  key={post.id}
                  className='group border-b border-zinc-900 pb-12 last:border-b-0'
                >
                  <div className='flex flex-col md:flex-row gap-10'>
                    <div className='md:w-1/3 relative'>
                      <Link href={`/${post.slug}`}>
                        <div className='overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800'>
                          <img
                            src={
                              post._embedded?.["wp:featuredmedia"]?.[0]
                                ?.source_url
                            }
                            className='object-cover h-60 w-full group-hover:scale-105 transition duration-300'
                            alt=''
                          />
                        </div>
                      </Link>
                      {category && (
                        <div className='absolute top-3 left-3 z-10'>
                          <span className='bg-sky-500 text-white text-[10px] font-black uppercase tracking-tighter px-3 py-1.5 rounded-md shadow-md'>
                            {category.name}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className='md:w-2/3 relative flex flex-col justify-center min-h-[200px]'>
                      <Link href={`/${post.slug}`} className='group'>
                        <h2
                          className='text-base md:text-lg font-bold text-white mb-4 leading-tight uppercase group-hover:text-sky-500 transition'
                          dangerouslySetInnerHTML={{
                            __html: post.title.rendered,
                          }}
                        />
                        <p className='text-zinc-500 text-[10px] font-bold uppercase mb-4'>
                          {new Date(post.date).toLocaleDateString()}
                        </p>
                        <div
                          className='text-zinc-400 line-clamp-3 text-sm leading-relaxed mb-6'
                          dangerouslySetInnerHTML={{
                            __html:
                              post.excerpt.rendered
                                .replace(/<[^>]*>?/gm, "")
                                .trim() + "...",
                          }}
                        />
                      </Link>

                      <div className='md:absolute bottom-0 right-0'>
                        <Link
                          href={`/${post.slug}`}
                          className='inline-block bg-sky-500 text-white text-[10px] font-bold uppercase tracking-widest px-6 py-2 rounded-full hover:bg-sky-600 transition shadow-lg shadow-sky-500/20'
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
