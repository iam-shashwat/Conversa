export default function PageBackdrop({ children }) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f5efe6_0%,#ebe1d5_100%)] px-3 py-4 text-zinc-900 transition-colors dark:bg-[linear-gradient(180deg,#0d1311_0%,#121a16_100%)] dark:text-stone-100 sm:px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[5%] top-[8%] h-56 w-56 rounded-full bg-white/70 blur-3xl dark:bg-emerald-200/10" />
        <div className="absolute bottom-[10%] right-[7%] h-72 w-72 rounded-full bg-emerald-100/60 blur-3xl dark:bg-emerald-400/10" />
      </div>

      {children}
    </main>
  );
}
