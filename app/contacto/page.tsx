export default function Contacto() {
  return (
    <main className="max-w-2xl mx-auto p-10 font-sans text-white">
      <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">
        Contacto
      </h1>
      <p className="text-zinc-500 mb-8 text-sm uppercase tracking-widest">
        Escríbenos tus dudas o sugerencias
      </p>

      <form className="grid gap-6 bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
        <div>
          <label className="block text-xs font-bold mb-2 uppercase tracking-wider text-sky-500">
            Nombre
          </label>
          <input
            type="text"
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
            className="w-full bg-black border border-zinc-800 p-3 rounded-lg focus:outline-none focus:border-sky-500 text-white transition"
            placeholder="tu@email.com"
          />
        </div>
        <div>
          <label className="block text-xs font-bold mb-2 uppercase tracking-wider text-sky-500">
            Mensaje
          </label>
          <textarea
            className="w-full bg-black border border-zinc-800 p-3 rounded-lg h-32 focus:outline-none focus:border-sky-500 text-white transition resize-none"
            placeholder="¿En qué podemos ayudarte?"
          ></textarea>
        </div>
        <button className="bg-sky-500 text-white font-bold py-3 rounded-full uppercase text-xs tracking-widest hover:bg-sky-600 transition shadow-lg shadow-sky-500/20">
          Enviar Mensaje
        </button>
      </form>
    </main>
  );
}
