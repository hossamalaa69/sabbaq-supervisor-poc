import * as React from "react";
import { cn } from "@/utils/cn";

interface TabsProps {
  tabs: { value: string; label: string; icon?: React.ReactNode; count?: number }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Tabs({ tabs, value, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex items-center gap-1 overflow-x-auto rounded-xl bg-muted p-1", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
            value === tab.value
              ? "bg-card text-foreground shadow-card"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.icon}
          {tab.label}
          {typeof tab.count === "number" && (
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-xs",
                value === tab.value ? "bg-primary/10 text-primary" : "bg-background"
              )}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
