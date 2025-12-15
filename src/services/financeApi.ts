import { FinanceAnswers, FinanceAdvice } from "@/types/finance";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Парсит ответ AI в структурированный FinanceAdvice
 * Использует конвертированные суммы из backend
 */
const parseAIResponse = async (
  aiAnswer: string,
  totalIncomeRUB: number,
  totalExpensesRUB: number,
  answers: FinanceAnswers
): Promise<FinanceAdvice> => {
  // Создаём копию answers с конвертированными суммами в рубли для графиков
  const answersInRUB: FinanceAnswers = {
    ...answers,
    incomeSources: answers.incomeSources.map(s => ({
      ...s,
      amount: totalIncomeRUB, // Backend уже сконвертировал
      currency: 'RUB',
    })),
    expenseSources: answers.expenseSources.map(s => ({
      ...s,
      amount: totalExpensesRUB, // Backend уже сконвертировал
      currency: 'RUB',
    })),
  };

  // Импортируем вспомогательные функции
  const { generateBudgetAllocation, generateSavingsProjection } = await import('@/utils/financeHelpers');

  return {
    summary: aiAnswer,
    recommendations: [], // AI ответ уже содержит рекомендации в тексте
    budgetAllocation: generateBudgetAllocation(totalIncomeRUB, totalExpensesRUB, answersInRUB),
    projectedSavings: generateSavingsProjection(totalIncomeRUB, totalExpensesRUB),
  };
};

/**
 * Отправляет финансовые данные на бэкенд и получает AI рекомендации
 */
export const generateFinanceAdviceFromAPI = async (answers: FinanceAnswers): Promise<FinanceAdvice> => {
  try {
    // Используем новый endpoint со структурированными данными и автоматической конвертацией валют
    const response = await fetch(`${API_URL}/api/v1/advice/structured`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        incomeSources: answers.incomeSources,
        expenseSources: answers.expenseSources,
        problems: answers.problems,
        customProblem: answers.customProblem,
        additionalInfo: answers.additionalInfo,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // Backend возвращает конвертированные суммы
    return parseAIResponse(
      data.answer,
      data.totalIncomeRUB,
      data.totalExpensesRUB,
      answers
    );

  } catch (error) {
    console.error('API request failed:', error);
    // Fallback на локальный mock если API недоступен
    const { generateFinanceAdviceLocal } = await import('@/utils/financeHelpers');
    return generateFinanceAdviceLocal(answers);
  }
};
