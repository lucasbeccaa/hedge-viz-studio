import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditableInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
}

export const EditableInput = ({ label, value, onChange, prefix, suffix }: EditableInputProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm text-muted-foreground font-medium">{label}</Label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {prefix}
          </span>
        )}
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className={`bg-surface border-border text-foreground font-semibold ${
            prefix ? "pl-8" : ""
          } ${suffix ? "pr-12" : ""}`}
          step="0.01"
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};
