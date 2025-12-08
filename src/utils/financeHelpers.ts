import { FinanceAnswers, FinanceAdvice, BudgetItem, Recommendation, SavingsProjection, INCOME_TYPES, EXPENSE_TYPES, PROBLEM_OPTIONS } from "@/types/finance";

// Local mock generator - используется как fallback если API недоступен
export const generateFinanceAdviceLocal = async (answers: FinanceAnswers): Promise<FinanceAdvice> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2500));

  const totalIncome = answers.incomeSources.reduce((sum, s) => sum + s.amount, 0);
  const totalExpenses = answers.expenseSources.reduce((sum, s) => sum + s.amount, 0);

  const budgetAllocation = generateBudgetAllocation(totalIncome, totalExpenses, answers);
  const recommendations = generateRecommendations(answers, totalIncome, totalExpenses);
  const projectedSavings = generateSavingsProjection(totalIncome, totalExpenses);

  return {
    summary: generateSummary(answers, totalIncome, totalExpenses),
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

  let summaryParts: string[] = [];

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
  const hasDebt = answers.problems.includes('debt') || answers.expenseSources.some(e => e.type === 'credit' || e.type === 'debt');

  if (balance < 0) {
    // Deficit budget
    return [
      { category: 'Необходимые расходы', percentage: 70, amount: Math.round(totalIncome * 0.7), color: 'hsl(var(--chart-3))' },
      { category: 'Сокращаемые расходы', percentage: 20, amount: Math.round(totalIncome * 0.2), color: 'hsl(var(--chart-4))' },
      { category: 'Долги (минимум)', percentage: 10, amount: Math.round(totalIncome * 0.1), color: 'hsl(var(--destructive))' },
    ];
  }

  if (hasDebt) {
    return [
      { category: 'Погашение долгов', percentage: 25, amount: Math.round(totalIncome * 0.25), color: 'hsl(var(--destructive))' },
      { category: 'Необходимые расходы', percentage: 50, amount: Math.round(totalIncome * 0.5), color: 'hsl(var(--chart-3))' },
      { category: 'Резервный фонд', percentage: 10, amount: Math.round(totalIncome * 0.1), color: 'hsl(var(--primary))' },
      { category: 'Личные расходы', percentage: 15, amount: Math.round(totalIncome * 0.15), color: 'hsl(var(--chart-4))' },
    ];
  }

  // Standard 50/30/20 budget
  return [
    { category: 'Необходимые расходы', percentage: 50, amount: Math.round(totalIncome * 0.5), color: 'hsl(var(--chart-3))' },
    { category: 'Желания', percentage: 30, amount: Math.round(totalIncome * 0.3), color: 'hsl(var(--chart-4))' },
    { category: 'Сбережения и инвестиции', percentage: 20, amount: Math.round(totalIncome * 0.2), color: 'hsl(var(--primary))' },
  ];
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
  const balance = Math.max(0, totalIncome - totalExpenses);
  const savingsRate = totalIncome > 0 ? balance / totalIncome : 0;
  const optimalRate = Math.max(savingsRate, 0.2); // At least 20%

  let projected = 0;
  let optimal = 0;

  return months.map((month) => {
    projected += totalIncome * savingsRate;
    optimal += totalIncome * optimalRate;
    return {
      month,
      projected: Math.round(projected),
      optimal: Math.round(optimal),
    };
  });
};
