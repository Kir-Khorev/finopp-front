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
    incomeSources: [{ id: crypto.randomUUID(), type: 'salary', amount: 0 }],
    expenseSources: [{ id: crypto.randomUUID(), type: 'general', amount: 0 }],
    problems: [],
    customProblem: '',
    additionalInfo: '',
  });

  const steps = [
    {
      id: 'income',
      title: 'Ваши источники дохода',
      description: 'Укажите все источники дохода и их суммы',
      icon: Wallet,
    },
    {
      id: 'expenses',
      title: 'Ваши расходы',
      description: 'Укажите основные статьи расходов',
      icon: CreditCard,
    },
    {
      id: 'problems',
      title: 'Что вас беспокоит?',
      description: 'Выберите проблемы, которые хотите решить',
      icon: AlertCircle,
    },
    {
      id: 'additional',
      title: 'Что-то ещё?',
      description: 'Поделитесь дополнительной информацией',
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
        <CardContent className="pt-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-2">
              <StepIcon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-display font-semibold">{currentStepData.title}</h3>
            <p className="text-muted-foreground">{currentStepData.description}</p>
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
              placeholder="Сумма"
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
              placeholder="Сумма"
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
              <Label className="text-base">Дополнительная информация (необязательно)</Label>
              <Textarea
                value={answers.additionalInfo}
                onChange={(e) => setAnswers(prev => ({ ...prev, additionalInfo: e.target.value }))}
                placeholder="Расскажите о своей ситуации, целях или любых других деталях, которые могут помочь дать лучший совет..."
                className="min-h-[150px] bg-background/50"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between gap-4">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="flex items-center gap-2 gradient-primary text-primary-foreground"
        >
          {isLastStep ? (
            <>
              <Sparkles className="w-4 h-4" />
              Получить советы
            </>
          ) : (
            <>
              Далее
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default FinanceQuestionnaire;
