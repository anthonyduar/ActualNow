"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Inicio", href: "/" },
    { name: "Fútbol", href: "/categoria/futbol" },
    { name: "Rugby/NFL", href: "/categoria/rugby" },
    { name: "Béisbol", href: "/categoria/beisbol" },
    { name: "Baloncesto", href: "/categoria/baloncesto" },
  ];

  return (
    <nav className="bg-black border-b border-zinc-900 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* LOGO */}
          <Link
            href="/"
            className="text-xl font-black tracking-tighter text-white"
          >
            ACTUAL<span className="text-sky-500">NOW</span>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-zinc-400 hover:text-white text-[11px] uppercase tracking-widest transition"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* MOBILE BUTTON */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-400 hover:text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-zinc-900">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block text-zinc-400 hover:text-white py-3 text-sm uppercase tracking-widest"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
