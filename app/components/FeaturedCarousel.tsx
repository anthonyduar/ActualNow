"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function FeaturedCarousel({ posts }: { posts: any[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % posts.length);
    }, 3000); // Cambia cada 3 segundos
    return () => clearInterval(timer);
  }, [posts.length]);

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-2xl bg-zinc-900">
      {posts.map((post, i) => (
        <div
          key={post.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
            i === index
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0"
          }`}
          style={{ transform: `translateX(${(i - index) * 100}%)` }}
        >
          <Link href={`/posts/${post.slug}`} className="block h-full relative">
            <img
              src={post._embedded?.["wp:featuredmedia"]?.[0]?.source_url}
              className="object-cover w-full h-full"
              alt=""
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
            <div className="absolute bottom-0 p-6">
              <h3
                className="text-2xl font-bold text-white leading-tight uppercase line-clamp-2"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
