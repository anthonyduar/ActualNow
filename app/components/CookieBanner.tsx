"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookies_accepted");
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookies_accepted", "true");
    setVisible(false);
  };

  const handleClose = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Aviso de cookies"
      className="fixed inset-x-4 bottom-4 z-[9999] mx-auto flex max-w-xl flex-col gap-4 rounded-2xl border border-sky-400/30 bg-zinc-950/90 p-5 text-white shadow-2xl shadow-black/50 backdrop-blur-md sm:inset-x-auto sm:right-6 sm:mx-0 sm:p-6"
    >
      <button
        onClick={handleClose}
        aria-label="Cerrar aviso de cookies"
        className="absolute right-3 top-3 rounded-full p-1 text-zinc-500 transition hover:bg-white/10 hover:text-white"
      >
        <span aria-hidden="true">×</span>
      </button>
      <div className="pr-5">
        <p className="mb-1 text-[10px] font-black uppercase tracking-[0.25em] text-sky-400">Privacidad</p>
        <p className="text-sm leading-relaxed text-zinc-300">
          Utilizamos cookies para mejorar tu experiencia y analizar el tráfico.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/politica-de-cookies" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 transition hover:text-white">
          Ver política
        </Link>
        <button onClick={handleAccept} className="ml-auto rounded-full bg-sky-500 px-5 py-2 text-[10px] font-black uppercase tracking-widest text-white transition hover:bg-sky-400">
          Aceptar
        </button>
      </div>
    </aside>
  );
}
