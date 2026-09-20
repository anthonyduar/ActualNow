"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function plainText(html = "") {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

type NewsPost = {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt?: { rendered: string };
  jetpack_featured_media_url?: string;
  _embedded?: {
    [key: string]: Array<{
      source_url?: string;
      media_details?: {
        sizes?: {
          large?: { source_url?: string };
          medium_large?: { source_url?: string };
          full?: { source_url?: string };
        };
      };
    }>;
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
  const featuredMedia = activePost._embedded?.["wp:featuredmedia"]?.[0];
  const image =
    featuredMedia?.source_url ??
    featuredMedia?.media_details?.sizes?.large?.source_url ??
    featuredMedia?.media_details?.sizes?.medium_large?.source_url ??
    featuredMedia?.media_details?.sizes?.full?.source_url ??
    activePost.jetpack_featured_media_url;

  return (
    <section aria-label="Últimas noticias" className="news-surface news-chrome min-h-[380px] md:h-[430px] flex flex-col justify-between overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 px-4 sm:px-5 py-2.5 sm:py-3">
        <p className="text-[11px] font-black uppercase tracking-[0.28em] text-sky-400">
          Últimas noticias
        </p>
      </div>

      <Link href={activePost.slug ? `/${activePost.slug}` : "/"} className="group flex flex-col md:grid md:grid-cols-[0.9fr_1.1fr] flex-1 min-h-0">
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-auto md:h-full overflow-hidden bg-zinc-950 flex-shrink-0">
          {image ? (
            <img
              src={image}
              alt={plainText(activePost.title.rendered)}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/50" />
        </div>
        <div className="flex flex-col justify-center gap-2 sm:gap-3 md:gap-4 p-4 sm:p-6 md:p-8 flex-1">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-sky-400">
            ActualNow
          </span>
          <h1 className="text-base sm:text-xl md:text-3xl lg:text-4xl font-black uppercase leading-snug sm:leading-tight tracking-tight text-white group-hover:text-sky-400 transition break-words">
            {plainText(activePost.title.rendered)}
          </h1>
          {activePost.excerpt?.rendered ? (
            <p className="text-xs sm:text-sm leading-relaxed text-zinc-300 break-words">
              {plainText(activePost.excerpt.rendered)}
            </p>
          ) : null}
          <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-sky-400 transition group-hover:text-white pt-1">
            Leer noticia →
          </span>
        </div>
      </Link>

      <div className="flex gap-1.5 border-t border-white/10 px-4 sm:px-5 py-2.5 sm:py-3" role="tablist" aria-label="Seleccionar noticia">
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
