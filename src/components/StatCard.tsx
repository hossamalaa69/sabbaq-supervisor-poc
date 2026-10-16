import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/utils/cn";

export function StatCard({
  label,
  value,
  icon,
  trend,
  trendLabel,
  onClick,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  trend?: number;
  trendLabel?: string;
  onClick?: () => void;
}) {
  return (
    <Card
      className={cn(
        "transition-shadow",
        onClick && "cursor-pointer hover:shadow-popover"
      )}
      onClick={onClick}
    >
      <CardContent className="flex items-start justify-between pt-5">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-extrabold">{value}</p>
          {typeof trend === "number" && (
            <p className={cn("mt-1 text-xs font-semibold", trend >= 0 ? "text-success" : "text-destructive")}>
              {trend >= 0 ? "+" : ""}
              {trend}% {trendLabel}
            </p>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
