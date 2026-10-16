import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  TrendingUp,
  TrendingDown,
  Calendar,
  Video,
  Ban,
  RotateCcw,
  ShieldAlert,
  ClipboardList,
  CheckCircle2,
  XCircle,
  MinusCircle,
  ChevronRight,
  Clock3,
} from "lucide-react";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogHeader } from "@/components/ui/Dialog";
import { Textarea } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { Avatar } from "@/components/ui/Avatar";
import { ExamTypeBadge } from "@/components/ExamTypeBadge";
import { useStudentsStore, useClassesStore, useMeetingAgentUiStore } from "@/store";
import {
  getAssessmentQuestionBank,
  getStudentAssessmentAttempts,
  mockAssessments,
} from "@/mock";
import { formatDate } from "@/utils/format";
import { useTranslation } from "@/utils/i18n";
import {
  localizeAssessmentContent,
  localizeClassContent,
} from "@/utils/contentTranslations";
import { cn } from "@/utils/cn";
import { toast } from "sonner";

export default function StudentDetail() {
  const { t, lang } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const students = useStudentsStore((s) => s.students);
  const deactivateStudent = useStudentsStore((s) => s.deactivateStudent);
  const reactivateStudent = useStudentsStore((s) => s.reactivateStudent);
  const classes = useClassesStore((s) => s.classes);
  const openMeetingAgent = useMeetingAgentUiStore((s) => s.open);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [deactivationReason, setDeactivationReason] = useState("");
  const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(null);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);

  const student = students.find((s) => s.id === id);

  if (!student) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="font-semibold">{t("students.detail.notFound")}</p>
        <Button variant="outline" onClick={() => navigate("/students")}>
          {t("students.detail.backToStudents")}
        </Button>
      </div>
    );
  }

  const cls = classes.find((c) => c.id === student.classId);
  const displayClass = cls ? localizeClassContent(cls, lang) : null;
  const trendData = student.trend.map((score, i) => ({ name: `T${i + 1}`, score }));
  const attempts =
    student.assessmentsCompleted > 0
      ? getStudentAssessmentAttempts(student.id, student.classId)
      : [];
  const selectedAttempt =
    attempts.find((attempt) => attempt.id === selectedAttemptId) ?? null;
  const selectedAssessment = selectedAttempt
    ? mockAssessments.find(
        (assessment) => assessment.id === selectedAttempt.assessmentId
      ) ?? null
    : null;
  const selectedQuestionBank = selectedAssessment
    ? getAssessmentQuestionBank(selectedAssessment, lang)
    : [];

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/students")}
        className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t("students.detail.backToStudents")}
      </button>

      <Card>
        <CardContent className="flex flex-wrap items-center gap-5 pt-6">
          <Avatar name={student.name} color={student.avatarColor} size="lg" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold">{student.name}</h2>
              <ExamTypeBadge examType={student.examType} />
              <Badge variant={student.status === "active" ? "success" : "outline"}>{t(`enums.studentStatus.${student.status}`)}</Badge>
              {student.accessStatus === "deactivated" && (
                <Badge variant="destructive">{t("students.accessDeactivated")}</Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{displayClass?.name ?? t("common.dash")} · {t(`enums.group.${student.group}`)}</p>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Mail className="h-4 w-4" /> {student.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="h-4 w-4" /> {student.phone}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="gap-1.5"
              disabled={student.accessStatus === "deactivated"}
              onClick={() => openMeetingAgent(student.classId)}
            >
              <Video className="h-4 w-4" /> {t("students.detail.scheduleMeeting")}
            </Button>
            {student.accessStatus !== "deactivated" ? (
              <Button variant="destructive" className="gap-1.5" onClick={() => setDeactivateOpen(true)}>
                <Ban className="h-4 w-4" /> {t("students.detail.deactivate")}
              </Button>
            ) : (
              <Button
                variant="solid"
                className="gap-1.5"
                onClick={() => {
                  reactivateStudent(student.id);
                  toast.success(t("students.detail.toastReactivated"));
                }}
              >
                <RotateCcw className="h-4 w-4" /> {t("students.detail.reactivate")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {student.accessStatus === "deactivated" && (
        <div className="rounded-xl border border-warning/40 bg-warning/10 p-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-warning-foreground" />
            <div>
              <p className="font-bold text-warning-foreground">{t("students.detail.accessRestrictedTitle")}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t("students.detail.accessRestrictedDesc")}</p>
              {student.deactivatedAt && (
                <p className="mt-2 text-xs font-medium text-muted-foreground">
                  {t("students.detail.deactivatedOn", { date: formatDate(student.deactivatedAt, lang) })}
                </p>
              )}
              {student.deactivationReason && (
                <div className="mt-3 rounded-lg bg-background/70 p-3">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">{t("students.detail.reasonLabel")}</p>
                  <p className="mt-1 text-sm">{student.deactivationReason}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-muted-foreground">{t("students.detail.averageScore")}</p>
            <p className="mt-1 text-2xl font-extrabold">{student.averageScore}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              {student.improvementPct >= 0 ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              {t("students.detail.improvement")}
            </p>
            <p className={`mt-1 text-2xl font-extrabold ${student.improvementPct >= 0 ? "text-success" : "text-destructive"}`}>
              {student.improvementPct >= 0 ? "+" : ""}
              {student.improvementPct}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" /> {t("students.detail.lastActivity")}
            </p>
            <p className="mt-1 text-2xl font-extrabold">{formatDate(student.lastActivity, lang)}</p>
          </CardContent>
        </Card>

        <Dialog
          open={deactivateOpen}
          onClose={() => {
            setDeactivateOpen(false);
            setDeactivationReason("");
          }}
        >
          <DialogHeader
            title={t("students.detail.deactivateDialogTitle")}
            description={t("students.detail.deactivateDialogDesc")}
            onClose={() => {
              setDeactivateOpen(false);
              setDeactivationReason("");
            }}
          />
          <div className="space-y-4">
            <div>
              <p className="mb-1.5 text-sm font-medium">{t("students.detail.reasonLabel")}</p>
              <Textarea
                value={deactivationReason}
                onChange={(event) => setDeactivationReason(event.target.value)}
                placeholder={t("students.detail.reasonPlaceholder")}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => {
                  const reason = deactivationReason.trim();
                  if (!reason) {
                    toast.error(t("students.detail.reasonRequired"));
                    return;
                  }
                  deactivateStudent(student.id, reason);
                  setDeactivateOpen(false);
                  setDeactivationReason("");
                  toast.success(t("students.detail.toastDeactivated"));
                }}
              >
                {t("students.detail.confirmDeactivate")}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setDeactivateOpen(false);
                  setDeactivationReason("");
                }}
              >
                {t("common.cancel")}
              </Button>
            </div>
          </div>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("students.detail.scoreTrend")}</CardTitle>
        </CardHeader>
        <CardContent className="h-64 ps-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" domain={[30, 100]} />
              <Tooltip contentStyle={{ borderRadius: 12, borderColor: "hsl(var(--border))" }} />
              <Line
                type="monotone"
                dataKey="score"
                stroke={student.examType === "qudurat" ? "hsl(var(--chart-1))" : "hsl(var(--chart-2))"}
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("students.detail.examHistory.title")}</CardTitle>
          <CardDescription>{t("students.detail.examHistory.desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          {attempts.length === 0 ? (
            <EmptyState
              icon={<ClipboardList className="h-8 w-8" />}
              title={t("students.detail.examHistory.emptyTitle")}
              description={t("students.detail.examHistory.emptyDesc")}
            />
          ) : (
            <div className="space-y-3">
              {attempts.map((attempt) => {
                const assessment = mockAssessments.find(
                  (item) => item.id === attempt.assessmentId
                );
                if (!assessment) return null;
                const displayAssessment = localizeAssessmentContent(assessment, lang);
                const minutes = Math.floor(attempt.durationSeconds / 60);
                const seconds = attempt.durationSeconds % 60;

                return (
                  <button
                    key={attempt.id}
                    className="flex w-full flex-wrap items-center gap-4 rounded-xl border border-border p-4 text-start transition-colors hover:border-primary/40 hover:bg-muted/40"
                    onClick={() => {
                      setSelectedQuestionIndex(0);
                      setSelectedAttemptId(attempt.id);
                    }}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <ClipboardList className="h-5 w-5" />
                    </div>
                    <div className="min-w-[12rem] flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold">{displayAssessment.name}</p>
                        <ExamTypeBadge examType={assessment.examType} />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {t("students.detail.examHistory.completed", {
                          date: formatDate(attempt.completedAt, lang),
                        })}
                      </p>
                    </div>
                    <div className="text-sm">
                      <p className="text-xs text-muted-foreground">{t("students.detail.examHistory.score")}</p>
                      <p className="text-lg font-extrabold">{attempt.score}%</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>
                        {t("students.detail.examHistory.correctCount", {
                          correct: attempt.correctAnswers,
                          total: attempt.totalQuestions,
                        })}
                      </p>
                      <p className="mt-1 flex items-center gap-1">
                        <Clock3 className="h-3.5 w-3.5" />
                        {t("students.detail.examHistory.duration", { minutes, seconds })}
                      </p>
                    </div>
                    <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                      {t("students.detail.examHistory.viewDetails")}
                      <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedAttempt && !!selectedAssessment}
        onClose={() => setSelectedAttemptId(null)}
        className="max-w-3xl"
      >
        {selectedAttempt && selectedAssessment && (
          <>
            <DialogHeader
              title={localizeAssessmentContent(selectedAssessment, lang).name}
              description={t("students.detail.examHistory.completed", {
                date: formatDate(selectedAttempt.completedAt, lang),
              })}
              onClose={() => setSelectedAttemptId(null)}
            />

            <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">{t("students.detail.examHistory.score")}</p>
                <p className="mt-1 text-xl font-extrabold">{selectedAttempt.score}%</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-3 sm:col-span-2">
                <p className="text-xs text-muted-foreground">{t("students.detail.examHistory.correct")}</p>
                <p className="mt-1 font-bold">
                  {t("students.detail.examHistory.correctCount", {
                    correct: selectedAttempt.correctAnswers,
                    total: selectedAttempt.totalQuestions,
                  })}
                </p>
              </div>
              <div className="rounded-xl bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">
                  {t("students.detail.examHistory.duration", {
                    minutes: Math.floor(selectedAttempt.durationSeconds / 60),
                    seconds: selectedAttempt.durationSeconds % 60,
                  })}
                </p>
              </div>
            </div>

            <div className="mb-4 rounded-xl border border-border bg-muted/20 p-3">
              <p className="mb-2 text-xs font-semibold text-muted-foreground">
                {t("students.detail.examHistory.questionNavigator")}
              </p>
              <div className="grid max-h-28 grid-cols-10 gap-1.5 overflow-y-auto scrollbar-thin sm:grid-cols-12">
                {selectedAttempt.answers.map((answer, index) => {
                  const question = selectedQuestionBank.find(
                    (item) => item.id === answer.questionId
                  );
                  const isCorrect =
                    question?.correctChoiceId === answer.selectedChoiceId;
                  const unanswered = answer.selectedChoiceId === null;

                  return (
                    <button
                      key={answer.questionId}
                      onClick={() => setSelectedQuestionIndex(index)}
                      className={cn(
                        "flex h-7 min-w-7 items-center justify-center rounded-md text-[11px] font-bold transition-colors",
                        unanswered
                          ? "bg-muted text-muted-foreground"
                          : isCorrect
                            ? "bg-success/15 text-success"
                            : "bg-destructive/15 text-destructive",
                        index === selectedQuestionIndex &&
                          "ring-2 ring-primary ring-offset-1 ring-offset-background"
                      )}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              {selectedAttempt.answers
                .slice(selectedQuestionIndex, selectedQuestionIndex + 1)
                .map((answer) => {
                const index = selectedQuestionIndex;
                const question = selectedQuestionBank.find(
                  (item) => item.id === answer.questionId
                );
                if (!question) return null;
                const displayQuestion = question;
                const selectedChoice = displayQuestion.choices.find(
                  (choice) => choice.id === answer.selectedChoiceId
                );
                const correctChoice = displayQuestion.choices.find(
                  (choice) => choice.id === displayQuestion.correctChoiceId
                );
                const isCorrect =
                  answer.selectedChoiceId === displayQuestion.correctChoiceId;
                const unanswered = answer.selectedChoiceId === null;

                return (
                  <div key={answer.questionId} className="rounded-xl border border-border p-4">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">
                          {t("students.detail.examHistory.questionNumber", {
                            number: index + 1,
                          })}
                        </span>
                        <Badge variant="secondary">{displayQuestion.topic}</Badge>
                      </div>
                      {unanswered ? (
                        <Badge variant="outline">
                          <MinusCircle className="h-3.5 w-3.5" />
                          {t("students.detail.examHistory.unanswered")}
                        </Badge>
                      ) : isCorrect ? (
                        <Badge variant="success">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {t("students.detail.examHistory.correct")}
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="h-3.5 w-3.5" />
                          {t("students.detail.examHistory.incorrect")}
                        </Badge>
                      )}
                    </div>

                    <p dir="auto" className="font-semibold">{displayQuestion.prompt}</p>

                    <div className="mt-3 space-y-2">
                      {displayQuestion.choices.map((choice) => {
                        const isCorrectChoice =
                          choice.id === displayQuestion.correctChoiceId;
                        const isSelectedChoice = choice.id === answer.selectedChoiceId;

                        return (
                          <div
                            key={choice.id}
                            className={cn(
                              "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                              isCorrectChoice && "border-success/50 bg-success/10",
                              isSelectedChoice &&
                                !isCorrectChoice &&
                                "border-destructive/50 bg-destructive/10",
                              !isCorrectChoice &&
                                !isSelectedChoice &&
                                "border-border"
                            )}
                          >
                            <span className="font-bold">{choice.label}.</span>
                            <span dir="auto" className="flex-1">{choice.text}</span>
                            {isCorrectChoice && <CheckCircle2 className="h-4 w-4 text-success" />}
                            {isSelectedChoice && !isCorrectChoice && (
                              <XCircle className="h-4 w-4 text-destructive" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <Button
                        variant="outline"
                        disabled={selectedQuestionIndex === 0}
                        onClick={() =>
                          setSelectedQuestionIndex((current) => Math.max(0, current - 1))
                        }
                      >
                        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                        {t("students.detail.examHistory.previousQuestion")}
                      </Button>
                      <Button
                        variant="outline"
                        disabled={
                          selectedQuestionIndex === selectedAttempt.totalQuestions - 1
                        }
                        onClick={() =>
                          setSelectedQuestionIndex((current) =>
                            Math.min(selectedAttempt.totalQuestions - 1, current + 1)
                          )
                        }
                      >
                        {t("students.detail.examHistory.nextQuestion")}
                        <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                      </Button>
                    </div>

                    <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                      <div className="rounded-lg bg-muted/50 p-3">
                        <p className="text-xs font-semibold text-muted-foreground">
                          {t("students.detail.examHistory.studentAnswer")}
                        </p>
                        <p dir="auto" className="mt-1 font-medium">
                          {selectedChoice?.text ??
                            t("students.detail.examHistory.unanswered")}
                        </p>
                      </div>
                      <div className="rounded-lg bg-success/10 p-3">
                        <p className="text-xs font-semibold text-muted-foreground">
                          {t("students.detail.examHistory.correctAnswer")}
                        </p>
                        <p dir="auto" className="mt-1 font-medium">
                          {correctChoice?.text ?? t("common.dash")}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 rounded-lg bg-muted/30 p-3 text-sm">
                      <p className="text-xs font-semibold text-muted-foreground">
                        {t("students.detail.examHistory.explanation")}
                      </p>
                      <p dir="auto" className="mt-1">{displayQuestion.explanation}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {t("students.detail.examHistory.timeSpent", {
                          seconds: answer.timeSpentSeconds,
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Dialog>
    </div>
  );
}
