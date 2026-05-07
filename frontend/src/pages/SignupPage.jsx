import { useState } from "react";
import { useNavigate } from "react-router-dom";

import BrandLockup from "../components/BrandLockup.jsx";
import PageBackdrop from "../components/PageBackdrop.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";
import { useAppState } from "../context/AppState.jsx";
import { API_URL, STARTER_PROMPTS, getErrorMessage } from "../lib/app.js";

export default function SignupPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme, signIn } = useAppState();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();
    const password = form.password.trim();

    if (!name || !email || !password || isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name,
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const data = await response.json();
      if (!data.user) {
        throw new Error("Signup response did not include a user.");
      }

      signIn(data.user);
      navigate("/chat", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageBackdrop>
      <section className="animate-frame-enter relative mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-6xl overflow-hidden rounded-[34px] border border-black/8 bg-white/65 shadow-[0_30px_90px_rgba(34,40,36,0.12)] backdrop-blur-2xl transition-colors dark:border-white/10 dark:bg-[#111815]/80 dark:shadow-[0_32px_100px_rgba(0,0,0,0.42)]">
        <div className="grid w-full gap-0 lg:grid-cols-[0.94fr_1.06fr]">
          <section className="flex items-center border-b border-black/8 p-5 dark:border-white/10 lg:border-b-0 lg:border-r">
            <div className="w-full rounded-4xl border border-black/8 bg-white/82 p-5 shadow-[0_20px_60px_rgba(25,34,29,0.08)] dark:border-white/10 dark:bg-[#101714]/92">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <BrandLockup subtitle="Create your workspace" />
                <ThemeToggle theme={theme} onToggle={toggleTheme} />
              </div>

              <div className="mb-5">
                <span className="inline-flex w-fit items-center rounded-full border border-black/8 bg-stone-50/80 px-3 py-1.5 text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-zinc-500 dark:border-white/10 dark:bg-white/5 dark:text-stone-400">
                  Create account
                </span>
                <h1 className="mt-4 text-[1.9rem] font-semibold tracking-[-0.04em] text-zinc-950 dark:text-stone-100">
                  Start your Conversa workspace
                </h1>
                <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-stone-400">
                  Set up your account and move straight into a cleaner, calmer chat
                  experience.
                </p>
              </div>

              <form className="grid gap-4" onSubmit={handleSubmit}>
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-zinc-700 dark:text-stone-300">
                    Full name
                  </span>
                  <input
                    className="rounded-2xl border border-black/8 bg-stone-50/80 px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-stone-100 dark:placeholder:text-stone-500"
                    type="text"
                    value={form.name}
                    placeholder="Shashwat Sharma"
                    autoComplete="name"
                    onChange={updateField("name")}
                    required
                  />
                </label>

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
                    placeholder="Create a password"
                    autoComplete="new-password"
                    onChange={updateField("password")}
                    minLength={6}
                    required
                  />
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 inline-flex items-center justify-center rounded-2xl bg-linear-to-b from-emerald-700 to-emerald-950 px-4 py-3.5 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(23,55,44,0.16)] dark:from-[#a2d3b7] dark:to-[#7fb797] dark:text-[#08110d]"
                >
                  {isSubmitting ? "Creating account..." : "Create account"}
                </button>
              </form>

              {error ? (
                <p className="mt-4 rounded-2xl border border-[#8d4b3a]/15 bg-[#f9ece8] px-4 py-3 text-sm text-[#7c4031] dark:border-white/10 dark:bg-[#341f1a] dark:text-[#ffd0c4]">
                  {error}
                </p>
              ) : null}

              <p className="mt-5 text-center text-sm text-zinc-500 dark:text-stone-400">
                Already have an account?{" "}
                <button
                  type="button"
                  className="font-semibold text-emerald-800 transition hover:text-emerald-700 dark:text-emerald-200 dark:hover:text-emerald-100"
                  onClick={() => navigate("/login")}
                >
                  Log in
                </button>
              </p>
            </div>
          </section>

          <section className="flex flex-col justify-between gap-8 p-5">
            <div className="grid gap-6">
              <div className="grid gap-4">
                <span className="inline-flex w-fit items-center rounded-full border border-black/8 bg-white/60 px-3 py-1.5 text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-zinc-500 dark:border-white/10 dark:bg-white/5 dark:text-stone-400">
                  New workspace
                </span>

                <div className="grid gap-3">
                  <h2 className="m-0 max-w-[8ch] font-display text-[clamp(2.35rem,5vw,4.5rem)] leading-[0.92] tracking-tighter text-balance">
                    Start here. Keep everything focused.
                  </h2>
                  <p className="m-0 max-w-xl text-[0.98rem] leading-7 text-zinc-500 dark:text-stone-400">
                    Signup is its own dedicated page so onboarding feels intentional:
                    cleaner, calmer, and more welcoming from the first step.
                  </p>
                </div>
              </div>
 
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Clean entry", "A dedicated signup flow with no login clutter."],
                  ["Instant access", "Create an account and land directly in chat."],
                  ["Private feel", "Soft surfaces and focused copy reduce noise."],
                  ["Same aesthetic", "Still aligned with the rest of the product."],
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

            <div className="rounded-[1.9rem] border border-black/8 bg-stone-50/80 p-4 dark:border-white/10 dark:bg-[#0f1512]/90">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.94),transparent_35%),linear-gradient(180deg,rgba(193,220,206,1),rgba(227,237,231,1))] dark:bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.12),transparent_35%),linear-gradient(180deg,rgba(63,95,79,1),rgba(26,39,33,1))]" />
                <div>
                  <p className="m-0 text-sm font-bold text-zinc-900 dark:text-stone-100">
                    Starter directions
                  </p>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-stone-400">
                    A few ways people begin once they join.
                  </p>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-3">
                {STARTER_PROMPTS.map((prompt) => (
                  <div
                    key={prompt}
                    className="rounded-[1.4rem] border border-black/8 bg-white/70 px-3 py-3 text-sm leading-5 text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-stone-300"
                  >
                    {prompt}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </section>
    </PageBackdrop>
  );
}
