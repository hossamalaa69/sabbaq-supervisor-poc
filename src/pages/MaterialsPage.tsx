import { useState } from "react";
import { Plus, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Input";
import { Dialog, DialogHeader } from "@/components/ui/Dialog";
import { Badge } from "@/components/ui/Badge";
import { ExamTypeBadge } from "@/components/ExamTypeBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { FileDropzone, type FakeUploadedFile } from "@/components/FileDropzone";
import { useMaterialsStore, useClassesStore } from "@/store";
import { EXAM_TYPES, examSections, type ExamType } from "@/types";
import { formatDate } from "@/utils/format";
import { toast } from "sonner";
import { useTranslation } from "@/utils/i18n";
import { localizeClassContent, localizeMaterialContent } from "@/utils/contentTranslations";

export default function MaterialsPage() {
  const { t, lang } = useTranslation();
  const { materials, addMaterial } = useMaterialsStore();
  const classes = useClassesStore((s) => s.classes);

  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [examType, setExamType] = useState<ExamType>("qudurat");
  const [subject, setSubject] = useState(examSections.qudurat[0]);
  const [topic, setTopic] = useState("");
  const [classId, setClassId] = useState(classes[0]?.id ?? "");
  const [file, setFile] = useState<FakeUploadedFile | null>(null);

  function resetForm() {
    setTitle("");
    setExamType("qudurat");
    setSubject(examSections.qudurat[0]);
    setTopic("");
    setClassId(classes[0]?.id ?? "");
    setFile(null);
  }

  function handleSubmit() {
    if (!title || !topic || !file) {
      toast.error(t("materials.toastFillRequired"));
      return;
    }
    addMaterial({ title, examType, subject, topic, classId, fileName: file.name });
    toast.success(t("materials.toastAdded"));
    setModalOpen(false);
    resetForm();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{t("materials.subtitle")}</p>
        <Button className="gap-1.5" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> {t("materials.uploadMaterial")}
        </Button>
      </div>

      {materials.length === 0 ? (
        <EmptyState icon={<BookOpen className="h-8 w-8" />} title={t("materials.noMaterials.title")} description={t("materials.noMaterials.desc")} />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("materials.table.title")}</TableHead>
              <TableHead>{t("materials.table.examType")}</TableHead>
              <TableHead>{t("materials.table.subject")}</TableHead>
              <TableHead>{t("materials.table.topic")}</TableHead>
              <TableHead>{t("materials.table.class")}</TableHead>
              <TableHead>{t("materials.table.uploadDate")}</TableHead>
              <TableHead>{t("materials.table.status")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials.map((m) => {
              const displayMaterial = localizeMaterialContent(m, lang);
              const cls = classes.find((c) => c.id === m.classId);
              const displayClass = cls ? localizeClassContent(cls, lang) : null;
              return (
                <TableRow key={m.id}>
                  <TableCell className="font-semibold">{displayMaterial.title}</TableCell>
                  <TableCell>
                    <ExamTypeBadge examType={m.examType} />
                  </TableCell>
                  <TableCell>{displayMaterial.subject}</TableCell>
                  <TableCell>{displayMaterial.topic}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{displayClass?.name ?? t("common.dash")}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(m.uploadDate, lang)}</TableCell>
                  <TableCell>
                    <Badge variant={m.status === "Published" ? "success" : "secondary"}>{t(`enums.materialStatus.${m.status}`)}</Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      <Dialog open={modalOpen} onClose={() => { setModalOpen(false); resetForm(); }}>
        <DialogHeader title={t("materials.dialogTitle")} description={t("materials.dialogDesc")} onClose={() => { setModalOpen(false); resetForm(); }} />
        <div className="space-y-4">
          <div>
            <Label>{t("materials.materialTitle")}</Label>
            <Input className="mt-1.5" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("materials.materialTitlePlaceholder")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{t("materials.examType")}</Label>
              <Select
                className="mt-1.5"
                value={examType}
                onChange={(e) => {
                  const val = e.target.value as ExamType;
                  setExamType(val);
                  setSubject(examSections[val][0]);
                }}
              >
                {EXAM_TYPES.map((et) => (
                  <option key={et} value={et}>
                    {t(`enums.examType.${et}`)}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>{t("materials.subject")}</Label>
              <Select className="mt-1.5" value={subject} onChange={(e) => setSubject(e.target.value)}>
                {examSections[examType].map((s) => (
                  <option key={s} value={s}>
                    {t(`enums.subject.${s}`)}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div>
            <Label>{t("materials.topic")}</Label>
            <Input className="mt-1.5" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={t("materials.topicPlaceholder")} />
          </div>
          <div>
            <Label>{t("materials.class")}</Label>
            <Select className="mt-1.5" value={classId} onChange={(e) => setClassId(e.target.value)}>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {localizeClassContent(c, lang).name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>{t("materials.file")}</Label>
            <div className="mt-1.5">
              <FileDropzone
                multiple={false}
                hint={t("materials.fileHint")}
                onFilesAdded={(files) => setFile(files[0] ?? null)}
              />
              {file && <p className="mt-2 text-sm font-medium text-success">{t("materials.fileSelected", { name: file.name })}</p>}
            </div>
          </div>
          <Button className="w-full" onClick={handleSubmit}>
            {t("materials.addToStudyPlan")}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
