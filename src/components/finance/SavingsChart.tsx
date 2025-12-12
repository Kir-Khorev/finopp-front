import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SavingsProjection } from "@/types/finance";

interface SavingsChartProps {
  data: SavingsProjection[];
}

const SavingsChart = ({ data }: SavingsChartProps) => {
  // Определяем цвет линии: зеленый если в плюсе, красный если в минусе
  const finalValue = data[data.length - 1]?.projected || 0;
  const isPositive = finalValue >= 0;
  const lineColor = isPositive ? '#22c55e' : '#ef4444'; // green-500 / red-500

  return (
    <Card className="glass animate-fade-up" style={{ animationDelay: '0.1s' }}>
      <CardHeader>
        <CardTitle className="font-display">
          Прогноз на год
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          При текущих доходах и расходах — вот что будет через 12 месяцев
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="dynamicGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={lineColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickFormatter={(value) => {
                  const abs = Math.abs(value);
                  const sign = value < 0 ? '-' : '';
                  
                  if (abs >= 1000000) {
                    return `${sign}₽${(abs / 1000000).toFixed(1)}M`;
                  }
                  if (abs >= 1000) {
                    return `${sign}₽${(abs / 1000).toFixed(0)}k`;
                  }
                  return `₽${value}`;
                }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const value = Number(payload[0].value);
                    return (
                      <div className="glass rounded-lg p-3 shadow-lg">
                        <p className="font-medium mb-1">{label}</p>
                        <p className="text-sm" style={{ color: lineColor }}>
                          {isPositive ? 'Накопления' : 'Долг'}: ₽{Math.abs(value).toLocaleString()}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="projected"
                stroke={lineColor}
                strokeWidth={2}
                fill="url(#dynamicGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SavingsChart;
