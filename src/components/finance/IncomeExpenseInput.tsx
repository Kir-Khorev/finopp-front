import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { IncomeSource, ExpenseSource, CURRENCIES } from "@/types/finance";

interface IncomeExpenseInputProps {
  items: (IncomeSource | ExpenseSource)[];
  onChange: (items: (IncomeSource | ExpenseSource)[]) => void;
  types: { value: string; label: string }[];
  placeholder: string;
  maxItems?: number;
}

const IncomeExpenseInput = ({ items, onChange, types, placeholder, maxItems = 5 }: IncomeExpenseInputProps) => {
  const addItem = () => {
    if (items.length >= maxItems) return;
    const newItem = {
      id: crypto.randomUUID(),
      type: types[0].value,
      amount: 0,
      currency: 'RUB',
    };
    onChange([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    onChange(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: 'type' | 'amount' | 'currency', value: string | number) => {
    onChange(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div 
          key={item.id} 
          className="flex items-center gap-2 animate-fade-in"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <Select
            value={item.type}
            onValueChange={(value) => updateItem(item.id, 'type', value)}
          >
            <SelectTrigger className="w-[180px] bg-background/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border z-50">
              {types.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2 flex-1">
            <Input
              type="number"
              value={item.amount || ''}
              onChange={(e) => updateItem(item.id, 'amount', Number(e.target.value))}
              placeholder={placeholder}
              className="bg-background/50"
            />
            <Select
              value={item.currency || 'RUB'}
              onValueChange={(value) => updateItem(item.id, 'currency', value)}
            >
              <SelectTrigger className="w-[80px] bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border z-50">
                {CURRENCIES.map((curr) => (
                  <SelectItem key={curr.value} value={curr.value}>
                    {curr.symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeItem(item.id)}
            disabled={items.length <= 1}
            className="shrink-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}

      {items.length < maxItems && (
        <Button
          type="button"
          variant="outline"
          onClick={addItem}
          className="w-full border-dashed"
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить ещё
        </Button>
      )}
    </div>
  );
};

export default IncomeExpenseInput;
