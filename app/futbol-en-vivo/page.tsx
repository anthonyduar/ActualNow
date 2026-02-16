export default function EnVivo() {
  return (
    <main className="max-w-4xl mx-auto p-10 text-white font-sans">
      <div className="flex items-center gap-4 mb-10">
        <div className="h-3 w-3 bg-red-600 rounded-full animate-pulse"></div>
        <h1 className="text-3xl font-bold uppercase tracking-tighter">
          Fútbol en Vivo
        </h1>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 p-20 rounded-2xl text-center">
        <p className="text-zinc-500 uppercase tracking-widest text-sm italic">
          No hay transmisiones disponibles en este momento.
        </p>
      </div>
    </main>
  );
}
