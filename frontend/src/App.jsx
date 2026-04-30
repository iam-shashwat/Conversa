import { useState } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [conversationId] = useState(() => crypto.randomUUID());

  const sendMessage = async () => {
    const res = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
            content: input,
            conversation_id: conversationId
          }),
    });

    const data = await res.json();
    setResponse(data.reply);
  };

  return (
    <div className="p-10">
      <input
        className="border p-2"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button className="ml-2 p-2 bg-blue-500 text-white" onClick={sendMessage}>
        Send
      </button>

      <div className="mt-5 text-xl">{response}</div>
      <div className="text-sm text-gray-500">
         ID: {conversationId}
      </div>
    </div>
  );
}