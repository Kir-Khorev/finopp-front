import { FinanceAnswers, FinanceAdvice, BudgetItem, Recommendation, SavingsProjection, INCOME_TYPES, EXPENSE_TYPES, PROBLEM_OPTIONS } from "@/types/finance";

/**
 * Конвертирует сумму в любой валюте в рубли (примерные курсы)
 */
const convertToRUB = (amount: number, currency: string): number => {
  if (currency === 'RUB') return amount;

  const rates: Record<string, number> = {
    'USD': 95.0,
    'EUR': 105.0,
    'KZT': 0.20,
    'AZN': 56.0,
  };

  return amount * (rates[currency] || 1);
};

// Local mock generator - используется как fallback если API недоступен
export const generateFinanceAdviceLocal = async (answers: FinanceAnswers): Promise<FinanceAdvice> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2500));

  // Конвертируем все суммы в рубли
  const totalIncome = answers.incomeSources.reduce(
    (sum, s) => sum + convertToRUB(s.amount, s.currency),
    0
  );
  const totalExpenses = answers.expenseSources.reduce(
    (sum, s) => sum + convertToRUB(s.amount, s.currency),
    0
  );

  // Создаём копию answers с конвертированными суммами
  const answersInRUB: FinanceAnswers = {
    ...answers,
    incomeSources: answers.incomeSources.map(s => ({
      ...s,
      amount: convertToRUB(s.amount, s.currency),
      currency: 'RUB',
    })),
    expenseSources: answers.expenseSources.map(s => ({
      ...s,
      amount: convertToRUB(s.amount, s.currency),
      currency: 'RUB',
    })),
  };

  const budgetAllocation = generateBudgetAllocation(totalIncome, totalExpenses, answersInRUB);
  const recommendations = generateRecommendations(answersInRUB, totalIncome, totalExpenses);
  const projectedSavings = generateSavingsProjection(totalIncome, totalExpenses);

  return {
    summary: generateSummary(answersInRUB, totalIncome, totalExpenses),
    recommendations,
    budgetAllocation,
    projectedSavings,
  };
};

const generateSummary = (answers: FinanceAnswers, totalIncome: number, totalExpenses: number): string => {
  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0;

  const incomeTypes = answers.incomeSources
    .filter(s => s.amount > 0)
    .map(s => INCOME_TYPES.find(t => t.value === s.type)?.label || s.type)
    .join(', ');

  const summaryParts: string[] = [];

  summaryParts.push(`При общем доходе ₽${totalIncome.toLocaleString()} (${incomeTypes}) и расходах ₽${totalExpenses.toLocaleString()}`);

  if (balance > 0) {
    summaryParts.push(`у вас остаётся ₽${balance.toLocaleString()} (${savingsRate}% от дохода).`);
  } else if (balance < 0) {
    summaryParts.push(`вы тратите на ₽${Math.abs(balance).toLocaleString()} больше, чем зарабатываете. Это критическая ситуация!`);
  } else {
    summaryParts.push(`вы тратите всё что зарабатываете. Нужно найти возможности для экономии.`);
  }

  if (answers.problems.length > 0) {
    const problemLabels = answers.problems
      .map(p => PROBLEM_OPTIONS.find(o => o.value === p)?.label.replace(/[^\w\sа-яА-Я]/g, '').trim())
      .filter(Boolean);
    summaryParts.push(`Основные проблемы: ${problemLabels.join(', ')}.`);
  }

  if (answers.customProblem) {
    summaryParts.push(`Также учтена ваша ситуация: "${answers.customProblem.slice(0, 100)}${answers.customProblem.length > 100 ? '...' : ''}"`);
  }

  return summaryParts.join(' ');
};

