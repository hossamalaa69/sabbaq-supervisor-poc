import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileSpreadsheet, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";
import { FileDropzone, type FakeUploadedFile } from "@/components/FileDropzone";
import { ExamTypeBadge } from "@/components/ExamTypeBadge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { useQuestionsStore } from "@/store";
import type { ExamType, Question } from "@/types";
import { generateId } from "@/utils/format";
import { toast } from "sonner";
import { useTranslation } from "@/utils/i18n";

type Stage = "idle" | "uploading" | "done";

const previewTemplates: { examType: ExamType; section: string; topic: string; prompt: string; valid: boolean }[] = [
  { examType: "qudurat", section: "Quantitative", topic: "Percentages", prompt: "A price is reduced by 15%. If the new price is 850 SAR, what was the original price?", valid: true },
  { examType: "qudurat", section: "Verbal", topic: "Analogy", prompt: "نجار : خشب كما حداد : ؟", valid: true },
  { examType: "tahsili", section: "Mathematics", topic: "Geometry", prompt: "Find the area of a triangle with base 10 cm and height 6 cm.", valid: true },
  { examType: "tahsili", section: "Science", topic: "Biology", prompt: "Incomplete answer key — needs manual review before import.", valid: false },
  { examType: "qudurat", section: "Quantitative", topic: "Algebra", prompt: "Solve for x: 2x + 9 = 23.", valid: true },
  { examType: "tahsili", section: "Science", topic: "Physics", prompt: "A missing choice was detected in row 37.", valid: false },
];

export default function UploadQuestionsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const bulkImport = useQuestionsStore((s) => s.bulkImport);
  const [stage, setStage] = useState<Stage>("idle");
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState<FakeUploadedFile | null>(null);

  function handleFile(files: FakeUploadedFile[]) {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setStage("uploading");
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + 14 + Math.random() * 10);
        if (next >= 100) {
          clearInterval(interval);
          setStage("done");
        }
        return next;
      });
    }, 250);
  }

  function handleImport() {
    const imported: Question[] = previewTemplates
      .filter((t) => t.valid)
      .map((t) => ({
        id: generateId("q"),
        examType: t.examType,
        section: t.section,
        topic: t.topic,
        difficulty: "Medium",
        type: "Multiple Choice",
        prompt: t.prompt,
        choices: [
          { id: "A", label: "A", text: "Option A" },
          { id: "B", label: "B", text: "Option B" },
          { id: "C", label: "C", text: "Option C" },
          { id: "D", label: "D", text: "Option D" },
        ],
        correctChoiceId: "A",
        explanation: "Imported from bulk upload — review recommended.",
        status: "Pending Review",
        source: "bank",
        generatedAt: new Date().toISOString().slice(0, 10),
      }));
    bulkImport(imported);
    toast.success(t("questions.upload.toastImported", { count: imported.length }));
    navigate("/questions");
  }

  const validCount = previewTemplates.filter((t) => t.valid).length;
  const needsReviewCount = previewTemplates.length - validCount;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <button
        onClick={() => navigate("/questions")}
        className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t("questions.upload.backToQuestions")}
      </button>

      <Card>
        <CardHeader>
          <CardTitle>{t("questions.upload.title")}</CardTitle>
          <CardDescription>{t("questions.upload.desc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {stage === "idle" && (
            <FileDropzone
              accept=".xlsx,.xls"
              multiple={false}
              label={t("questions.upload.dropzoneLabel")}
              hint={t("questions.upload.dropzoneHint")}
              onFilesAdded={handleFile}
            />
          )}

          {stage === "uploading" && file && (
            <div className="rounded-xl border border-border p-4">
              <div className="mb-2 flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                <p className="text-sm font-semibold">{file.name}</p>
              </div>
              <Progress value={progress} />
              <p className="mt-2 text-xs text-muted-foreground">{t("questions.upload.uploadingLabel", { pct: Math.round(progress) })}</p>
            </div>
          )}

          {stage === "done" && file && (
            <div className="space-y-4">
              <div className="rounded-xl border border-success/30 bg-success/5 p-4">
                <div className="mb-3 flex items-center gap-2 text-success">
                  <CheckCircle2 className="h-5 w-5" />
                  <p className="font-semibold">{t("questions.upload.uploadComplete")}</p>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center text-sm">
                  <div>
                    <p className="text-xl font-extrabold">{previewTemplates.length}</p>
                    <p className="text-muted-foreground">{t("questions.upload.imported")}</p>
                  </div>
                  <div>
                    <p className="text-xl font-extrabold text-success">{validCount}</p>
                    <p className="text-muted-foreground">{t("questions.upload.valid")}</p>
                  </div>
                  <div>
                    <p className="text-xl font-extrabold text-warning-foreground">{needsReviewCount}</p>
                    <p className="text-muted-foreground">{t("questions.upload.needsReview")}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold">{t("questions.upload.previewLabel")}</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("questions.upload.table.question")}</TableHead>
                      <TableHead>{t("questions.upload.table.examType")}</TableHead>
                      <TableHead>{t("questions.upload.table.topic")}</TableHead>
                      <TableHead>{t("questions.upload.table.status")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewTemplates.map((pt, i) => (
                      <TableRow key={i}>
                        <TableCell className="max-w-xs">
                          <p dir="auto" className="truncate">{pt.prompt}</p>
                        </TableCell>
                        <TableCell>
                          <ExamTypeBadge examType={pt.examType} />
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{pt.topic}</TableCell>
                        <TableCell>
                          {pt.valid ? (
                            <Badge variant="success">{t("questions.upload.badgeValid")}</Badge>
                          ) : (
                            <Badge variant="warning" className="gap-1">
                              <AlertTriangle className="h-3 w-3" /> {t("questions.upload.badgeNeedsReview")}
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleImport}>
                  {t("questions.upload.importButton", { count: validCount })}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setStage("idle");
                    setFile(null);
                    setProgress(0);
                  }}
                >
                  {t("questions.upload.uploadDifferentFile")}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
