import "./globals.css";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SafeDate, SearchButton } from "./components/ClientElements";
import { fetchWpNoticias } from "@/lib/wordpress";
import LatestNewsBanner from "./components/LatestNewsBanner";

export const metadata = {
  title: "ActualNow | Noticias Deportivas al Instante",
  description:
    "Tu fuente principal de noticias de fútbol, béisbol, baloncesto y más.",
  verification: {
    google: "rzR3HWDEDQEf9c4QIl2VmFX1Gs-vAE0pdYV7QNiFyTk",
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
        <header className='max-w-6xl mx-auto w-full p-6 pb-0'>
          <div className='flex justify-end mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest'>
            <SafeDate />
          </div>

          <div className='relative w-full mb-6'>

          </div>

          <LatestNewsBanner posts={tickerPosts} />
        </header>

        <div className='contents'>
          <nav className='news-surface news-chrome sticky top-3 z-40 mx-auto mt-3 mb-4 flex w-[calc(100%-3rem)] max-w-[72rem] items-center justify-between px-4 py-3 font-sans text-base'>
            <div className='flex items-center gap-x-3'>
              <Link
                href='/'
                className='rounded-lg bg-sky-500/10 px-3 py-2 text-[11px] font-black uppercase tracking-widest text-sky-400 transition hover:bg-sky-500 hover:text-white'
              >
                Inicio
              </Link>

              <details className='max-sm:inline-block sm:hidden group relative'>
                <summary className='font-bold hover:text-sky-500 transition uppercase cursor-pointer list-none inline-flex items-center gap-1 text-sm'>
                  Categorías{" "}
                  <span className='group-open:rotate-180 transition-transform text-xs'>
                    ▼
                  </span>
                </summary>
                <div className='absolute left-0 top-full bg-black border border-gray-800 p-4 mt-2 flex flex-col gap-3 z-50 shadow-2xl rounded-md min-w-[180px]'>
                  {categorias.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/categoria/${cat.slug}`}
                      className='font-bold hover:text-sky-500 transition uppercase text-sm'
                    >
                      {cat.nombre}
                    </Link>
                  ))}
                </div>
              </details>

              <div className='hidden sm:flex flex-wrap items-center gap-x-6'>
                {categorias.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/categoria/${cat.slug}`}
                    className='font-bold hover:text-sky-500 transition uppercase'
                  >
                    {cat.nombre}
                  </Link>
                ))}
              </div>
            </div>

            <div className='flex items-center gap-x-6 ml-auto'>
              <SearchButton />
              <Link
                href='/futbol-en-vivo'
                className='bg-red-600 text-white px-3 py-1 rounded-full font-bold text-[10px] md:text-sm animate-pulse hover:bg-red-700 transition whitespace-nowrap'
              >
                ● FÚTBOL EN VIVO
              </Link>
            </div>
          </nav>
        </div>

        <main className='flex-grow bg-black'>{children}</main>

        {/* Footer principal restaurado */}
        <footer className='mt-16 block w-full border-t border-sky-400/30 bg-black font-sans text-white'>
          <div className='mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] lg:items-start lg:gap-6'>
            <div className='flex flex-col items-start'>
              <img src='/logo.png' alt='ActualNow' className='mb-1 h-28 w-auto object-contain object-left' />
              <Link
                href='/acerca-de'
                className='inline-flex rounded-full border border-sky-400/30 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-300 transition hover:border-sky-400 hover:text-sky-400'
              >
                Acerca de
              </Link>
            </div>

            <div>
              <h3 className='mb-5 text-[10px] font-black uppercase tracking-[0.25em] text-sky-400'>
                Información
              </h3>
              <div className='flex flex-col gap-2 text-sm text-gray-300'>
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

            <div className='lg:justify-self-end lg:min-w-[190px] lg:pt-0'>
              <h3 className='mb-5 text-[10px] font-black uppercase tracking-[0.25em] text-sky-400'>
                Contacto
              </h3>
              <Link
                href='/contacto'
                className='inline-flex rounded-full border border-sky-400/30 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-300 transition hover:border-sky-400 hover:text-sky-400 mb-4'
              >
                Escríbenos
              </Link>
              <p className='text-xs text-gray-500'>
                Sitio web patrocinado por{" "}
                <a
                  href='https://eparadise.vercel.app'
                  target='_blank'
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
        <GoogleAnalytics gaId='G-QC35JH2V91' />
      </body>
    </html>
  );
}
