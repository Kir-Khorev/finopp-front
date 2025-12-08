import { useState } from "react";
import { Wallet, Sparkles } from "lucide-react";
import FinanceQuestionnaire from "@/components/finance/FinanceQuestionnaire";
import FinanceResults from "@/components/finance/FinanceResults";
import LoadingState from "@/components/finance/LoadingState";
import { FinanceAnswers, FinanceAdvice } from "@/types/finance";
import { generateFinanceAdviceFromAPI } from "@/services/financeApi";
import { useToast } from "@/hooks/use-toast";

type AppState = 'questionnaire' | 'loading' | 'results';

const Index = () => {
  const { toast } = useToast();
  const [appState, setAppState] = useState<AppState>('questionnaire');
  const [advice, setAdvice] = useState<FinanceAdvice | null>(null);

  const handleQuestionnaireComplete = async (answers: FinanceAnswers) => {
    setAppState('loading');
    
    try {
      const result = await generateFinanceAdviceFromAPI(answers);
      setAdvice(result);
      setAppState('results');
      
      toast({
        title: "Анализ завершён!",
        description: "Ваш персональный финансовый план готов.",
      });
    } catch (error) {
      console.error('Error generating advice:', error);
      setAppState('questionnaire');
      
      toast({
        title: "Ошибка",
        description: "Не удалось получить рекомендации. Попробуйте снова.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setAdvice(null);
    setAppState('questionnaire');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto py-4 px-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl gradient-primary">
              <Wallet className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-foreground">
                Fin<span className="text-primary">AI</span>nce
              </h1>
              <p className="text-xs text-muted-foreground">AI финансовый советник</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-12 px-4">
        {appState === 'questionnaire' && (
          <div className="space-y-8">
            <div className="text-center space-y-4 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Powered by AI
              </div>
              <h2 className="text-4xl font-display font-bold text-foreground">
                Решите свои финансовые проблемы
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Ответьте на 4 простых вопроса, и AI создаст персональный план 
                для достижения ваших финансовых целей
              </p>
            </div>

            <FinanceQuestionnaire onComplete={handleQuestionnaireComplete} />
          </div>
        )}

        {appState === 'loading' && <LoadingState />}

        {appState === 'results' && advice && (
          <FinanceResults advice={advice} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 FinAInce. AI-powered финансовые рекомендации.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
