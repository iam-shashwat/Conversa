import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

async function getErrorMessage(response) {
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

export default function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [conversationId] = useState(() => crypto.randomUUID());

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isSending) return;

    const userMessage = { role: "user", content: trimmedInput };

    setMessages(prev => [...prev, userMessage]);
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

      const aiMessage = { role: "assistant", content: data.reply };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error("Error:", err);

      const errorMessage =
        err instanceof Error ? err.message : "Server not responding";

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: `Error: ${errorMessage}` },
      ]);
      setInput(trimmedInput);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-10">
      <input
        className="border p-2"
        value={input}
        disabled={isSending}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") sendMessage();
        }}
      />

      <button
        className="ml-2 p-2 bg-blue-500 text-white"
        disabled={isSending}
        onClick={sendMessage}
      >
        {isSending ? "Sending..." : "Send"}
      </button>

      <div className="mt-5 text-xl">
        {messages.map((msg, i) => (
          <div key={i}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div className="text-sm text-gray-500 mt-3">
        ID: {conversationId}
      </div>
    </div>
  );
}
