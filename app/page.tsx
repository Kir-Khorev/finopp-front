"use client";

import { FormEvent, useState, useEffect, useRef } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function HomePage() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Автоскролл к последнему сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Сохранение истории в localStorage
  useEffect(() => {
    const saved = localStorage.getItem("finopp-chat-history");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Ошибка загрузки истории:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("finopp-chat-history", JSON.stringify(messages));
    }
  }, [messages]);

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem("finopp-chat-history");
    inputRef.current?.focus();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    setError(null);
    setLoading(true);
    const currentQuestion = question.trim();
    setMessages((prev) => [
      ...prev,
      { role: "user", content: currentQuestion },
    ]);
    setQuestion("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const res = await fetch(`${apiUrl}/api/v1/advice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: currentQuestion }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Ошибка при запросе к ИИ");
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer },
      ]);
    } catch (err: any) {
      setError(err.message || "Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm shadow-2xl p-6 md:p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">
              Finopp Chat
            </h1>
            <p className="text-sm text-slate-400">
              Чат с ИИ на базе Groq (Llama 3.3 70B)
            </p>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearHistory}
              className="px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 transition border border-slate-700"
            >
              Очистить
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Например: Объясни, что такое Groq?"
              className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm md:text-base outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/40 transition"
            />
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="px-4 py-2 rounded-xl bg-sky-500 text-sm md:text-base font-medium text-white disabled:bg-slate-700 disabled:text-slate-300 transition hover:bg-sky-400"
            >
              {loading ? "Ждём…" : "Спросить"}
            </button>
          </div>
          {error && <p className="text-sm text-rose-400">{error}</p>}
        </form>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {messages.length === 0 && (
            <p className="text-sm text-slate-500">
              История диалога появится здесь после вашего первого вопроса.
            </p>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`rounded-xl px-3 py-2 text-sm whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-sky-500/10 border border-sky-500/40"
                  : "bg-slate-800/80 border border-slate-700"
              }`}
            >
              <div className="text-[11px] uppercase tracking-wide text-slate-400 mb-1">
                {msg.role === "user" ? "Вы" : "ИИ"}
              </div>
              <div>{msg.content}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
