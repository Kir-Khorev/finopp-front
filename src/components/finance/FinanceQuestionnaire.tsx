import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Sparkles, Wallet, CreditCard, AlertCircle, MessageSquare } from "lucide-react";
import IncomeExpenseInput from "./IncomeExpenseInput";
import ProblemSelector from "./ProblemSelector";
import { FinanceAnswers, IncomeSource, ExpenseSource, INCOME_TYPES, EXPENSE_TYPES } from "@/types/finance";

interface FinanceQuestionnaireProps {
  onComplete: (answers: FinanceAnswers) => void;
}

const FinanceQuestionnaire = ({ onComplete }: FinanceQuestionnaireProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<FinanceAnswers>({
    incomeSources: [{ id: crypto.randomUUID(), type: 'salary', amount: 0, currency: 'RUB' }],
    expenseSources: [{ id: crypto.randomUUID(), type: 'general', amount: 0, currency: 'RUB' }],
    problems: [],
    customProblem: '',
    additionalInfo: '',
  });

  const steps = [
    {
      id: 'income',
      title: 'Откуда приходят деньги?',
      description: 'Все источники хороши — зарплата, подработка, помощь. Укажите примерно, сколько получается за месяц',
      icon: Wallet,
    },
    {
      id: 'expenses',
      title: 'Куда они уходят?',
      description: 'Без осуждения! Просто честно: на что тратите больше всего',
      icon: CreditCard,
    },
    {
      id: 'problems',
      title: 'Что давит сильнее всего?',
      description: 'Выберите то, что не даёт спокойно спать. Мы с этим поработаем в первую очередь',
      icon: AlertCircle,
    },
    {
      id: 'additional',
      title: 'Есть что добавить?',
      description: 'Может, что-то важное осталось за кадром? Расскажите своими словами',
      icon: MessageSquare,
    },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;
  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return answers.incomeSources.some(s => s.amount > 0);
      case 1:
        return answers.expenseSources.some(s => s.amount > 0);
      case 2:
        return answers.problems.length > 0 || answers.customProblem.length > 0;
      case 3:
        return true; // Optional step
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (isLastStep) {
      onComplete(answers);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const StepIcon = currentStepData.icon;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Шаг {currentStep + 1} из {steps.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Indicators */}
      <div className="flex justify-center gap-2">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              className={`p-2 rounded-full transition-all duration-300 ${
                index === currentStep 
                  ? 'bg-primary text-primary-foreground scale-110' 
                  : index < currentStep 
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
          );
        })}
      </div>

      {/* Question Card */}
      <Card className="glass animate-fade-up">
        <CardContent className="pt-4 sm:pt-6 space-y-4 sm:space-y-6 px-3 sm:px-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-2 sm:p-3 rounded-full bg-primary/10 text-primary mb-2">
              <StepIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-display font-semibold">{currentStepData.title}</h3>
            <p className="text-sm sm:text-base text-muted-foreground">{currentStepData.description}</p>
          </div>

          {/* Step Content */}
          {currentStep === 0 && (
            <IncomeExpenseInput
              items={answers.incomeSources}
              onChange={(items) => setAnswers(prev => ({ 
                ...prev, 
                incomeSources: items as IncomeSource[] 
              }))}
              types={INCOME_TYPES}
              placeholder="Примерно сколько"
              maxItems={5}
            />
          )}

          {currentStep === 1 && (
            <IncomeExpenseInput
              items={answers.expenseSources}
              onChange={(items) => setAnswers(prev => ({ 
                ...prev, 
                expenseSources: items as ExpenseSource[] 
              }))}
              types={EXPENSE_TYPES}
              placeholder="Примерно сколько"
              maxItems={5}
            />
          )}

          {currentStep === 2 && (
            <ProblemSelector
              selectedProblems={answers.problems}
              customProblem={answers.customProblem}
              onProblemsChange={(problems) => setAnswers(prev => ({ ...prev, problems }))}
              onCustomProblemChange={(customProblem) => setAnswers(prev => ({ ...prev, customProblem }))}
            />
          )}

          {currentStep === 3 && (
            <div className="space-y-2">
              <Label className="text-base">Есть что добавить? (можно пропустить)</Label>
              <Textarea
                value={answers.additionalInfo}
                onChange={(e) => setAnswers(prev => ({ ...prev, additionalInfo: e.target.value }))}
                placeholder="Например: 'У меня двое детей', 'Скоро свадьба', 'Боюсь потерять работу', 'Хочу накопить на машину'..."
                className="min-h-[150px] bg-background/50"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className={`flex gap-2 sm:gap-4 ${currentStep === 0 ? 'justify-center' : 'justify-between'}`}>
        {currentStep > 0 && (
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex-1 flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base px-3 sm:px-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden xs:inline">Назад</span>
          </Button>
        )}
        
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className={`${currentStep === 0 ? 'w-full' : 'flex-1'} flex items-center justify-center gap-1 sm:gap-2 gradient-primary text-primary-foreground text-sm sm:text-base px-3 sm:px-4`}
        >
          {isLastStep ? (
            <>
              <Sparkles className="w-4 h-4" />
              <span className="hidden xs:inline">Найти решение</span>
              <span className="xs:hidden">Решение</span>
            </>
          ) : (
            <>
              <span className="hidden xs:inline">Дальше</span>
              <span className="xs:hidden">→</span>
              <ArrowRight className="w-4 h-4 hidden xs:inline" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FinanceQuestionnaire;
