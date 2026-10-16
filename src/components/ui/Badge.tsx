import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary border-primary/20",
        secondary: "bg-secondary text-secondary-foreground border-transparent",
        accent: "bg-accent/10 text-accent-foreground border-accent/30",
        success: "bg-success/10 text-success border-success/30",
        warning: "bg-warning/10 text-warning-foreground border-warning/30",
        destructive: "bg-destructive/10 text-destructive border-destructive/30",
        outline: "bg-transparent text-foreground border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
