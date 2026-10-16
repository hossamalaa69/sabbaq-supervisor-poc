import { useMemo, useState } from "react";
import { ClipboardCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Select } from "@/components/ui/Input";
import { ExamTypeBadge } from "@/components/ExamTypeBadge";
import { QuestionDetailModal } from "@/components/questions/QuestionDetailModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { useQuestionsStore } from "@/store";
import { EXAM_TYPES, type ExamType, type Question } from "@/types";
import { formatDate } from "@/utils/format";
import { useTranslation } from "@/utils/i18n";
import { localizeQuestionContent } from "@/utils/contentTranslations";

export default function QuestionReviewPage() {
  const { t, lang } = useTranslation();
  const questions = useQuestionsStore((s) => s.questions);
  const [examFilter, setExamFilter] = useState<"all" | ExamType>("all");
  const [selected, setSelected] = useState<Question | null>(null);

  const pending = useMemo(
    () =>
      questions.filter((q) => q.status === "Pending Review" && (examFilter === "all" || q.examType === examFilter)),
    [questions, examFilter]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{t("questions.review.subtitle")}</p>
        </div>
        <Select className="w-auto min-w-[160px]" value={examFilter} onChange={(e) => setExamFilter(e.target.value as "all" | ExamType)}>
          <option value="all">{t("filters.allExamTypes")}</option>
          {EXAM_TYPES.map((et) => (
            <option key={et} value={et}>
              {t(`enums.examType.${et}`)}
            </option>
          ))}
        </Select>
      </div>

      <Card>
        <CardContent className="flex items-center gap-3 pt-5">
          <Badge variant="warning">{t("questions.review.pendingBadge", { count: pending.length })}</Badge>
          <p className="text-sm text-muted-foreground">{t("questions.review.pendingDesc")}</p>
        </CardContent>
      </Card>

      {pending.length === 0 ? (
        <EmptyState
          icon={<ClipboardCheck className="h-8 w-8" />}
          title={t("questions.review.allCaughtUp.title")}
          description={t("questions.review.allCaughtUp.desc")}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("questions.review.table.question")}</TableHead>
              <TableHead>{t("questions.review.table.examType")}</TableHead>
              <TableHead>{t("questions.review.table.topic")}</TableHead>
              <TableHead>{t("questions.review.table.difficulty")}</TableHead>
              <TableHead>{t("questions.review.table.generated")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pending.map((q) => {
              const displayQuestion = localizeQuestionContent(q, lang);
              return (
                <TableRow key={q.id} className="cursor-pointer" onClick={() => setSelected(q)}>
                  <TableCell className="max-w-sm">
                    <p dir="auto" className="truncate font-medium">{displayQuestion.prompt}</p>
                  </TableCell>
                  <TableCell>
                    <ExamTypeBadge examType={q.examType} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{displayQuestion.topic}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{t(`enums.difficulty.${q.difficulty}`)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(q.generatedAt, lang)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      <QuestionDetailModal question={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
