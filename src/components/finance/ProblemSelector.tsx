import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { PROBLEM_OPTIONS } from "@/types/finance";

interface ProblemSelectorProps {
  selectedProblems: string[];
  customProblem: string;
  onProblemsChange: (problems: string[]) => void;
  onCustomProblemChange: (text: string) => void;
}

const ProblemSelector = ({ 
  selectedProblems, 
  customProblem, 
  onProblemsChange, 
  onCustomProblemChange 
}: ProblemSelectorProps) => {
  const [showCustom, setShowCustom] = useState(customProblem.length > 0);

  const toggleProblem = (value: string) => {
    if (selectedProblems.includes(value)) {
      onProblemsChange(selectedProblems.filter(p => p !== value));
    } else {
      onProblemsChange([...selectedProblems, value]);
    }
  };

  const toggleCustom = () => {
    setShowCustom(!showCustom);
    if (showCustom) {
      onCustomProblemChange('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PROBLEM_OPTIONS.map((option, index) => (
          <div
            key={option.value}
            className="flex items-center space-x-3 p-3 rounded-lg border border-border/50 bg-background/30 hover:bg-background/50 transition-colors cursor-pointer animate-fade-in"
            style={{ animationDelay: `${index * 0.03}s` }}
            onClick={() => toggleProblem(option.value)}
          >
            <Checkbox
              id={option.value}
              checked={selectedProblems.includes(option.value)}
              className="pointer-events-none"
            />
            <span className="flex-1 text-sm">
              {option.label}
            </span>
          </div>
        ))}
      </div>

      <div
        className="flex items-center space-x-3 p-3 rounded-lg border border-dashed border-border/50 bg-background/30 hover:bg-background/50 transition-colors cursor-pointer"
        onClick={toggleCustom}
      >
        <Checkbox
          id="custom"
          checked={showCustom}
          className="pointer-events-none"
        />
        <span className="flex-1 text-sm">
          ✏️ Своё — опишу сам(а)
        </span>
      </div>

      {showCustom && (
        <div className="animate-fade-in">
          <Textarea
            value={customProblem}
            onChange={(e) => onCustomProblemChange(e.target.value)}
            placeholder="Расскажите своими словами, что беспокоит..."
            className="min-h-[100px] bg-background/50"
          />
        </div>
      )}
    </div>
  );
};

export default ProblemSelector;
