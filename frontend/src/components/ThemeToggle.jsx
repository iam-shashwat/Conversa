export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/60 px-3 py-2 text-sm font-bold text-zinc-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5 dark:text-stone-300"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      aria-pressed={theme === "dark"}
      onClick={onToggle}
    >
      <span className="relative inline-flex h-5 w-9 items-center rounded-full border border-black/8 bg-black/5 p-0.5 dark:border-white/10 dark:bg-white/10">
        <span
          className={`h-3.5 w-3.5 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.18)] transition-transform ${
            theme === "dark" ? "translate-x-4 bg-stone-100" : "translate-x-0"
          }`}
        />
      </span>
      <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}
