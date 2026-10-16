import { useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, Sparkles } from "lucide-react";
import { Dialog, DialogHeader } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Textarea } from "@/components/ui/Input";
import { ExamTypeBadge } from "@/components/ExamTypeBadge";
import { useQuestionsStore } from "@/store";
import type { Question } from "@/types";
import { cn } from "@/utils/cn";
import { formatDate } from "@/utils/format";
import { toast } from "sonner";
import { useTranslation } from "@/utils/i18n";
import { localizeQuestionContent } from "@/utils/contentTranslations";

export function QuestionDetailModal({
  question,
  onClose,
}: {
  question: Question | null;
  onClose: () => void;
}) {
  const { t, lang } = useTranslation();
  const reviewQuestion = useQuestionsStore((s) => s.reviewQuestion);
  const [feedback, setFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  if (!question) return null;
  const displayQuestion = localizeQuestionContent(question, lang);

  function handleApprove() {
    reviewQuestion(question!.id, "Approved");
    toast.success(t("questions.detail.toastApproved"));
    onClose();
  }

  function handleReject() {
    reviewQuestion(question!.id, "Rejected");
    toast.success(t("questions.detail.toastRejected"));
    onClose();
  }

  function handleNeedsRevision() {
    if (!showFeedback) {
      setShowFeedback(true);
      return;
    }
    reviewQuestion(question!.id, "Needs Revision", feedback);
    toast.success(t("questions.detail.toastFeedbackSent"));
    setShowFeedback(false);
    setFeedback("");
    onClose();
  }

  return (
    <Dialog open={!!question} onClose={onClose} className="max-w-xl">
      <DialogHeader title={t("questions.detail.title")} onClose={onClose} />
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <ExamTypeBadge examType={question.examType} />
          <Badge variant="secondary">{t(`enums.subject.${question.section}`)}</Badge>
          <Badge variant="outline">{t(`enums.difficulty.${question.difficulty}`)}</Badge>
          <Badge variant="outline">{t(`enums.questionType.${question.type}`)}</Badge>
        </div>

        <div>
          <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">{t("questions.detail.topic")}</p>
          <p className="text-sm">{displayQuestion.topic}</p>
        </div>

        <div>
          <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">{t("questions.detail.question")}</p>
          <p dir="auto" className="text-sm font-medium">{displayQuestion.prompt}</p>
        </div>

        <div className="space-y-2">
          {displayQuestion.choices.map((choice) => (
            <div
              key={choice.id}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-3 py-2 text-sm",
                choice.id === question.correctChoiceId
                  ? "border-success bg-success/5"
                  : "border-border"
              )}
            >
              <span className="font-bold">{choice.label}.</span>
              <span dir="auto">{choice.text}</span>
              {choice.id === question.correctChoiceId && (
                <CheckCircle2 className="ms-auto h-4 w-4 text-success" />
              )}
            </div>
          ))}
        </div>

        <div>
          <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">{t("questions.detail.explanation")}</p>
          <p dir="auto" className="text-sm text-muted-foreground">{displayQuestion.explanation}</p>
        </div>

        <div className="rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> {t("questions.detail.sourceLabel", {
              source:
                question.source === "ai"
                  ? t("questions.detail.sourceAi")
                  : question.source === "bank"
                    ? t("questions.detail.sourceBank")
                    : t("questions.detail.sourceTeacher"),
            })}
          </p>
          <p className="mt-1">{t("questions.detail.generatedLabel", { date: formatDate(question.generatedAt, lang) })}</p>
        </div>

        {question.status === "Pending Review" && (
          <>
            {showFeedback && (
              <div>
                <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">{t("questions.detail.feedbackLabel")}</p>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder={t("questions.detail.feedbackPlaceholder")}
                />
              </div>
            )}
            <div className="flex gap-2">
              <Button className="flex-1 gap-1.5" onClick={handleApprove}>
                <CheckCircle2 className="h-4 w-4" /> {t("questions.detail.approve")}
              </Button>
              <Button variant="outline" className="flex-1 gap-1.5" onClick={handleNeedsRevision}>
                <AlertCircle className="h-4 w-4" /> {showFeedback ? t("questions.detail.submitFeedback") : t("questions.detail.needsRevision")}
              </Button>
              <Button variant="destructive" className="flex-1 gap-1.5" onClick={handleReject}>
                <XCircle className="h-4 w-4" /> {t("questions.detail.reject")}
              </Button>
            </div>
          </>
        )}

        {displayQuestion.reviewFeedback && (
          <div className="rounded-xl border border-warning/30 bg-warning/5 p-3 text-sm">
            <p className="font-semibold text-warning-foreground">{t("questions.detail.revisionFeedbackLabel")}</p>
            <p className="mt-1 text-muted-foreground">{displayQuestion.reviewFeedback}</p>
          </div>
        )}
      </div>
    </Dialog>
  );
}
