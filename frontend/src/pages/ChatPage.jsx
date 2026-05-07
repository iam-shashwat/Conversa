import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAppState } from "../context/AppState.jsx";
import {
  API_URL,
  STARTER_PROMPTS,
  createMessage,
  getDisplayName,
  getErrorMessage,
  getInitials,
  timeFormatter,
} from "../lib/app.js";
import BrandLockup from "../components/BrandLockup.jsx";
import PageBackdrop from "../components/PageBackdrop.jsx";
import ThemeToggle from "../components/ThemeToggle.jsx";

export default function ChatPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme, authUser, signOut } = useAppState();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [conversationId] = useState(() => crypto.randomUUID().slice(0, 8));
  const inputRef = useRef(null);
  const messageEndRef = useRef(null);
  const hasMessages = messages.length > 0;

  useEffect(() => {
    const textarea = inputRef.current;
    if (!textarea) return;

    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, [input]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const applyStarterPrompt = (prompt) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  const handleLogout = () => {
    signOut();
    navigate("/login", { replace: true });
  };

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isSending) return;

    const userMessage = createMessage("user", trimmedInput);

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: trimmedInput,
          conversation_id: conversationId,
        }),
      });

      if (!res.ok) {
        throw new Error(await getErrorMessage(res));
      }

      const data = await res.json();
      if (!data.reply) {
        throw new Error("API returned an empty reply.");
      }

      setMessages((prev) => [...prev, createMessage("assistant", data.reply)]);
    } catch (err) {
      console.error("Error:", err);

      const errorMessage =
        err instanceof Error ? err.message : "Server not responding";

      setMessages((prev) => [
        ...prev,
        createMessage("assistant", `Error: ${errorMessage}`),
      ]);
      setInput(trimmedInput);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <PageBackdrop>
      <section className="animate-frame-enter relative mx-auto flex h-[calc(100dvh-2rem)] w-full max-w-5xl flex-col gap-3 overflow-hidden rounded-[34px] border border-black/8 bg-white/65 p-3 shadow-[0_30px_90px_rgba(34,40,36,0.12)] backdrop-blur-2xl transition-colors dark:border-white/10 dark:bg-[#111815]/80 dark:shadow-[0_32px_100px_rgba(0,0,0,0.42)] sm:h-[min(92dvh,900px)] sm:p-4">
        <header className={`flex flex-col ${hasMessages ? "gap-2" : "gap-3"}`}>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <BrandLockup />

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white/60 px-4 py-2.5 text-sm font-bold text-zinc-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:border-white/10 dark:bg-white/5 dark:text-stone-400">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(120,178,147,0.18)] dark:bg-emerald-300" />
                <span>{isSending ? "Waiting for reply" : "Ready"}</span>
              </div>

              <div className="inline-flex items-center gap-3 rounded-full border border-black/8 bg-white/60 px-3 py-2 dark:border-white/10 dark:bg-white/5">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-linear-to-b from-emerald-700 to-emerald-950 text-xs font-extrabold text-white dark:from-[#a2d3b7] dark:to-[#7fb797] dark:text-[#08110d]">
                  {getInitials(authUser)}
                </div>
                <div className="grid">
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-zinc-400 dark:text-stone-500">
                    Signed in
                  </span>
                  <span className="text-sm font-semibold text-zinc-700 dark:text-stone-200">
                    {getDisplayName(authUser)}
                  </span>
                </div>
              </div>

              <ThemeToggle theme={theme} onToggle={toggleTheme} />

              <button
                type="button"
                className="inline-flex items-center rounded-full border border-black/8 bg-white/60 px-4 py-2 text-sm font-bold text-zinc-500 transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5 dark:text-stone-300"
                onClick={handleLogout}
              >
                Log out
              </button>
            </div>
          </div>

          {!hasMessages ? (
            <div className="grid gap-2">
              <h1 className="m-0 max-w-[10ch] font-display text-[clamp(1.95rem,4.7vw,3.75rem)] leading-[0.92] tracking-[-0.045em] text-balance">
                Thoughtful chat, without the clutter.
              </h1>
              <p className="m-0 max-w-2xl text-[0.95rem] leading-6 text-zinc-500 dark:text-stone-400">
                A focused space for asking questions, refining ideas, and moving
                through problems without visual noise.
              </p>
            </div>
          ) : null}
        </header>

        <section className="flex min-h-0 flex-1 overflow-hidden rounded-[30px] border border-black/8 bg-stone-50/90 transition-colors dark:border-white/10 dark:bg-[#0f1512]/95">
          {!hasMessages ? (
            <div className="flex min-h-0 w-full items-center justify-center overflow-hidden px-4 py-5 sm:px-5 sm:py-4">
              <div className="grid w-full max-w-4xl justify-items-start gap-4">
                <div className="h-16 w-16 animate-orb-float rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.94),transparent_35%),linear-gradient(180deg,rgba(193,220,206,1),rgba(227,237,231,1))] shadow-[0_18px_38px_rgba(23,55,44,0.08)] dark:bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.12),transparent_35%),linear-gradient(180deg,rgba(63,95,79,1),rgba(26,39,33,1))]" />

                <div className="grid gap-2">
                  <p className="m-0 font-display text-[clamp(1.8rem,3.7vw,2.85rem)] leading-[0.98] tracking-[-0.04em]">
                    Start with a clear prompt
                  </p>
                  <p className="m-0 max-w-3xl text-[0.98rem] leading-7 text-zinc-500 dark:text-stone-400">
                    Ask a question, explore an idea, or troubleshoot an issue.
                    Your conversation will build here in a focused, readable thread.
                  </p>
                </div>

                <div className="grid w-full gap-2.5 md:grid-cols-3">
                  {STARTER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      className="min-h-20 rounded-[1.6rem] border border-black/8 bg-white/70 px-4 py-3 text-left text-[0.92rem] leading-5 text-zinc-800 transition hover:-translate-y-0.5 hover:border-emerald-900/15 dark:border-white/10 dark:bg-white/5 dark:text-stone-200"
                      onClick={() => applyStarterPrompt(prompt)}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-0 w-full flex-1 flex-col gap-2 overflow-y-auto bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_36%)] p-3 sm:p-4">
              {messages.map((msg) => {
                const isErrorMessage =
                  msg.role === "assistant" && msg.content.startsWith("Error:");

                return (
                  <article
                    key={msg.id}
                    className={`flex max-w-full ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`w-fit max-w-[min(34rem,86%)] min-w-0 border px-3.5 py-2.5 shadow-[0_10px_24px_rgba(23,32,27,0.06)] ${
                        msg.role === "user"
                          ? "rounded-[1.2rem] rounded-br-md border-emerald-950/10 bg-linear-to-b from-emerald-700 to-emerald-950 text-white dark:border-white/10 dark:from-[#1f7a62] dark:to-[#155443] dark:text-[#effbf4]"
                          : "rounded-[1.2rem] rounded-bl-md border-black/8 bg-[#eef2ef] text-zinc-900 dark:border-white/10 dark:bg-[#222725] dark:text-stone-100"
                      } ${
                        isErrorMessage
                          ? "border-[#8d4b3a]/20 bg-[#f9ece8] text-[#7c4031] dark:border-white/10 dark:bg-[#341f1a] dark:text-[#ffd0c4]"
                          : ""
                      }`}
                    >
                      <div className="flex max-w-full flex-wrap items-end gap-x-2 gap-y-1">
                        <p className="whitespace-pre-wrap wrap-break-words text-[0.98rem] leading-[1.52]">
                          {msg.content}
                        </p>
                        <time
                          dateTime={msg.createdAt}
                          className={`ml-auto shrink-0 text-[0.72rem] font-medium leading-none ${
                            msg.role === "user"
                              ? "text-white/70 dark:text-[#dff5ea]/72"
                              : "text-zinc-500 dark:text-stone-500"
                          }`}
                        >
                          {timeFormatter.format(new Date(msg.createdAt))}
                        </time>
                      </div>
                    </div>
                  </article>
                );
              })}

              {isSending ? (
                <article className="flex justify-start">
                  <div className="inline-flex items-center gap-1 rounded-full border border-black/8 bg-white/90 px-4 py-3 dark:border-white/10 dark:bg-[#18231d]">
                    <span className="h-1.5 w-1.5 animate-typing-bounce rounded-full bg-zinc-500 dark:bg-stone-400" />
                    <span
                      className="h-1.5 w-1.5 animate-typing-bounce rounded-full bg-zinc-500 dark:bg-stone-400"
                      style={{ animationDelay: "120ms" }}
                    />
                    <span
                      className="h-1.5 w-1.5 animate-typing-bounce rounded-full bg-zinc-500 dark:bg-stone-400"
                      style={{ animationDelay: "240ms" }}
                    />
                  </div>
                </article>
              ) : null}

              <div ref={messageEndRef} />
            </div>
          )}
        </section>

        <footer className="flex flex-col gap-2">
          <div className="flex flex-col items-start justify-between gap-2 px-1 text-[0.78rem] font-bold text-zinc-500 dark:text-stone-400 sm:flex-row sm:items-center">
            <span>Shift + Enter for a new line</span>
            <span className="rounded-full border border-black/8 bg-white/60 px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:border-white/10 dark:bg-white/5">
              Session {conversationId}
            </span>
          </div>

          <div className="flex flex-col gap-3 rounded-[26px] border border-black/10 bg-white/90 p-2.5 transition-colors dark:border-white/10 dark:bg-[#0f1613]/95 sm:flex-row sm:items-end">
            <textarea
              ref={inputRef}
              className="min-h-6 max-h-32 flex-1 resize-none bg-transparent px-1 py-2 text-[0.98rem] leading-[1.55] text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-stone-100 dark:placeholder:text-stone-500"
              value={input}
              disabled={isSending}
              placeholder="Type your message..."
              rows={1}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  sendMessage();
                }
              }}
            />

            <button
              type="button"
              className="inline-flex min-w-26 items-center justify-center rounded-2xl bg-linear-to-b from-emerald-700 to-emerald-950 px-4 py-3.5 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(23,55,44,0.16)] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none dark:from-[#a2d3b7] dark:to-[#7fb797] dark:text-[#08110d]"
              disabled={isSending || !input.trim()}
              onClick={sendMessage}
            >
              {isSending ? "Sending..." : "Send"}
            </button>
          </div>
        </footer>
      </section>
    </PageBackdrop>
  );
}
