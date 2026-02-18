import Link from "next/link";

export default async function Contacto() {
  const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

  const recRes = await fetch(
    `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/posts?per_page=4&_embed&v=${Date.now()}`,
    { cache: "no-store" },
  );
  const recommended = await recRes.json();

  return (
    <main className="max-w-5xl mx-auto px-6 pt-10 text-white min-h-screen font-sans">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">
          Contacto
        </h1>
        <p className="text-zinc-500 mb-8 text-sm uppercase tracking-widest">
          Escríbenos tus dudas o sugerencias
        </p>

        {/* FORMULARIO CONECTADO */}
        <form
          action="https://api.web3forms.com/submit"
          method="POST"
          className="grid gap-6 bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800"
        >
          {/* Tu Access Key de Web3Forms */}
          <input
            type="hidden"
            name="access_key"
            value="74baae1a-d4db-41e1-a29c-8b7e936794de"
          />

          {/* Honeypot para evitar SPAM (invisible para usuarios) */}
          <input
            type="checkbox"
            name="botcheck"
            className="hidden"
            style={{ display: "none" }}
          />

          <div>
            <label className="block text-xs font-bold mb-2 uppercase tracking-wider text-sky-500">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full bg-black border border-zinc-800 p-3 rounded-lg focus:outline-none focus:border-sky-500 text-white transition"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-2 uppercase tracking-wider text-sky-500">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full bg-black border border-zinc-800 p-3 rounded-lg focus:outline-none focus:border-sky-500 text-white transition"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-2 uppercase tracking-wider text-sky-500">
              Mensaje
            </label>
            <textarea
              name="message"
              required
              className="w-full bg-black border border-zinc-800 p-3 rounded-lg h-32 focus:outline-none focus:border-sky-500 text-white transition resize-none"
              placeholder="¿En qué podemos ayudarte?"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-sky-500 text-white font-bold py-3 rounded-full uppercase text-xs tracking-widest hover:bg-sky-600 transition shadow-lg shadow-sky-500/20"
          >
            Enviar Mensaje
          </button>
        </form>
      </div>

      {/* SECCIÓN RECOMENDADOS */}
      <section className="mt-20 border-t border-zinc-800 pt-10">
        <h3 className="text-lg font-bold uppercase tracking-widest mb-8 border-l-4 border-sky-500 pl-4">
          Recomendados
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {recommended.map((rec: any) => (
            <Link key={rec.id} href={`/posts/${rec.slug}`} className="group">
              <div className="aspect-video mb-3 overflow-hidden rounded bg-zinc-800">
                {rec._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
                  <img
                    src={rec._embedded["wp:featuredmedia"][0].source_url}
                    className="object-cover w-full h-full group-hover:scale-105 transition duration-500"
                    alt=""
                  />
                )}
              </div>
              <h4
                className="text-sm font-bold leading-tight group-hover:text-sky-500 transition line-clamp-3"
                dangerouslySetInnerHTML={{ __html: rec.title.rendered }}
              />
            </Link>
          ))}
        </div>
      </section>

      <div className="text-center mt-10 mb-10">
        <Link
          href="/"
          className="inline-block bg-sky-500 text-white px-8 py-2 rounded-full font-bold uppercase text-[10px] tracking-widest hover:bg-sky-600 transition"
        >
          Volver
        </Link>
      </div>
    </main>
  );
}
