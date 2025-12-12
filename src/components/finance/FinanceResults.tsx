import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FinanceAdvice } from "@/types/finance";
import BudgetChart from "./BudgetChart";
import SavingsChart from "./SavingsChart";
import { RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface FinanceResultsProps {
  advice: FinanceAdvice;
  onReset: () => void;
}

const FinanceResults = ({ advice, onReset }: FinanceResultsProps) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4 animate-fade-in">
        <h2 className="text-3xl font-display font-bold text-gradient">
          Вот как мы можем выправить ситуацию
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Я посмотрел вашу ситуацию. Да, непросто, но выход точно есть. Вот что можно сделать:
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetChart data={advice.budgetAllocation} />
        <SavingsChart data={advice.projectedSavings} />
      </div>

      <Card className="glass animate-fade-up" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <CardTitle className="font-display">Что делать дальше</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-4 text-foreground" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-xl font-semibold mb-3 text-foreground" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-lg font-medium mb-2 text-foreground" {...props} />,
                p: ({node, ...props}) => <p className="mb-4 text-muted-foreground leading-relaxed" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
                li: ({node, ...props}) => <li className="text-muted-foreground" {...props} />,
                strong: ({node, ...props}) => <strong className="font-semibold text-foreground" {...props} />,
                em: ({node, ...props}) => <em className="italic" {...props} />,
              }}
            >
              {advice.summary}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardContent className="py-6">
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={onReset}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Пересчитать
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceResults;
