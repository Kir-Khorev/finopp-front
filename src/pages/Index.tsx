import React, { useState } from "react";
import { Wallet, Sparkles, UserCircle2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import FinanceQuestionnaire from "@/components/finance/FinanceQuestionnaire";
import FinanceResults from "@/components/finance/FinanceResults";
import LoadingState from "@/components/finance/LoadingState";
import AuthDialog from "@/components/auth/AuthDialog";
import { useAuth } from "@/contexts/AuthContext";
import { FinanceAnswers, FinanceAdvice } from "@/types/finance";
import { generateFinanceAdviceFromAPI } from "@/services/financeApi";
import { useToast } from "@/hooks/use-toast";

type AppState = 'questionnaire' | 'loading' | 'results';

const Index = () => {
  const { toast } = useToast();
  const { user, isAuthenticated, logout } = useAuth();
  const [appState, setAppState] = useState<AppState>('questionnaire');
  const [advice, setAdvice] = useState<FinanceAdvice | null>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast({
      title: "Вы вышли из системы",
      description: "Возвращайтесь скорее!",
    });
  };

  const handleQuestionnaireComplete = async (answers: FinanceAnswers) => {
    setAppState('loading');
    
    try {
      const result = await generateFinanceAdviceFromAPI(answers);
      setAdvice(result);
      setAppState('results');
      
      toast({
        title: "Готово!",
        description: "Посмотрел вашу ситуацию. Вот что можно сделать.",
      });
    } catch (error) {
      console.error('Error generating advice:', error);
      setAppState('questionnaire');
      
      toast({
        title: "Упс, что-то пошло не так",
        description: "Попробуйте ещё раз через минутку.",
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl gradient-primary">
                <Wallet className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-foreground">
                  Fin<span className="text-primary">AI</span>nce
                </h1>
                <p className="text-xs text-muted-foreground">Помогаем выйти из долгов</p>
              </div>
            </div>
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <UserCircle2 className="w-4 h-4" />
                    <span className="hidden sm:inline">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Выйти
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => setAuthDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <UserCircle2 className="w-4 h-4" />
                <span className="hidden sm:inline">Войти</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Auth Dialog */}
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />

      {/* Main Content */}
      <main className="container mx-auto py-12 px-4">
        {appState === 'questionnaire' && (
          <div className="space-y-8">
            <div className="text-center space-y-4 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Понимаем вашу ситуацию
              </div>
              <h2 className="text-4xl font-display font-bold text-foreground">
                Давайте вместе выправим ситуацию
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Я знаю, что сейчас может быть непросто. Расскажите мне честно о своих доходах и тратах — 
                вместе найдём выход и составим реальный план действий
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
          <p>© 2025 FinAInce. Мы верим, что каждый заслуживает финансовую стабильность.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
