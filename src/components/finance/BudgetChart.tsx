import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BudgetItem } from "@/types/finance";

interface BudgetChartProps {
  data: BudgetItem[];
}

const BudgetChart = ({ data }: BudgetChartProps) => {
  return (
    <Card className="glass animate-fade-up">
      <CardHeader>
        <CardTitle className="font-display">Распределение бюджета</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="percentage"
                nameKey="category"
                label={({ category, percentage }) => `${percentage}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as BudgetItem;
                    return (
                      <div className="glass rounded-lg p-3 shadow-lg">
                        <p className="font-medium">{item.category}</p>
                        <p className="text-muted-foreground">
                          {item.percentage}% — ₽{item.amount.toLocaleString()}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                verticalAlign="bottom"
                formatter={(value) => (
                  <span className="text-foreground text-sm">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetChart;
