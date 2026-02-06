import React, { useState } from "react";

export default function AskSanriPage({ mode = "ayna_sade" }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    { role: "system", text: "ASK SANRI hazır. Sorunu yaz." },
  ]);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  const send = async () => {
    const userText = question.trim();
    if (!userText || loading) return;

    setQuestion("");
    setLoading(true);
    setMessages((m) => [...m, { role: "user", text: userText }]);

    try {
      if (!API_URL) throw new Error("REACT_APP_API_URL missing");

      const res = await fetch(${API_URL}/ask, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userText, mode }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || "API error");

      setMessages((m) => [...m, { role: "assistant", text: data.answer || "Buradayım." }]);
    } catch (err) {
      console.error("ASK ERROR:", err);
      setMessages((m) => [...m, { role: "assistant", text: "Buradayım." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <div style={{ borderRadius: 18, padding: 18, background: "rgba(0,0,0,0.35)", color: "white" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <b>{m.role === "user" ? "Sen" : "SANRI"}:</b> {m.text}
          </div>
        ))}

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <textarea
            rows={3}
            placeholder="Sorunu buraya yaz…"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={{ flex: 1, padding: 12, borderRadius: 14 }}
          />

          <button onClick={send} disabled={loading || !question.trim()}>
            {loading ? "…" : "Gönder"}
          </button>
        </div>
      </div>
    </main>
  );
}