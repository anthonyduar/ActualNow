import "./globals.css";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SafeDate, SearchButton } from "./components/ClientElements";

export const metadata = {
  title: "ActualNow | Noticias Deportivas al Instante",
  description:
    "Tu fuente principal de noticias de fútbol, béisbol, baloncesto y más.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/posts?per_page=5`,
    { cache: "no-store" },
  );
  const tickerPosts = await res.json();

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
              <div className="animate-marquee-custom whitespace-nowrap">
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

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4 font-sans border-b pb-4 text-sm md:text-base">
            <Link
              href="/"
              className="font-bold hover:text-sky-500 transition uppercase text-sky-500"
            >
              Inicio
            </Link>
            {categorias.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categoria/${cat.slug}`}
                className="font-bold hover:text-sky-500 transition uppercase"
              >
                {cat.nombre}
              </Link>
            ))}

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
        <footer className="bg-black text-white mt-20 border-t-4 border-sky-500 font-sans">
          <div className="max-w-6xl mx-auto p-10 grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <img src="/logo.png" alt="Logo" className="h-12 w-auto mb-4" />
              <p className="text-gray-400 text-sm">
                Tu fuente principal de noticias deportivas al instante.
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
                className="inline-block bg-sky-500 text-white text-center py-2 px-6 rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-sky-600 transition"
              >
                Escríbenos
              </Link>
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
