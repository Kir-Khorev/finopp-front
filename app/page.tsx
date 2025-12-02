"use client";

import { FormEvent, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

type AnalysisResult = {
  balance: string;
  advice: string;
  income?: number;
  expenses?: number;
  difference?: number;
};

export default function HomePage() {
  // Поля анкеты
  const [status, setStatus] = useState("");
  const [expenses, setExpenses] = useState("");
  const [income, setIncome] = useState("");
  const [additional, setAdditional] = useState("");

  // Состояние
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  // Парсим числа из текста баланса
  const parseNumbers = (balanceText: string) => {
    const incomeMatch = balanceText.match(/Доход:\s*(\d+)/);
    const expensesMatch = balanceText.match(/Расход:\s*(\d+)/);
    
    const income = incomeMatch ? parseInt(incomeMatch[1]) : 0;
    const expenses = expensesMatch ? parseInt(expensesMatch[1]) : 0;
    const difference = income - expenses;

    return { income, expenses, difference };
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Валидация
    if (!status.trim() || !expenses.trim() || !income.trim()) {
      setError("Пожалуйста, заполните первые три поля");
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const res = await fetch(`${apiUrl}/api/v1/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: status.trim(),
          expenses: expenses.trim(),
          income: income.trim(),
          additional: additional.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Ошибка при анализе");
      }

      const data = await res.json();
      const numbers = parseNumbers(data.balance);
      
      setResult({
        balance: data.balance,
        advice: data.advice,
        income: numbers.income,
        expenses: numbers.expenses,
        difference: numbers.difference,
      });
    } catch (err: any) {
      setError(err.message || "Неизвестная ошибка");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStatus("");
    setExpenses("");
    setIncome("");
    setAdditional("");
    setResult(null);
    setError(null);
  };

  // Данные для графика
  const chartData = result
    ? [
        { name: "Доходы", value: result.income || 0, color: "#10b981" },
        { name: "Расходы", value: result.expenses || 0, color: "#ef4444" },
      ]
    : [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950/20 to-slate-950 text-slate-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
            Finopp
          </h1>
          <p className="text-slate-400">
            Финансовый анализ вашей ситуации с помощью ИИ
          </p>
        </div>

        {/* Анкета или Результат */}
        {!result ? (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm shadow-2xl p-6 md:p-8"
          >
            <h2 className="text-xl font-semibold mb-6 text-slate-200">
              Расскажите о вашей ситуации
            </h2>

            <div className="space-y-5">
              {/* Вопрос 1 */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  1. Ваш статус <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  placeholder="Например: работающий, пенсионер, студент, безработный..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 transition"
                  required
                />
              </div>

              {/* Вопрос 2 */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  2. Ежемесячные обязательные расходы{" "}
                  <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={expenses}
                  onChange={(e) => setExpenses(e.target.value)}
                  placeholder="Например: аренда 30000, кредит 15000, коммуналка 5000..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 transition"
                  required
                />
              </div>

              {/* Вопрос 3 */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  3. Ежемесячные доходы <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="Например: зарплата 50000, подработка 10000, помощь родителей 5000..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 transition"
                  required
                />
              </div>

              {/* Вопрос 4 */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  4. Что-то ещё?
                </label>
                <textarea
                  value={additional}
                  onChange={(e) => setAdditional(e.target.value)}
                  placeholder="Дополнительная информация о вашей ситуации (необязательно)..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 transition resize-none"
                  rows={3}
                />
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/40">
                <p className="text-sm text-rose-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 px-6 py-3 rounded-xl bg-emerald-600 font-medium text-white disabled:bg-slate-700 disabled:text-slate-400 transition hover:bg-emerald-500 disabled:cursor-not-allowed"
            >
              {loading ? "Анализируем..." : "Получить анализ"}
            </button>
          </form>
        ) : (
          /* Результат анализа */
          <div className="space-y-4">
            {/* Цифры с цветами */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm shadow-2xl p-6 md:p-8">
              <h2 className="text-lg font-semibold mb-4 text-emerald-400">
                Ваш баланс
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Доходы */}
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                  <div className="text-xs text-emerald-400 uppercase tracking-wider mb-1">
                    Доходы
                  </div>
                  <div className="text-2xl font-bold text-emerald-400">
                    {result.income?.toLocaleString("ru-RU") || 0} ₽
                  </div>
                </div>

                {/* Расходы */}
                <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4">
                  <div className="text-xs text-rose-400 uppercase tracking-wider mb-1">
                    Расходы
                  </div>
                  <div className="text-2xl font-bold text-rose-400">
                    {result.expenses?.toLocaleString("ru-RU") || 0} ₽
                  </div>
                </div>

                {/* Баланс */}
                <div
                  className={`rounded-xl p-4 ${
                    (result.difference || 0) >= 0
                      ? "bg-emerald-500/10 border border-emerald-500/30"
                      : "bg-rose-500/10 border border-rose-500/30"
                  }`}
                >
                  <div
                    className={`text-xs uppercase tracking-wider mb-1 ${
                      (result.difference || 0) >= 0
                        ? "text-emerald-400"
                        : "text-rose-400"
                    }`}
                  >
                    {(result.difference || 0) >= 0 ? "Профицит" : "Дефицит"}
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      (result.difference || 0) >= 0
                        ? "text-emerald-400"
                        : "text-rose-400"
                    }`}
                  >
                    {(result.difference || 0) >= 0 ? "+" : ""}
                    {result.difference?.toLocaleString("ru-RU") || 0} ₽
                  </div>
                </div>
              </div>

              {/* График */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-slate-400 mb-3">
                  Сравнение доходов и расходов
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="name"
                      stroke="#94a3b8"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      style={{ fontSize: "12px" }}
                      tickFormatter={(value) =>
                        `${(value / 1000).toFixed(0)}k`
                      }
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        border: "1px solid #334155",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) =>
                        `${value.toLocaleString("ru-RU")} ₽`
                      }
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Совет */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-sm shadow-2xl p-6 md:p-8">
              <h2 className="text-lg font-semibold mb-3 text-emerald-400">
                Финансовый совет
              </h2>
              <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">
                {result.advice}
              </p>
            </div>

            {/* Кнопка повтора */}
            <button
              onClick={handleReset}
              className="w-full px-6 py-3 rounded-xl bg-slate-800 font-medium text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition border border-slate-700"
            >
              Заполнить анкету заново
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
