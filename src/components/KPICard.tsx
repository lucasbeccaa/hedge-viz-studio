import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
}

export const KPICard = ({ title, value, subtitle, icon: Icon, trend }: KPICardProps) => {
  const getTrendColor = () => {
    if (trend === "up") return "text-green-400";
    if (trend === "down") return "text-red-400";
    return "text-muted-foreground";
  };

  return (
    <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-elevated transition-all duration-300 p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className={`text-sm font-medium ${getTrendColor()}`}>{subtitle}</p>
          )}
        </div>
        <div className="bg-primary/10 p-3 rounded-lg">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </Card>
  );
};
