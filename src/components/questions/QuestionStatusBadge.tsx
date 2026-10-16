import { Badge } from "@/components/ui/Badge";
import type { QuestionReviewStatus } from "@/types";
import { useTranslation } from "@/utils/i18n";

const variantMap: Record<QuestionReviewStatus, "warning" | "success" | "accent" | "destructive"> = {
  "Pending Review": "warning",
  Approved: "success",
  "Needs Revision": "accent",
  Rejected: "destructive",
};

export function QuestionStatusBadge({ status }: { status: QuestionReviewStatus }) {
  const { t } = useTranslation();
  return <Badge variant={variantMap[status]}>{t(`enums.reviewStatus.${status}`)}</Badge>;
}
