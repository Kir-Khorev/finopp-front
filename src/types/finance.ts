export interface IncomeSource {
  id: string;
  type: string;
  amount: number;
}

export interface ExpenseSource {
  id: string;
  type: string;
  amount: number;
}

export interface FinanceAnswers {
  incomeSources: IncomeSource[];
  expenseSources: ExpenseSource[];
  problems: string[];
  customProblem: string;
  additionalInfo: string;
}

export interface FinanceAdvice {
  summary: string;
  recommendations: Recommendation[];
  budgetAllocation: BudgetItem[];
  projectedSavings: SavingsProjection[];
}

export interface Recommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  impact: string;
}

export interface BudgetItem {
  category: string;
  percentage: number;
  amount: number;
  color: string;
}

export interface SavingsProjection {
  month: string;
  projected: number;
  optimal: number;
}

export const INCOME_TYPES = [
  { value: 'salary', label: '💼 Зарплата' },
  { value: 'pension', label: '👴 Пенсия' },
  { value: 'investments', label: '📈 Инвестиции' },
  { value: 'bonus', label: '🎁 Премии' },
  { value: 'children_help', label: '👨‍👩‍👧 Помощь детей' },
  { value: 'rental', label: '🏠 Аренда' },
  { value: 'business', label: '🏢 Бизнес' },
  { value: 'other', label: '📦 Другое' },
];

export const EXPENSE_TYPES = [
  { value: 'general', label: '📊 Общие расходы' },
  { value: 'credit', label: '💳 Кредиты' },
  { value: 'debt', label: '📝 Долги' },
  { value: 'utilities', label: '💡 Коммунальные услуги' },
  { value: 'food', label: '🍔 Питание' },
  { value: 'transport', label: '🚗 Транспорт' },
  { value: 'health', label: '🏥 Здоровье' },
  { value: 'other', label: '📦 Другое' },
];

export const PROBLEM_OPTIONS = [
  { value: 'debt', label: '💳 Не могу выбраться из долгов' },
  { value: 'savings', label: '💰 Не получается копить' },
  { value: 'budgeting', label: '📊 Не хватает до зарплаты' },
  { value: 'investing', label: '📈 Не знаю как инвестировать' },
  { value: 'retirement', label: '🏖️ Беспокоюсь о пенсии' },
  { value: 'emergency', label: '🛡️ Нет финансовой подушки' },
  { value: 'income', label: '📉 Низкий доход' },
  { value: 'expenses', label: '💸 Слишком большие расходы' },
];