export const generateBudgetAllocation = (totalIncome: number, totalExpenses: number, answers: FinanceAnswers): BudgetItem[] => {
  const balance = totalIncome - totalExpenses;

  // Группируем расходы пользователя по категориям
  const categoryMap: { [key: string]: { label: string; amount: number; color: string } } = {};

  const categoryColors: { [key: string]: string } = {
    food: 'hsl(220, 70%, 50%)',      // синий
    utilities: 'hsl(280, 60%, 60%)', // фиолетовый
    credit: 'hsl(0, 70%, 50%)',      // красный
    debt: 'hsl(0, 85%, 45%)',        // тёмно-красный
    transport: 'hsl(200, 70%, 50%)', // голубой
    health: 'hsl(340, 60%, 55%)',    // розовый
    general: 'hsl(160, 50%, 50%)',   // бирюзовый
    other: 'hsl(40, 70%, 55%)',      // жёлтый
  };

  const categoryLabels: { [key: string]: string } = {
    food: 'Еда',
    utilities: 'Коммуналка',
    credit: 'Кредиты',
    debt: 'Долги',
    transport: 'Транспорт',
    health: 'Здоровье',
    general: 'Бытовое',
    other: 'Другое',
  };

  // Собираем реальные расходы
  answers.expenseSources.forEach(expense => {
    if (expense.amount > 0) {
      const key = expense.type;
      if (!categoryMap[key]) {
        categoryMap[key] = {
          label: categoryLabels[key] || 'Другое',
          amount: 0,
          color: categoryColors[key] || 'hsl(160, 50%, 50%)',
        };
      }
      categoryMap[key].amount += expense.amount;
    }
  });

  // Добавляем остаток если есть
  if (balance > 0) {
    categoryMap['savings'] = {
      label: 'Остаётся',
      amount: balance,
      color: 'hsl(142, 70%, 45%)', // зелёный
    };
  }

  // Преобразуем в массив для графика
  const items: BudgetItem[] = Object.values(categoryMap).map(cat => ({
    category: cat.label,
    amount: Math.round(cat.amount),
    percentage: Math.round((cat.amount / totalIncome) * 100),
    color: cat.color,
  }));

  // Сортируем по убыванию
  return items.sort((a, b) => b.amount - a.amount);
};

const generateRecommendations = (answers: FinanceAnswers, totalIncome: number, totalExpenses: number): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  const balance = totalIncome - totalExpenses;

  // Critical: deficit
  if (balance < 0) {
    recommendations.push({
      title: '🚨 Срочно сократите расходы',
      description: `Вы тратите на ₽${Math.abs(balance).toLocaleString()} больше дохода. Проанализируйте все расходы и найдите что можно сократить.`,
      priority: 'high',
      impact: `Экономия ₽${Math.abs(balance).toLocaleString()}/мес`,
    });
  }

  // Debt problems
  if (answers.problems.includes('debt')) {
    recommendations.push({
      title: 'Метод снежного кома для долгов',
      description: 'Выплачивайте минимум по всем долгам, а остаток направляйте на самый маленький. Это даст быстрые победы и мотивацию.',
      priority: 'high',
      impact: 'Психологический эффект + снижение долгов',
    });
  }

  // No emergency fund
  if (answers.problems.includes('emergency')) {
    const emergencyTarget = totalExpenses * 3;
    recommendations.push({
      title: 'Создайте резервный фонд',
      description: `Накопите 3-6 месячных расходов (₽${emergencyTarget.toLocaleString()} — ₽${(emergencyTarget * 2).toLocaleString()}) на отдельном счёте.`,
      priority: 'high',
      impact: 'Финансовая безопасность',
    });
  }

  // Savings problem
  if (answers.problems.includes('savings') && balance > 0) {
    recommendations.push({
      title: 'Автоматизируйте сбережения',
      description: 'Настройте автоперевод 10-20% от дохода на сберегательный счёт в день зарплаты. Так вы не успеете потратить эти деньги.',
      priority: 'high',
      impact: `+₽${Math.round(totalIncome * 0.15).toLocaleString()}/мес`,
    });
  }

  // Budgeting problem
  if (answers.problems.includes('budgeting')) {
    recommendations.push({
      title: 'Ведите учёт расходов',
      description: 'Записывайте все траты минимум 1 месяц. Используйте приложение или простую таблицу. Вы удивитесь, куда уходят деньги.',
      priority: 'medium',
      impact: 'Понимание структуры расходов',
    });
  }

  // Investment question
  if (answers.problems.includes('investing')) {
    recommendations.push({
      title: 'Начните с простого инвестирования',
      description: 'Откройте ИИС для налогового вычета. Начните с облигаций или индексных фондов (ETF) — минимальный риск и простота.',
      priority: 'medium',
      impact: 'До 52 000₽ возврата НДФЛ/год',
    });
  }

  // Always recommend tracking
  if (!answers.problems.includes('budgeting')) {
    recommendations.push({
      title: 'Отслеживайте прогресс',
      description: 'Раз в месяц анализируйте доходы/расходы и корректируйте план. Финансовое планирование — это процесс, а не разовое действие.',
      priority: 'low',
      impact: 'Долгосрочный успех',
    });
  }

  return recommendations.slice(0, 5);
};

export const generateSavingsProjection = (totalIncome: number, totalExpenses: number): SavingsProjection[] => {
  const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
  const monthlyBalance = totalIncome - totalExpenses;

  let accumulated = 0;

  return months.map((month) => {
    accumulated += monthlyBalance;
    return {
      month,
      projected: Math.round(accumulated),
      optimal: 0, // Не используется больше
    };
  });
};
