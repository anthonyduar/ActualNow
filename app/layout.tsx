import "./globals.css";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SafeDate, SearchButton } from "./components/ClientElements";

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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/posts?per_page=5&categories_exclude=77&v=${Date.now()}`,
      { cache: "no-store" },
    );
    if (res.ok) {
      tickerPosts = await res.json();
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
    { nombre: "rugby/nfl", slug: "rugby" },
  ];

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6929115276344973"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="bg-white text-black min-h-screen flex flex-col">
        <header className="max-w-6xl mx-auto w-full p-6 pb-0">
          <div className="flex justify-end mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
            <SafeDate />
          </div>

          <div className="relative w-full mb-6">
            <img
              src="/banner.jpg"
              alt="Banner"
              className="w-full h-52 md:h-64 object-cover rounded-lg shadow-md"
            />
            <div className="absolute inset-0 flex items-center pl-15 md:pl-20">
              <Link href="/">
                <img
                  src="/logo.png"
                  alt="ActualNow"
                  className="h-24 md:h-36 w-auto drop-shadow-2xl"
                />
              </Link>
            </div>
          </div>

          <div className="bg-black text-white p-2 mb-4 flex overflow-hidden border-y border-gray-800 font-sans">
            <span className="font-bold text-red-600 mr-4 bg-black z-10 whitespace-nowrap px-2">
              ÚLTIMA HORA:
            </span>
            <div className="flex overflow-hidden">
              <div className="animate-marquee whitespace-nowrap">
                {tickerPosts.map((post: any) => (
                  <Link
                    key={post.id}
                    href={`/posts/${post.slug}`}
                    className="mx-10 text-base font-medium uppercase hover:text-sky-400 transition"
                  >
                    {post.title.rendered}{" "}
                    <span className="text-red-600 px-2">•</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4 font-sans border-b pb-4 text-sm md:text-base relative">
            <Link
              href="/"
              className="font-bold hover:text-sky-500 transition uppercase text-sky-500"
            >
              Inicio
            </Link>

            {/* Menú desplegable para móvil (vertical y horizontal) */}
            <details className="max-lg:inline-block lg:hidden group relative">
              <summary className="font-bold hover:text-sky-500 transition uppercase cursor-pointer list-none inline-flex items-center gap-1">
                Categorías <span className="group-open:rotate-180 transition-transform text-xs">▼</span>
              </summary>
              <div className="absolute left-0 top-full bg-black border border-gray-800 p-4 mt-2 flex flex-col gap-3 z-50 shadow-2xl rounded-md min-w-[180px]">
                {categorias.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/categoria/${cat.slug}`}
                    className="font-bold hover:text-sky-500 transition uppercase text-sm"
                  >
                    {cat.nombre}
                  </Link>
                ))}
              </div>
            </details>

            {/* Categorías normales en fila solo para PC */}
            <div className="hidden md:flex flex-wrap items-center gap-x-6 gap-y-2">
              {categorias.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categoria/${cat.slug}`}
                  className="font-bold hover:text-sky-500 transition uppercase"
                >
                  {cat.nombre}
                </Link>
              ))}
            </div>

            <SearchButton />

            <Link
              href="/futbol-en-vivo"
              className="bg-red-600 text-white px-4 py-1 rounded-full font-bold text-xs md:text-sm animate-pulse hover:bg-red-700 transition"
            >
              ● FÚTBOL EN VIVO
            </Link>
          </nav>
        </header>

        <div className="flex-grow">{children}</div>

        {/* FOOTER COMPLETO RESTAURADO */}
        <footer className="bg-black text-white mt-10 border-t-4 border-sky-500 font-sans">
          <div className="max-w-6xl mx-auto p-10 grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <img src="/logo.png" alt="Logo" className="h-12 w-auto mb-4" />
              <p className="text-gray-400 text-sm">
                Noticias deportivas al instante.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-sky-500 mb-4 uppercase text-xs tracking-widest">
                Secciones
              </h3>
              <div className="flex flex-col gap-2 text-sm text-gray-300">
                <Link
                  href="/categoria/futbol"
                  className="hover:text-white transition"
                >
                  Fútbol
                </Link>
                <Link
                  href="/categoria/beisbol"
                  className="hover:text-white transition"
                >
                  Béisbol
                </Link>
                <Link
                  href="/categoria/baloncesto"
                  className="hover:text-white transition"
                >
                  Baloncesto
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-sky-500 mb-4 uppercase text-xs tracking-widest">
                Información
              </h3>
              <div className="flex flex-col gap-2 text-sm text-gray-300">
                <Link
                  href="/aviso-legal"
                  className="hover:text-white transition"
                >
                  Aviso Legal
                </Link>
                <Link
                  href="/politica-de-privacidad"
                  className="hover:text-white transition"
                >
                  Política de Privacidad
                </Link>
                <Link
                  href="/politica-de-cookies"
                  className="hover:text-white transition"
                >
                  Política de Cookies
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-sky-500 mb-4 uppercase text-xs tracking-widest">
                Contacto
              </h3>
              <Link
                href="/contacto"
                className="inline-block bg-sky-500 text-white text-center py-2 px-6 rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-sky-600 transition mb-4"
              >
                Escríbenos
              </Link>
              <p className="text-xs text-gray-500">
                Sitio web patrocinado por <a href="https://eparadise.vercel.app" target="_blank" className="text-sky-500 hover:underline">eParadise</a>
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 py-6 text-center text-xs text-gray-500">
            <p>
              © <SafeDate format="year" /> ActualNow. Todos los derechos
              reservados.
            </p>
          </div>
        </footer>
        <GoogleAnalytics gaId="G-QC35JH2V91" />
        </body>
    </html>
  );
}
