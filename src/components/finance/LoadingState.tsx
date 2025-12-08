import { Loader2, Brain, ChartBar, Lightbulb } from "lucide-react";

const LoadingState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-8">
      <div className="relative">
        <div className="absolute inset-0 animate-ping">
          <Brain className="w-16 h-16 text-primary/30" />
        </div>
        <Brain className="w-16 h-16 text-primary animate-pulse-soft" />
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-xl font-display font-semibold text-foreground">
          AI анализирует ваши данные
        </h3>
        <p className="text-muted-foreground">Создаём персональный финансовый план...</p>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex flex-col items-center gap-2 animate-fade-up" style={{ animationDelay: '0s' }}>
          <div className="p-3 rounded-full bg-primary/10">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <span className="text-sm text-muted-foreground">Анализ</span>
        </div>
        <div className="flex flex-col items-center gap-2 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <div className="p-3 rounded-full bg-accent/10">
            <ChartBar className="w-6 h-6 text-accent" />
          </div>
          <span className="text-sm text-muted-foreground">Расчёты</span>
        </div>
        <div className="flex flex-col items-center gap-2 animate-fade-up" style={{ animationDelay: '0.6s' }}>
          <div className="p-3 rounded-full bg-primary/10">
            <Lightbulb className="w-6 h-6 text-primary" />
          </div>
          <span className="text-sm text-muted-foreground">Советы</span>
        </div>
      </div>

      <Loader2 className="w-6 h-6 text-primary animate-spin" />
    </div>
  );
};

export default LoadingState;
