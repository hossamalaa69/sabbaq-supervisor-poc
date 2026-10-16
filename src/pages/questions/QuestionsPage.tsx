import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, FilePenLine, Library, UploadCloud, Plus, Search } from "lucide-react";
import { Tabs } from "@/components/ui/Tabs";
import { Card, CardContent } from "@/components/ui/Card";
import { Input, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ExamTypeBadge } from "@/components/ExamTypeBadge";
import { QuestionStatusBadge } from "@/components/questions/QuestionStatusBadge";
import { QuestionDetailModal } from "@/components/questions/QuestionDetailModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { useQuestionsStore } from "@/store";
import { EXAM_TYPES, type ExamType, type Question } from "@/types";
import { formatDate } from "@/utils/format";
import { useTranslation } from "@/utils/i18n";
import { localizeQuestionContent } from "@/utils/contentTranslations";

type TabValue = "ai" | "teacher" | "bank" | "upload";

export default function QuestionsPage() {
  const navigate = useNavigate();
  const { t, lang } = useTranslation();
  const questions = useQuestionsStore((s) => s.questions);
  const [tab, setTab] = useState<TabValue>("ai");
  const [examFilter, setExamFilter] = useState<"all" | ExamType>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Question | null>(null);

  const sourceByTab: Record<Exclude<TabValue, "upload">, Question["source"]> = {
    ai: "ai",
    teacher: "teacher",
    bank: "bank",
  };

  const counts = useMemo(
    () => ({
      ai: questions.filter((q) => q.source === "ai").length,
      teacher: questions.filter((q) => q.source === "teacher").length,
      bank: questions.filter((q) => q.source === "bank").length,
    }),
    [questions]
  );

  const filtered = useMemo(() => {
    if (tab === "upload") return [];
    return questions.filter((q) => {
      const displayQuestion = localizeQuestionContent(q, lang);
      if (q.source !== sourceByTab[tab]) return false;
      if (examFilter !== "all" && q.examType !== examFilter) return false;
      if (
        search &&
        !displayQuestion.prompt.toLowerCase().includes(search.toLowerCase()) &&
        !displayQuestion.topic.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [questions, tab, examFilter, search, lang]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs
          value={tab}
          onChange={(v) => setTab(v as TabValue)}
          tabs={[
            { value: "ai", label: t("questions.tabs.aiGenerated"), icon: <Sparkles className="h-4 w-4" />, count: counts.ai },
            { value: "teacher", label: t("questions.tabs.myQuestions"), icon: <FilePenLine className="h-4 w-4" />, count: counts.teacher },
            { value: "bank", label: t("questions.tabs.questionBank"), icon: <Library className="h-4 w-4" />, count: counts.bank },
            { value: "upload", label: t("questions.tabs.upload"), icon: <UploadCloud className="h-4 w-4" /> },
          ]}
        />
        <Button className="gap-1.5" onClick={() => navigate("/questions/create")}>
          <Plus className="h-4 w-4" /> {t("questions.createQuestion")}
        </Button>
      </div>

      {tab === "upload" ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
            <UploadCloud className="h-10 w-10 text-primary" />
            <div>
              <p className="font-semibold">{t("questions.bulkUploadCard.title")}</p>
              <p className="mt-1 text-sm text-muted-foreground">{t("questions.bulkUploadCard.desc")}</p>
            </div>
            <Button onClick={() => navigate("/questions/upload")}>{t("questions.bulkUploadCard.goToUpload")}</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardContent className="flex flex-wrap items-center gap-3 pt-5">
              <div className="min-w-[200px] flex-1">
                <Input
                  icon={<Search className="h-4 w-4" />}
                  placeholder={t("questions.searchPlaceholder")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select className="w-auto min-w-[160px]" value={examFilter} onChange={(e) => setExamFilter(e.target.value as "all" | ExamType)}>
                <option value="all">{t("filters.allExamTypes")}</option>
                {EXAM_TYPES.map((et) => (
                  <option key={et} value={et}>
                    {t(`enums.examType.${et}`)}
                  </option>
                ))}
              </Select>
            </CardContent>
          </Card>

          {filtered.length === 0 ? (
            <EmptyState icon={<Sparkles className="h-8 w-8" />} title={t("questions.noQuestions.title")} description={t("questions.noQuestions.desc")} />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("questions.table.question")}</TableHead>
                  <TableHead>{t("questions.table.examType")}</TableHead>
                  <TableHead>{t("questions.table.topic")}</TableHead>
                  <TableHead>{t("questions.table.difficulty")}</TableHead>
                  <TableHead>{t("questions.table.type")}</TableHead>
                  <TableHead>{t("questions.table.status")}</TableHead>
                  <TableHead>{t("questions.table.generated")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((q) => {
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
                      <TableCell className="text-sm text-muted-foreground">{t(`enums.questionType.${q.type}`)}</TableCell>
                      <TableCell>
                        <QuestionStatusBadge status={q.status} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatDate(q.generatedAt, lang)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </>
      )}

      <QuestionDetailModal question={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
