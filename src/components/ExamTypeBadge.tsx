import type { ExamType } from "@/types";
import { cn } from "@/utils/cn";
import { useTranslation } from "@/utils/i18n";

export function ExamTypeBadge({ examType, className }: { examType: ExamType; className?: string }) {
  const { t } = useTranslation();
  const isQudurat = examType === "qudurat";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        isQudurat ? "bg-primary/10 text-primary border-primary/20" : "bg-accent/10 text-accent-foreground border-accent/30",
        className
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", isQudurat ? "bg-primary" : "bg-accent")}
      />
      {t(`enums.examType.${examType}`)}
    </span>
  );
}
