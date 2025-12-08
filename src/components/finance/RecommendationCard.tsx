import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Recommendation } from "@/types/finance";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

interface RecommendationCardProps {
  recommendations: Recommendation[];
}

const priorityConfig = {
  high: {
    icon: AlertTriangle,
    variant: 'destructive' as const,
    label: 'Важно',
  },
  medium: {
    icon: Info,
    variant: 'default' as const,
    label: 'Средний',
  },
  low: {
    icon: CheckCircle2,
    variant: 'secondary' as const,
    label: 'Низкий',
  },
};

const RecommendationCard = ({ recommendations }: RecommendationCardProps) => {
  return (
    <Card className="glass animate-fade-up" style={{ animationDelay: '0.2s' }}>
      <CardHeader>
        <CardTitle className="font-display">Рекомендации</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec, index) => {
          const config = priorityConfig[rec.priority];
          const Icon = config.icon;
          
          return (
            <div
              key={index}
              className="p-4 rounded-lg bg-background/50 border border-border/50 space-y-2 animate-slide-in-right"
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-primary" />
                  <h4 className="font-medium">{rec.title}</h4>
                </div>
                <Badge variant={config.variant} className="text-xs">
                  {config.label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{rec.description}</p>
              <p className="text-sm font-medium text-primary">{rec.impact}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
