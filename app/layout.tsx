import "./globals.css";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SafeDate } from "./components/ClientElements";
import Navbar from "./components/Navbar";
import { fetchWpNoticias } from "@/lib/wordpress";
import HomeHeader from "./components/HomeHeader";
import CookieBanner from "./components/CookieBanner";

export const metadata = {
  title: "ActualNow | Noticias Deportivas al Instante",
  description:
    "Tu fuente principal de noticias de fútbol, béisbol, baloncesto y más.",
  verification: {
    google: "rzR3HWDEDQEf9c4QIl2VmFX1Gs-vAE0pdYV7QNiFyTk",
  },
  icons: {
    icon: "/isotipo.webp",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let tickerPosts = [];

  try {
    const res = await fetchWpNoticias(
      `_embed&per_page=5&categories_exclude=77&v=${Date.now()}`,
      { cache: "no-store" },
    );
    if (res.ok) {
      const data = await res.json();
      tickerPosts = Array.isArray(data) ? data : [];
    }
  } catch (error) {
    console.error("Error al cargar posts:", error);
  }

  const categorias = [
    { nombre: "fútbol", slug: "futbol" },
    { nombre: "béisbol", slug: "beisbol" },
    { nombre: "baloncesto", slug: "baloncesto" },
    { nombre: "tenis", slug: "tenis" },
    { nombre: "motor", slug: "motor" },
    { nombre: "combate", slug: "combate" },
  ];

  return (
    <html lang='es' suppressHydrationWarning>
      <head>
        <script
          async
          src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6929115276344973'
          crossOrigin='anonymous'
        ></script>
      </head>
      <body className='bg-black text-white min-h-screen flex flex-col'>
        <HomeHeader tickerPosts={tickerPosts} />

        <div className='flex min-h-0 flex-1 flex-col'>
          <Navbar categorias={categorias} />

          <main className='flex-grow bg-black'>{children}</main>

          {/* Footer principal con elementos centrados */}
          <footer className='mt-16 block w-full border-t border-sky-400/30 bg-black font-sans text-white'>
            <div className='mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-10 sm:grid-cols-3 sm:gap-8 lg:gap-12 items-center text-center'>
              <div className='flex flex-col items-center text-center'>
                <Link href='/'>
                  <img
                    src='/logo.webp'
                    alt='ActualNow'
                    className='h-24 md:h-28 w-auto object-contain mx-auto'
                  />
                </Link>
              </div>

              <div className='flex flex-col items-center text-center'>
                <Link
                  href='/acerca-de'
                  className='inline-flex rounded-full border border-sky-400/30 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-300 transition hover:border-sky-400 hover:text-sky-400 mb-5'
                >
                  Acerca de
                </Link>
                <div className='flex flex-col items-center gap-2 text-sm text-gray-300 text-center'>
                  <Link
                    href='/aviso-legal'
                    className='hover:text-white transition'
                  >
                    Aviso Legal
                  </Link>
                  <Link
                    href='/politica-de-privacidad'
                    className='hover:text-white transition'
                  >
                    Política de Privacidad
                  </Link>
                  <Link
                    href='/politica-de-cookies'
                    className='hover:text-white transition'
                  >
                    Política de Cookies
                  </Link>
                </div>
              </div>

              <div className='flex flex-col items-center text-center'>
                <Link
                  href='/contacto'
                  className='inline-flex rounded-full border border-sky-400/30 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-300 transition hover:border-sky-400 hover:text-sky-400 mb-5'
                >
                  Contacto
                </Link>
                <p className='text-xs text-gray-500 text-center'>
                  Sitio web patrocinado por{" "}
                  <a
                    href='https://eparadise.vercel.app'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-sky-500 hover:underline'
                  >
                    eParadise
                  </a>
                </p>
              </div>
            </div>

            <div className='border-t border-gray-800 py-6 text-center text-xs text-gray-500'>
              <p>
                © <SafeDate format='year' /> ActualNow. Todos los derechos
                reservados.
              </p>
            </div>
          </footer>
        </div>
        <CookieBanner />
        <GoogleAnalytics gaId='G-QC35JH2V91' />
      </body>
    </html>
  );
}
