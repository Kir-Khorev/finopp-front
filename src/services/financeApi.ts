import { FinanceAnswers, FinanceAdvice, INCOME_TYPES, EXPENSE_TYPES, PROBLEM_OPTIONS } from "@/types/finance";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Форматирует FinanceAnswers в детальный текстовый вопрос для AI
 */
const formatFinanceQuestion = (answers: FinanceAnswers): string => {
  const totalIncome = answers.incomeSources.reduce((sum, s) => sum + s.amount, 0);
  const totalExpenses = answers.expenseSources.reduce((sum, s) => sum + s.amount, 0);
  
  const incomeParts = answers.incomeSources
    .filter(s => s.amount > 0)
    .map(s => {
      const type = INCOME_TYPES.find(t => t.value === s.type);
      return `${type?.label || s.type}: ₽${s.amount}`;
    });

  const expenseParts = answers.expenseSources
    .filter(s => s.amount > 0)
    .map(s => {
      const type = EXPENSE_TYPES.find(t => t.value === s.type);
      return `${type?.label || s.type}: ₽${s.amount}`;
    });

  const problemLabels = answers.problems
    .map(p => PROBLEM_OPTIONS.find(o => o.value === p)?.label)
    .filter(Boolean);

  let question = `Проанализируй мою финансовую ситуацию и дай рекомендации.\n\n`;
  question += `📊 ДОХОДЫ (всего ₽${totalIncome.toLocaleString()}):\n`;
  question += incomeParts.join('\n') + '\n\n';
  question += `💸 РАСХОДЫ (всего ₽${totalExpenses.toLocaleString()}):\n`;
  question += expenseParts.join('\n') + '\n\n';
  
  if (problemLabels.length > 0) {
    question += `❗ ПРОБЛЕМЫ:\n${problemLabels.join('\n')}\n\n`;
  }

  if (answers.customProblem) {
    question += `📝 ДОПОЛНИТЕЛЬНО:\n${answers.customProblem}\n\n`;
  }

  if (answers.additionalInfo) {
    question += `ℹ️ КОНТЕКСТ:\n${answers.additionalInfo}\n\n`;
  }

  question += `Пожалуйста, дай:\n`;
  question += `1. Краткий анализ ситуации\n`;
  question += `2. 3-5 конкретных рекомендаций с приоритетами\n`;
  question += `3. Рекомендацию по распределению бюджета\n`;
  question += `4. Прогноз накоплений на год`;

  return question;
};

/**
 * Парсит ответ AI в структурированный FinanceAdvice
 * Использует mock-генератор как fallback для графиков
 */
const parseAIResponse = async (aiAnswer: string, answers: FinanceAnswers): Promise<FinanceAdvice> => {
  const totalIncome = answers.incomeSources.reduce((sum, s) => sum + s.amount, 0);
  const totalExpenses = answers.expenseSources.reduce((sum, s) => sum + s.amount, 0);
  
  // Импортируем вспомогательные функции из старого файла
  const { generateBudgetAllocation, generateSavingsProjection } = await import('./financeHelpers');

  return {
    summary: aiAnswer,
    recommendations: [], // AI ответ уже содержит рекомендации в тексте
    budgetAllocation: generateBudgetAllocation(totalIncome, totalExpenses, answers),
    projectedSavings: generateSavingsProjection(totalIncome, totalExpenses),
  };
};

/**
 * Отправляет финансовые данные на бэкенд и получает AI рекомендации
 */
export const generateFinanceAdviceFromAPI = async (answers: FinanceAnswers): Promise<FinanceAdvice> => {
  try {
    const question = formatFinanceQuestion(answers);
    
    const response = await fetch(`${API_URL}/api/v1/advice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return parseAIResponse(data.answer, answers);
    
  } catch (error) {
    console.error('API request failed:', error);
    // Fallback на локальный mock если API недоступен
    const { generateFinanceAdviceLocal } = await import('./financeHelpers');
    return generateFinanceAdviceLocal(answers);
  }
};
