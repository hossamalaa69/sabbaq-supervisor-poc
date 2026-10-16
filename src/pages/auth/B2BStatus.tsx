import { useNavigate } from "react-router-dom";
import { Check, Clock, AlertTriangle, XCircle, FileSearch } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store";
import type { B2BStatus } from "@/types";
import { cn } from "@/utils/cn";
import { useTranslation } from "@/utils/i18n";

const timelineOrder: { status: B2BStatus; labelKey: string; date: string }[] = [
  { status: "pending", labelKey: "auth.b2bStatus.timeline.requestSubmitted", date: "1 Oct 2026" },
  { status: "under_review", labelKey: "auth.b2bStatus.timeline.underReview", date: "3 Oct 2026" },
  { status: "needs_info", labelKey: "auth.b2bStatus.timeline.needsInfoRequested", date: "—" },
  { status: "approved", labelKey: "auth.b2bStatus.timeline.approved", date: "—" },
];

const statusIcons: Record<B2BStatus, { variant: "warning" | "accent" | "success" | "destructive"; icon: typeof Clock }> = {
  pending: { variant: "warning", icon: Clock },
  under_review: { variant: "accent", icon: FileSearch },
  approved: { variant: "success", icon: Check },
  rejected: { variant: "destructive", icon: XCircle },
  needs_info: { variant: "warning", icon: AlertTriangle },
};

export default function B2BStatusPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const teacher = useAuthStore((s) => s.teacher);
  const status = teacher.b2bStatus;
  const config = statusIcons[status];
  const statusLabel = t(`enums.b2bStatus.${status}`);
  const Icon = config.icon;

  const currentIndex =
    status === "needs_info"
      ? 2
      : status === "approved" || status === "rejected"
        ? 3
        : status === "under_review"
          ? 1
          : 0;

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-extrabold">{t("auth.b2bStatus.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("auth.b2bStatus.subtitle")}</p>
      </div>

      <Card className="mb-6">
        <CardContent className="flex items-center gap-4 pt-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{t("auth.b2bStatus.currentStatus")}</p>
            <p className="text-lg font-bold">{statusLabel}</p>
          </div>
          <Badge variant={config.variant}>{statusLabel}</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("auth.b2bStatus.timelineTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          {timelineOrder.map((step, i) => {
            const isDone = i < currentIndex || (i === currentIndex && status === "approved");
            const isCurrent = i === currentIndex && status !== "approved";
            if (step.status === "needs_info" && status !== "needs_info") return null;
            return (
              <div key={step.status} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2",
                      isDone
                        ? "border-success bg-success text-success-foreground"
                        : isCurrent
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-muted text-muted-foreground"
                    )}
                  >
                    {isDone ? <Check className="h-4 w-4" /> : <span className="h-2 w-2 rounded-full bg-current" />}
                  </div>
                  {i < timelineOrder.length - 1 && (
                    <div className={cn("w-0.5 flex-1 py-1", isDone ? "bg-success" : "bg-border")} style={{ minHeight: 32 }} />
                  )}
                </div>
                <div className="pb-6">
                  <p className={cn("text-sm font-semibold", !isDone && !isCurrent && "text-muted-foreground")}>
                    {t(step.labelKey)}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.date}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {status === "approved" && (
        <Button className="mt-6 w-full" onClick={() => navigate("/onboarding")}>
          {t("auth.b2bStatus.continueToOnboarding")}
        </Button>
      )}
    </div>
  );
}
