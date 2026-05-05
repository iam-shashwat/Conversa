export default function BrandLockup({ subtitle = "Minimal AI chat workspace" }) {
  return (
    <div className="flex items-center gap-4">
      <div className="grid h-11 w-11 place-items-center rounded-2xl border border-black/10 bg-linear-to-b from-emerald-700 to-emerald-950 text-[1.25rem] font-extrabold text-white shadow-[0_18px_36px_rgba(23,55,44,0.2)] dark:border-white/10 dark:from-[#a3d5b9] dark:to-[#76b08f] dark:text-[#08110d] dark:shadow-[0_18px_38px_rgba(0,0,0,0.3)]">
        C
      </div>

      <div className="grid gap-0.5">
        <p className="m-0 text-[0.78rem] font-extrabold uppercase tracking-[0.14em] text-emerald-900 dark:text-emerald-200">
          Conversa
        </p>
        <p className="m-0 text-[0.9rem] font-semibold text-zinc-500 dark:text-stone-400">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
