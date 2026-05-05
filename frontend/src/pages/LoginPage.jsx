import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BrandLockup from "../components/BrandLockup.jsx";
import PageBackdrop from "../components/PageBackdrop.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import { useAppState } from "../context/AppState.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme, signIn } = useAppState();
  const [form, setForm] = useState({ email: "", password: "" });

  const updateField = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.email.trim() || !form.password.trim()) return;

    signIn({
      name: form.email.split("@")[0],
      email: form.email.trim(),
    });
    navigate("/chat", { replace: true });
  };

  return (
    <PageBackdrop>
      <section className="animate-frame-enter relative mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-6xl overflow-hidden rounded-[34px] border border-black/8 bg-white/65 shadow-[0_30px_90px_rgba(34,40,36,0.12)] backdrop-blur-2xl transition-colors dark:border-white/10 dark:bg-[#111815]/80 dark:shadow-[0_32px_100px_rgba(0,0,0,0.42)]">
        <div className="flex w-full flex-col lg:grid lg:grid-cols-[1.08fr_0.92fr]">
          <section className="flex flex-col justify-between gap-8 border-b border-black/8 p-5 dark:border-white/10 lg:border-b-0 lg:border-r">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <BrandLockup subtitle="Quiet messaging for focused work" />
                <ThemeToggle theme={theme} onToggle={toggleTheme} />
              </div>

              <div className="grid gap-4">
                <span className="inline-flex w-fit items-center rounded-full border border-black/8 bg-white/60 px-3 py-1.5 text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-zinc-500 dark:border-white/10 dark:bg-white/5 dark:text-stone-400">
                  Welcome back
                </span>

                <div className="grid gap-3">
                  <h1 className="m-0 max-w-[9ch] font-display text-[clamp(2.35rem,5vw,4.6rem)] leading-[0.92] tracking-[-0.05em] text-balance">
                    Sign in and step back into the calm.
                  </h1>
                  <p className="m-0 max-w-xl text-[0.98rem] leading-7 text-zinc-500 dark:text-stone-400">
                    Conversa keeps the interface soft, the messaging focused, and the
                    flow simple from first prompt to final reply.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Minimal UI", "Designed to stay quiet and readable."],
                  ["Theme aware", "Light and dark modes stay perfectly in sync."],
                  ["Fast entry", "Move from auth to chat in one clean flow."],
                ].map(([title, copy]) => (
                  <div
                    key={title}
                    className="rounded-[1.6rem] border border-black/8 bg-white/55 p-4 dark:border-white/10 dark:bg-white/5"
                  >
                    <p className="m-0 text-sm font-bold text-zinc-900 dark:text-stone-100">
                      {title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-stone-400">
                      {copy}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.8rem] border border-black/8 bg-stone-50/80 p-4 dark:border-white/10 dark:bg-[#0f1512]/90">
              <p className="m-0 text-sm font-semibold text-zinc-500 dark:text-stone-400">
                Returning to a saved workflow? Your recent sessions and conversation
                context will pick up right where you left off.
              </p>
            </div>
          </section>

          <section className="flex items-center justify-center p-5">
            <div className="w-full max-w-md rounded-[2rem] border border-black/8 bg-white/82 p-5 shadow-[0_20px_60px_rgba(25,34,29,0.08)] dark:border-white/10 dark:bg-[#101714]/92">
              <div className="mb-5">
                <h2 className="m-0 text-[1.55rem] font-semibold tracking-[-0.03em] text-zinc-950 dark:text-stone-100">
                  Log in to Conversa
                </h2>
                <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-stone-400">
                  Use your details to continue into the messaging workspace.
                </p>
              </div>

              <form className="grid gap-4" onSubmit={handleSubmit}>
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-zinc-700 dark:text-stone-300">
                    Email
                  </span>
                  <input
                    className="rounded-2xl border border-black/8 bg-stone-50/80 px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-stone-100 dark:placeholder:text-stone-500"
                    type="email"
                    value={form.email}
                    placeholder="you@example.com"
                    autoComplete="email"
                    onChange={updateField("email")}
                    required
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-zinc-700 dark:text-stone-300">
                    Password
                  </span>
                  <input
                    className="rounded-2xl border border-black/8 bg-stone-50/80 px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-stone-100 dark:placeholder:text-stone-500"
                    type="password"
                    value={form.password}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    onChange={updateField("password")}
                    minLength={6}
                    required
                  />
                </label>

                <button
                  type="submit"
                  className="mt-2 inline-flex items-center justify-center rounded-2xl bg-linear-to-b from-emerald-700 to-emerald-950 px-4 py-3.5 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(23,55,44,0.16)] dark:from-[#a2d3b7] dark:to-[#7fb797] dark:text-[#08110d]"
                >
                  Log in
                </button>
              </form>

              <p className="mt-5 text-center text-sm text-zinc-500 dark:text-stone-400">
                Need a new account?{" "}
                <button
                  type="button"
                  className="font-semibold text-emerald-800 transition hover:text-emerald-700 dark:text-emerald-200 dark:hover:text-emerald-100"
                  onClick={() => navigate("/signup")}
                >
                  Sign up
                </button>
              </p>
            </div>
          </section>
        </div>
      </section>
    </PageBackdrop>
  );
}
