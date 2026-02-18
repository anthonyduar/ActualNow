"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

function FeaturedCarousel({ posts }: { posts: any[] }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (posts.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % posts.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [posts.length]);

  return (
    <div className="relative w-full h-[450px] overflow-hidden rounded-2xl bg-zinc-900 shadow-xl">
      <div className="absolute top-6 left-6 z-20">
        <h2 className="bg-sky-500 text-white text-sm md:text-base font-black uppercase tracking-tighter px-4 py-2 rounded-md shadow-lg">
          Noticias Destacadas
        </h2>
      </div>
      {posts.map((post, i) => (
        <div
          key={post.id}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === index ? 1 : 0, zIndex: i === index ? 10 : 0 }}
        >
          <Link href={`/posts/${post.slug}`} className="block h-full relative">
            {post._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
              <img
                src={post._embedded["wp:featuredmedia"][0].source_url}
                className="object-cover w-full h-full"
                alt=""
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute bottom-0 p-8 z-20">
              <h3
                className="text-3xl md:text-4xl font-black text-white leading-tight uppercase tracking-tighter line-clamp-2"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [footballPosts, setFootballPosts] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    async function getData() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/posts?_embed&per_page=30&v=${Date.now()}`,
          { cache: "no-store" },
        );
        const data = await res.json();

        if (Array.isArray(data)) {
          // Filtro simple: Si tiene el ID 21 (Fútbol), lo quita. Si no, lo deja.
          const nonFootball = data.filter(
            (post: any) => !post.categories?.includes(21),
          );
          setPosts(nonFootball);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error("Error posts:", error);
      }
    }
    getData();
  }, []);

  useEffect(() => {
    async function getFootballData() {
      try {
        const categoryRes = await fetch(
          `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/categories?slug=futbol&v=${Date.now()}`,
          { cache: "no-store" },
        );
        const categoryData = await categoryRes.json();
        if (categoryData.length > 0) {
          const footballCategoryId = categoryData[0].id;
          const postsRes = await fetch(
            `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/posts?_embed&categories=${footballCategoryId}&per_page=3&v=${Date.now()}`,
            { cache: "no-store" },
          );
          const postsData = await postsRes.json();
          setFootballPosts(Array.isArray(postsData) ? postsData : []);
        }
      } catch (error) {
        console.error("Error football:", error);
      }
    }
    getFootballData();
  }, []);

  if (!isClient) return <div className="min-h-screen bg-zinc-950" />;

  // Definición segura de las variables de segmentación
  const featuredPosts = posts.slice(0, 5);
  const remainingPosts = posts.slice(5);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* CABECERA */}
        <div className="flex flex-col md:flex-row gap-6 mb-10 pt-8">
          <div className="md:w-[70%]">
            {featuredPosts.length > 0 ? (
              <FeaturedCarousel posts={featuredPosts} />
            ) : (
              <div className="w-full h-[450px] bg-zinc-900 animate-pulse rounded-2xl" />
            )}
          </div>
          <div className="md:w-[30%] hidden md:flex bg-zinc-900 rounded-2xl border-2 border-dashed border-zinc-800 items-center justify-center text-center p-4">
            <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">
              Publicidad
            </p>
          </div>
        </div>

        {/* SECCIÓN FÚTBOL */}
        <section className="mb-12">
          <div className="mb-6">
            <span className="bg-sky-500 text-white text-xs font-black uppercase tracking-tighter px-4 py-2 rounded-md">
              Fútbol
            </span>
          </div>
          <div className="flex flex-row gap-8 overflow-x-auto pb-4 scrollbar-hide">
            {footballPosts.map((post: any) => (
              <article
                key={post.id}
                className="flex-shrink-0 w-[300px] md:w-[calc(33.33%-22px)]"
              >
                <Link href={`/posts/${post.slug}`}>
                  <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-zinc-900 mb-4 border border-zinc-800">
                    <img
                      src={
                        post._embedded?.["wp:featuredmedia"]?.[0]?.source_url
                      }
                      className="object-cover w-full h-full"
                      alt=""
                    />
                  </div>
                  <div className="space-y-2 px-1">
                    <h3
                      className="text-lg font-bold text-white leading-tight uppercase line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                    <div
                      className="text-zinc-400 text-sm line-clamp-3 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: post.excerpt.rendered,
                      }}
                    />
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* SECCIÓN VERTICAL */}
        <div className="grid gap-12 max-w-5xl">
          {remainingPosts.map((post: any) => {
            const category = post._embedded?.["wp:term"]?.[0]?.[0];
            return (
              <article
                key={post.id}
                className="group border-b border-zinc-900 pb-12 last:border-b-0"
              >
                <div className="flex flex-col md:flex-row gap-10">
                  <div className="md:w-1/3 relative">
                    <Link href={`/posts/${post.slug}`}>
                      <div className="overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800">
                        <img
                          src={
                            post._embedded?.["wp:featuredmedia"]?.[0]
                              ?.source_url
                          }
                          className="object-cover h-60 w-full group-hover:scale-105 transition duration-300"
                          alt=""
                        />
                      </div>
                    </Link>
                    {category && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="bg-sky-500 text-white text-[10px] font-black uppercase tracking-tighter px-3 py-1.5 rounded-md shadow-md">
                          {category.name}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="md:w-2/3 relative flex flex-col justify-center min-h-[200px]">
                    <Link href={`/posts/${post.slug}`}>
                      <h2
                        className="text-base md:text-lg font-bold text-white mb-4 leading-tight uppercase"
                        dangerouslySetInnerHTML={{
                          __html: post.title.rendered,
                        }}
                      />
                      <div
                        className="text-zinc-400 line-clamp-3 text-sm leading-relaxed mb-6"
                        dangerouslySetInnerHTML={{
                          __html: post.excerpt.rendered,
                        }}
                      />
                    </Link>

                    <div className="md:absolute bottom-0 right-0">
                      <Link
                        href={`/posts/${post.slug}`}
                        className="inline-block bg-sky-500 text-white text-[10px] font-bold uppercase tracking-widest px-6 py-2 rounded-full hover:bg-sky-600 transition shadow-lg shadow-sky-500/20"
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
    </main>
  );
}
