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
        <CardTitle className="font-display">Куда уходят ваши деньги</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Реальное распределение дохода по вашим тратам
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={95}
                paddingAngle={2}
                dataKey="percentage"
                nameKey="category"
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
                        <p className="font-medium text-sm">{item.category}</p>
                        <p className="text-lg font-semibold text-foreground">
                          ₽{item.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.percentage}% от дохода
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
