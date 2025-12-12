export interface IncomeSource {
  id: string;
  type: string;
  amount: number;
  currency: string;
}

export interface ExpenseSource {
  id: string;
  type: string;
  amount: number;
  currency: string;
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
  { value: 'salary', label: '💼 Зарплата по найму' },
  { value: 'pension', label: '👴 Пенсия' },
  { value: 'bonus', label: '🎁 Премии, бонусы' },
  { value: 'business', label: '🏢 Свой бизнес, фриланс' },
  { value: 'rental', label: '🏠 Сдаю жильё' },
  { value: 'children_help', label: '👨‍👩‍👧 Помощь от близких' },
  { value: 'investments', label: '📈 Доход от вкладов, акций' },
  { value: 'other', label: '📦 Другое' },
];

export const EXPENSE_TYPES = [
  { value: 'food', label: '🍔 Еда, продукты' },
  { value: 'utilities', label: '💡 Коммуналка, связь' },
  { value: 'credit', label: '💳 Кредиты, рассрочки' },
  { value: 'debt', label: '📝 Долги (знакомым, МФО)' },
  { value: 'transport', label: '🚗 Проезд, бензин' },
  { value: 'health', label: '🏥 Лекарства, врачи' },
  { value: 'general', label: '📊 Бытовые траты' },
  { value: 'other', label: '📦 Другое' },
];

export const PROBLEM_OPTIONS = [
  { value: 'debt', label: '💳 Долги душат, не знаю как выбраться' },
  { value: 'budgeting', label: '📅 До зарплаты не дотягиваю' },
  { value: 'expenses', label: '💸 Деньги утекают, не понимаю куда' },
  { value: 'savings', label: '💰 Хочу откладывать, но не выходит' },
  { value: 'emergency', label: '😰 Боюсь, что не справлюсь если что-то случится' },
  { value: 'income', label: '📉 Денег катастрофически мало' },
  { value: 'retirement', label: '👴 Страшно думать про будущее' },
  { value: 'investing', label: '📈 Хочу приумножить, но не знаю с чего начать' },
];

export const CURRENCIES = [
  { value: 'RUB', label: '₽', symbol: '₽' },
  { value: 'USD', label: '$', symbol: '$' },
  { value: 'EUR', label: '€', symbol: '€' },
  { value: 'AZN', label: '₼', symbol: '₼' },
  { value: 'KZT', label: '₸', symbol: '₸' },
];
