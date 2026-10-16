import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";
import { useTranslation } from "@/utils/i18n";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ open, onClose, children, className }: DialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-thin rounded-xl border border-border bg-card p-6 shadow-popover animate-fade-in",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({
  title,
  description,
  onClose,
}: {
  title: string;
  description?: string;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-lg font-bold">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      <button
        onClick={onClose}
        className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-label={t("common.close")}
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
