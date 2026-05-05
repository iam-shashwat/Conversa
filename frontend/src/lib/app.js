export const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";
export const THEME_STORAGE_KEY = "conversa-theme";
export const AUTH_STORAGE_KEY = "conversa-user";
export const STARTER_PROMPTS = [
  "Plan my next steps",
  "Summarize this idea",
  "Debug my API request",
];

export const timeFormatter = new Intl.DateTimeFormat([], {
  hour: "numeric",
  minute: "2-digit",
});

export function getInitialTheme() {
  if (typeof window === "undefined") return "light";

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;

  try {
    const value = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export async function getErrorMessage(response) {
  const text = await response.text();

  if (!text) {
    return `Request failed with status ${response.status}`;
  }

  try {
    const data = JSON.parse(text);
    return data.detail || data.reply || `Request failed with status ${response.status}`;
  } catch {
    return text;
  }
}

export function createMessage(role, content) {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: new Date().toISOString(),
  };
}

export function getDisplayName(user) {
  if (!user) return "";
  return user.name?.trim() || user.email?.split("@")[0] || "Guest";
}

export function getInitials(user) {
  const name = getDisplayName(user);

  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
