"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type NewsPost = {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt?: { rendered: string };
  _embedded?: {
    [key: string]: Array<{ source_url?: string }>;
  };
};

export default function LatestNewsBanner({ posts }: { posts: NewsPost[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (posts.length < 2) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % posts.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [posts.length]);

  if (posts.length === 0) {
    return (
      <div className="flex min-h-[230px] items-center justify-center rounded-xl bg-black px-6 text-center text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">
        Cargando las últimas noticias
      </div>
    );
  }

  const activePost = posts[activeIndex];
  const image = activePost._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  return (
    <section aria-label="Últimas noticias" className="overflow-hidden rounded-xl bg-black shadow-2xl ring-1 ring-white/10">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <p className="text-[11px] font-black uppercase tracking-[0.28em] text-sky-400">
          Actualidad · Últimas noticias
        </p>
        <p className="text-[10px] font-bold tabular-nums text-zinc-500">
          {String(activeIndex + 1).padStart(2, "0")} / {String(posts.length).padStart(2, "0")}
        </p>
      </div>

      <Link href={`/${activePost.slug}`} className="group grid min-h-[230px] md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[180px] overflow-hidden bg-zinc-950">
          {image ? (
            <img
              src={image}
              alt=""
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/50" />
        </div>
        <div className="flex flex-col justify-center gap-4 p-6 md:p-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">
            Noticia destacada
          </span>
          <h1
            className="text-2xl font-black uppercase leading-[1.05] tracking-tight text-white md:text-4xl"
            dangerouslySetInnerHTML={{ __html: activePost.title.rendered }}
          />
          {activePost.excerpt?.rendered ? (
            <p
              className="line-clamp-2 text-sm leading-relaxed text-zinc-400"
              dangerouslySetInnerHTML={{ __html: activePost.excerpt.rendered }}
            />
          ) : null}
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-400 transition group-hover:text-white">
            Leer noticia →
          </span>
        </div>
      </Link>

      <div className="flex gap-1.5 border-t border-white/10 px-5 py-3" role="tablist" aria-label="Seleccionar noticia">
        {posts.map((post, index) => (
          <button
            key={post.id}
            type="button"
            role="tab"
            aria-label={`Ver noticia ${index + 1}`}
            aria-selected={index === activeIndex}
            onClick={() => setActiveIndex(index)}
            className={`h-1.5 flex-1 rounded-full transition ${index === activeIndex ? "bg-sky-400" : "bg-zinc-800 hover:bg-zinc-600"}`}
          />
        ))}
      </div>
    </section>
  );
}
