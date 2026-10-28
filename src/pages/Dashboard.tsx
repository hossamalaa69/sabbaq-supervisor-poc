import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Activity,
  TrendingUp,
  Target,
  ClipboardList,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  UserPlus,
  ArrowUpRight,
  TrendingDown,
  MinusCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { StatCard } from "@/components/StatCard";
import { ExamTypeBadge } from "@/components/ExamTypeBadge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { InviteStudentsModal } from "@/components/InviteStudentsModal";
import { useStudentsStore, useClassesStore } from "@/store";
import { mockAssessments, scoreOverTimeSeries, performanceDistribution, mockInsights, mockAlerts } from "@/mock";
import { getStudentCategorySummaries } from "@/mock/students";
import { type ExamType } from "@/types";
import { formatDate, relativeTime } from "@/utils/format";
import { cn } from "@/utils/cn";
import { useTranslation } from "@/utils/i18n";
import {
  localizeAlertContent,
  localizeAssessmentContent,
  localizeClassContent,
  localizeInsightContent,
} from "@/utils/contentTranslations";

type Filter = "all" | ExamType;

export default function Dashboard() {
  const navigate = useNavigate();
  const { t, lang } = useTranslation();
  const students = useStudentsStore((s) => s.students);
  const classes = useClassesStore((s) => s.classes);
  const [filter, setFilter] = useState<Filter>("all");
  const [inviteOpen, setInviteOpen] = useState(false);

  const filteredStudents = useMemo(
    () => (filter === "all" ? students : students.filter((s) => s.examType === filter)),
    [students, filter]
  );

  const kpis = useMemo(() => {
    const total = filteredStudents.length;
    const active = filteredStudents.filter((s) => s.status === "active").length;
    const avgScore = total
      ? Math.round(filteredStudents.reduce((sum, s) => sum + s.averageScore, 0) / total)
      : 0;
    const avgImprovement = total
      ? Math.round(filteredStudents.reduce((sum, s) => sum + s.improvementPct, 0) / total)
      : 0;
    const assessmentsCompleted = filteredStudents.reduce((sum, s) => sum + s.assessmentsCompleted, 0);
    return { total, active, avgScore, avgImprovement, assessmentsCompleted };
  }, [filteredStudents]);

  const categories = useMemo(() => getStudentCategorySummaries(filteredStudents), [filteredStudents]);

  const filteredAssessments = useMemo(
    () => (filter === "all" ? mockAssessments : mockAssessments.filter((a) => a.examType === filter)).slice(0, 5),
    [filter]
  );

  const filteredInsights = useMemo(
    () => (filter === "all" ? mockInsights : mockInsights.filter((i) => i.examType === filter)).slice(0, 4),
    [filter]
  );

  const filteredAlerts = useMemo(
    () =>
      (filter === "all" ? mockAlerts : mockAlerts.filter((a) => a.examType === filter || a.examType === "general")).slice(
        0,
        5
      ),
    [filter]
  );
  const localizedScoreSeries = useMemo(
    () =>
      scoreOverTimeSeries.map((point) => ({
        ...point,
        date:
          lang === "ar"
            ? point.date
                .replace("Sep", "سبتمبر")
                .replace("Oct", "أكتوبر")
            : point.date,
      })),
    [lang]
  );
  const localizedPerformanceDistribution = useMemo(
    () =>
      performanceDistribution.map((point) => ({
        ...point,
        range: lang === "ar" && point.range === "Below 60" ? "أقل من 60" : point.range,
      })),
    [lang]
  );

  function goToCategory(category: string) {
    navigate(`/students?category=${category}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">
            {t("dashboard.welcome", { name: lang === "ar" ? "حسام" : "Hossam" })}
          </h2>
          <p className="text-sm text-muted-foreground">{t("dashboard.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl bg-muted p-1">
            {(["all", "qudurat", "tahsili"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                  filter === f ? "bg-card shadow-card text-foreground" : "text-muted-foreground"
                )}
              >
                {f === "all" ? t("filters.allExams") : t(`enums.examTypeShort.${f}`)}
              </button>
            ))}
          </div>
          <Button className="gap-1.5" onClick={() => setInviteOpen(true)}>
            <UserPlus className="h-4 w-4" /> {t("dashboard.inviteStudents")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label={t("dashboard.kpis.totalStudents")} value={String(kpis.total)} icon={<Users className="h-5 w-5" />} />
        <StatCard label={t("dashboard.kpis.activeStudents")} value={String(kpis.active)} icon={<Activity className="h-5 w-5" />} />
        <StatCard label={t("dashboard.kpis.averageScore")} value={`${kpis.avgScore}%`} icon={<Target className="h-5 w-5" />} />
        <StatCard
          label={t("dashboard.kpis.averageImprovement")}
          value={`${kpis.avgImprovement >= 0 ? "+" : ""}${kpis.avgImprovement}%`}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          label={t("dashboard.kpis.assessmentsCompleted")}
          value={String(kpis.assessmentsCompleted)}
          icon={<ClipboardList className="h-5 w-5" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {categories.map((cat) => (
          <button key={cat.category} onClick={() => goToCategory(cat.category)} className="text-start">
            <Card className="h-full transition-shadow hover:shadow-popover">
              <CardContent className="flex items-center justify-between pt-5">
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
                    {cat.category === "improving" && <ArrowUpRight className="h-4 w-4 text-success" />}
                    {cat.category === "struggling" && <TrendingDown className="h-4 w-4 text-destructive" />}
                    {cat.category === "inactive" && <MinusCircle className="h-4 w-4 text-muted-foreground" />}
                    {t(`filters.${cat.category}`)}
                  </p>
                  <p className="mt-1 text-2xl font-extrabold">{cat.count}</p>
                  <p className="text-xs text-muted-foreground">{t("dashboard.percentOfStudents", { pct: cat.percentage })}</p>
                </div>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.charts.scoreOverTimeTitle")}</CardTitle>
            <CardDescription>{t("dashboard.charts.scoreOverTimeDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="h-72 ps-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={localizedScoreSeries} margin={{ left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" domain={[50, 100]} />
                <Tooltip contentStyle={{ borderRadius: 12, borderColor: "hsl(var(--border))" }} />
                <Legend />
                {(filter === "all" || filter === "qudurat") && (
                  <Line type="monotone" dataKey="qudurat" name={t("enums.examTypeShort.qudurat")} stroke="hsl(var(--chart-1))" strokeWidth={2.5} dot={false} />
                )}
                {(filter === "all" || filter === "tahsili") && (
                  <Line type="monotone" dataKey="tahsili" name={t("enums.examTypeShort.tahsili")} stroke="hsl(var(--chart-2))" strokeWidth={2.5} dot={false} />
                )}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.charts.performanceDistTitle")}</CardTitle>
            <CardDescription>{t("dashboard.charts.performanceDistDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="h-72 ps-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={localizedPerformanceDistribution} margin={{ left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="range" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: 12, borderColor: "hsl(var(--border))" }} />
                <Bar dataKey="students" fill="hsl(var(--chart-1))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.recentAssessments.title")}</CardTitle>
            <CardDescription>{t("dashboard.recentAssessments.desc")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredAssessments.map((a) => {
              const cls = classes.find((c) => c.id === a.classId);
              const displayAssessment = localizeAssessmentContent(a, lang);
              const displayClass = cls ? localizeClassContent(cls, lang) : null;
              return (
                <div key={a.id} className="rounded-xl border border-border p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{displayAssessment.name}</p>
                    <ExamTypeBadge examType={a.examType} />
                  </div>
                  <div className="mb-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span>{displayClass?.name ?? t("common.dash")}</span>
                    <span>{formatDate(a.date, lang)}</span>
                    <span>{t("dashboard.recentAssessments.studentsCount", { count: a.studentsCount })}</span>
                    <span>{t("dashboard.recentAssessments.avgLabel", { pct: a.averageScore })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={a.completionPct} className="flex-1" />
                    <span className="text-xs font-semibold text-muted-foreground">{a.completionPct}%</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" /> {t("dashboard.aiInsights.title")}
              </CardTitle>
              <CardDescription>{t("dashboard.aiInsights.desc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredInsights.map((insight) => (
                <div key={insight.id} className="flex gap-2 rounded-xl bg-primary/5 p-3 text-sm">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div>
                    <p>{localizeInsightContent(insight, lang).message}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{relativeTime(insight.createdAt, lang)}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-accent" /> {t("dashboard.alerts.title")}
              </CardTitle>
              <CardDescription>{t("dashboard.alerts.desc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredAlerts.map((alert) => (
                <button
                  key={alert.id}
                  onClick={() => navigate(alert.studentIds.length ? `/students?ids=${alert.studentIds.join(",")}` : "/students")}
                  className="flex w-full items-start gap-2 rounded-xl border border-border p-3 text-start text-sm hover:bg-muted/40"
                >
                  <Badge
                    variant={alert.severity === "high" ? "destructive" : alert.severity === "medium" ? "warning" : "secondary"}
                    className="mt-0.5 shrink-0"
                  >
                    {t(`enums.severity.${alert.severity}`)}
                  </Badge>
                  <span>{localizeAlertContent(alert, lang).message}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <InviteStudentsModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
    </div>
  );
}
