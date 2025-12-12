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
      const currSymbol = s.currency === 'RUB' ? '₽' : s.currency === 'USD' ? '$' : s.currency === 'EUR' ? '€' : s.currency === 'AZN' ? '₼' : s.currency === 'KZT' ? '₸' : s.currency;
      return `${type?.label || s.type}: ${s.amount} ${currSymbol}`;
    });

  const expenseParts = answers.expenseSources
    .filter(s => s.amount > 0)
    .map(s => {
      const type = EXPENSE_TYPES.find(t => t.value === s.type);
      const currSymbol = s.currency === 'RUB' ? '₽' : s.currency === 'USD' ? '$' : s.currency === 'EUR' ? '€' : s.currency === 'AZN' ? '₼' : s.currency === 'KZT' ? '₸' : s.currency;
      return `${type?.label || s.type}: ${s.amount} ${currSymbol}`;
    });

  const problemLabels = answers.problems
    .map(p => PROBLEM_OPTIONS.find(o => o.value === p)?.label)
    .filter(Boolean);

  const balance = totalIncome - totalExpenses;

  let question = `Ты — опытный финансовый советник, который понимает проблемы людей с небольшим доходом. Говори просто, по-человечески, с заботой и без осуждения. Помоги этому человеку найти выход.\n\n`;

  question += `**Откуда приходят деньги:**\n`;
  question += incomeParts.join('\n') + '\n\n';

  question += `**Куда уходят:**\n`;
  question += expenseParts.join('\n') + '\n\n';

  // Эмпатичное реагирование на баланс
  if (balance < 0) {
    question += `**⚠️ ВАЖНО:** Человек сейчас в минусе (доход ${totalIncome}, расход ${totalExpenses}, дефицит ${Math.abs(balance)}). Ему ОЧЕНЬ тяжело. \n`;
    question += `**Начни ответ с искреннего сочувствия и поддержки.** Признай что ситуация сложная, скажи что понимаешь как это выматывает, когда денег не хватает даже на базовое. Покажи что ты на его стороне. Потом переходи к конкретным шагам выхода.\n\n`;
  } else if (balance > 0 && balance < totalIncome * 0.15) {
    question += `**💪 Важный момент:** У человека небольшой плюс (остаётся ${balance} из ${totalIncome}). Это РЕАЛЬНО здорово! Многие даже этого не имеют.\n`;
    question += `**Обязательно похвали** в начале ответа. Скажи что он молодец, что смог так распределить деньги. Это его достижение, даже если сумма небольшая. Поддержи и мотивируй продолжать.\n\n`;
  } else if (balance >= totalIncome * 0.15) {
    question += `**🎉 Отличная новость:** У человека хороший остаток (${balance} из ${totalIncome})! Это достойный результат.\n`;
    question += `**Похвали и вдохнови** в начале. Он справляется лучше чем многие. Покажи что у него уже есть база для роста.\n\n`;
  }

  if (problemLabels.length > 0) {
    question += `**Что давит больше всего:**\n${problemLabels.join('\n')}\n\n`;
  }

  if (answers.customProblem) {
    question += `**В своих словах:**\n${answers.customProblem}\n\n`;
  }

  if (answers.additionalInfo) {
    question += `**Дополнительно:**\n${answers.additionalInfo}\n\n`;
  }

  question += `---\n\n`;
  question += `Твоя задача:\n`;
  question += `1. **Начни с поддержки.** Признай, что ситуация сложная, но выход есть.\n`;
  question += `2. **Анализ без цифр и терминов.** Объясни простым языком, что происходит и почему денег не хватает.\n`;
  question += `3. **Конкретные шаги.** Дай 3-5 реальных действий, которые можно сделать прямо сейчас. Не "откройте ИИС", а "вот как можно сэкономить 5000₽ в месяц".\n`;
  question += `4. **Говори "вы", "вам", "можете".** Как друг, который искренне хочет помочь.\n`;
  question += `5. **Без финансового жаргона.** Вместо "дефицит бюджета" — "денег не хватает". Вместо "оптимизация расходов" — "на чём можно сэкономить".\n`;
  question += `6. **Надежда.** Покажи, что даже с таким доходом можно улучшить ситуацию.\n\n`;
  question += `Формат ответа: обычный текст с разделением на абзацы. Используй жирный текст (**важное**) и списки где нужно.`;

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
  const { generateBudgetAllocation, generateSavingsProjection } = await import('@/utils/financeHelpers');

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
    const { generateFinanceAdviceLocal } = await import('@/utils/financeHelpers');
    return generateFinanceAdviceLocal(answers);
  }
};
