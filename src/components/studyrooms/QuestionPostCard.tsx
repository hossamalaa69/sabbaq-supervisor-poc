import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";
import type { StudyRoomQuestionPost } from "@/types";
import { formatDateTime } from "@/utils/format";
import { useTranslation } from "@/utils/i18n";

export function QuestionPostCard({
  post,
  totalStudents,
}: {
  post: StudyRoomQuestionPost;
  totalStudents: number;
}) {
  const { t } = useTranslation();
  const responded = post.responses.length;
  const correctCount = post.responses.filter((r) => r.correct).length;

  return (
    <Card>
      <CardContent className="space-y-3 pt-5">
        <div className="flex items-start justify-between gap-2">
          <p dir="auto" className="font-medium">{post.prompt}</p>
          <Badge variant="secondary" className="shrink-0">
            {t("studyRooms.questionPost.answeredCount", { responded, total: totalStudents || responded })}
          </Badge>
        </div>

        <div className="space-y-2">
          {post.choices.map((choice) => {
            const count = post.responses.filter((r) => r.choiceId === choice.id).length;
            const pct = responded ? Math.round((count / responded) * 100) : 0;
            const isCorrect = choice.id === post.correctChoiceId;
            return (
              <div key={choice.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 font-medium">
                    {choice.label}. {choice.text}
                    {isCorrect && <CheckCircle2 className="h-3.5 w-3.5 text-success" />}
                  </span>
                  <span className="text-muted-foreground">{t("studyRooms.questionPost.choiceCountPct", { count, pct })}</span>
                </div>
                <Progress value={pct} indicatorClassName={isCorrect ? "bg-success" : undefined} />
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-2 text-xs text-muted-foreground">
          <span>{t("studyRooms.questionPost.correctOf", { correct: correctCount, total: responded })}</span>
          <span>{formatDateTime(post.createdAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
