import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FinanceAdvice } from "@/types/finance";
import BudgetChart from "./BudgetChart";
import SavingsChart from "./SavingsChart";
import RecommendationCard from "./RecommendationCard";
import { RefreshCw, Download } from "lucide-react";

interface FinanceResultsProps {
  advice: FinanceAdvice;
  onReset: () => void;
}

const FinanceResults = ({ advice, onReset }: FinanceResultsProps) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4 animate-fade-in">
        <h2 className="text-3xl font-display font-bold text-gradient">
          Ваш персональный финансовый план
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {advice.summary}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetChart data={advice.budgetAllocation} />
        <SavingsChart data={advice.projectedSavings} />
      </div>

      <RecommendationCard recommendations={advice.recommendations} />

      <Card className="glass">
        <CardContent className="py-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="outline"
              onClick={onReset}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Начать заново
            </Button>
            <Button
              className="flex items-center gap-2 gradient-primary text-primary-foreground"
            >
              <Download className="w-4 h-4" />
              Скачать план
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceResults;
