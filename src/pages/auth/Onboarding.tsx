import { useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Users, Sparkles, Video, LayoutGrid, Infinity as InfinityIcon, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Input";
import { Dialog, DialogHeader } from "@/components/ui/Dialog";
import { Tabs } from "@/components/ui/Tabs";
import { ExamTypeBadge } from "@/components/ExamTypeBadge";
import { useClassesStore } from "@/store";
import { EXAM_TYPES, examSections, examTypeLabels, type ExamType, type SabbaqClass } from "@/types";
import { toast } from "sonner";
import { useTranslation } from "@/utils/i18n";

export default function Onboarding() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [tab, setTab] = useState("classes");
  const { classes, addClass, updateClass, deleteClass } = useClassesStore();
  const defaultGroups = [
    t("auth.onboarding.groupAdvanced"),
    t("auth.onboarding.groupIntermediate"),
    t("auth.onboarding.groupNeedsSupport"),
  ];
  const [groups, setGroups] = useState<string[]>(defaultGroups);
  const [groupInput, setGroupInput] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [examType, setExamType] = useState<ExamType>("qudurat");
  const [section, setSection] = useState(examSections.qudurat[0]);
  const [description, setDescription] = useState("");

  function openCreate() {
    setEditingId(null);
    setExamType("qudurat");
    setSection(examSections.qudurat[0]);
    setDescription("");
    setModalOpen(true);
  }

  function openEdit(cls: SabbaqClass) {
    setEditingId(cls.id);
    setExamType(cls.examType);
    setSection(cls.section);
    setDescription(cls.description);
    setModalOpen(true);
  }

  function handleSave() {
    const name = `${examTypeLabels[examType].split(" (")[0]} - ${section}`;
    if (editingId) {
      updateClass(editingId, { name, examType, section, description });
      toast.success(t("auth.onboarding.toastClassUpdated"));
    } else {
      addClass({ name, examType, section, description, studentCount: 0 });
      toast.success(t("auth.onboarding.toastClassCreated"));
    }
    setModalOpen(false);
  }

  function addGroup() {
    if (!groupInput.trim()) return;
    setGroups((prev) => [...prev, groupInput.trim()]);
    setGroupInput("");
    toast.success(t("auth.onboarding.toastGroupAdded"));
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-extrabold">{t("auth.onboarding.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("auth.onboarding.subtitle")}</p>
      </div>

      <Tabs
        className="mb-6"
        value={tab}
        onChange={setTab}
        tabs={[
          { value: "classes", label: t("auth.onboarding.tabs.classesGroups"), icon: <LayoutGrid className="h-4 w-4" /> },
          { value: "benefits", label: t("auth.onboarding.tabs.benefits"), icon: <Sparkles className="h-4 w-4" /> },
        ]}
      />

      {tab === "classes" && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>{t("auth.onboarding.classesCardTitle")}</CardTitle>
                <CardDescription>{t("auth.onboarding.classesCardDesc")}</CardDescription>
              </div>
              <Button size="sm" className="gap-1" onClick={openCreate}>
                <Plus className="h-4 w-4" /> {t("auth.onboarding.createClass")}
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {classes.map((cls) => (
                <div key={cls.id} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{cls.name}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <ExamTypeBadge examType={cls.examType} />
                        <span className="text-xs text-muted-foreground">{t("classes.studentsCount", { count: cls.studentCount })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(cls)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => {
                        deleteClass(cls.id);
                        toast.success(t("auth.onboarding.toastClassDeleted"));
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("auth.onboarding.groupsCardTitle")}</CardTitle>
              <CardDescription>{t("auth.onboarding.groupsCardDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-3 flex flex-wrap gap-2">
                {groups.map((g) => (
                  <span key={g} className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                    {g}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={groupInput}
                  onChange={(e) => setGroupInput(e.target.value)}
                  placeholder={t("auth.onboarding.addGroupPlaceholder")}
                  onKeyDown={(e) => e.key === "Enter" && addGroup()}
                />
                <Button variant="outline" onClick={addGroup}>
                  {t("auth.onboarding.addGroup")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {tab === "benefits" && (
        <Card>
          <CardHeader>
            <CardTitle>{t("auth.onboarding.partnerTitle")}</CardTitle>
            <CardDescription>{t("auth.onboarding.contractPeriod")}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <BenefitRow label={t("auth.onboarding.includedStudents")} value="120" />
            <BenefitRow label={t("auth.onboarding.includedAssessments")} value={t("auth.onboarding.unlimited")} icon={<InfinityIcon className="h-4 w-4" />} />
            <BenefitRow label={t("auth.onboarding.aiQuestionGeneration")} value={t("auth.onboarding.included")} icon={<Check className="h-4 w-4" />} />
            <BenefitRow label={t("auth.onboarding.teacherDashboard")} value={t("auth.onboarding.included")} icon={<Check className="h-4 w-4" />} />
            <BenefitRow label={t("auth.onboarding.studyRooms")} value={t("auth.onboarding.included")} icon={<Check className="h-4 w-4" />} />
            <BenefitRow label={t("auth.onboarding.questionContribution")} value={t("auth.onboarding.included")} icon={<Check className="h-4 w-4" />} />
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-semibold">{t("auth.onboarding.supportedExams")}</p>
              <div className="flex gap-2">
                {EXAM_TYPES.map((t) => (
                  <ExamTypeBadge key={t} examType={t} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-8 flex justify-end">
        <Button className="gap-2" onClick={() => navigate("/dashboard")}>
          <Video className="h-4 w-4" /> {t("auth.onboarding.goToDashboard")}
        </Button>
      </div>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogHeader title={editingId ? t("auth.onboarding.dialogEditClass") : t("auth.onboarding.dialogCreateClass")} onClose={() => setModalOpen(false)} />
        <div className="space-y-4">
          <div>
            <Label>{t("common.examType")}</Label>
            <Select
              className="mt-1.5"
              value={examType}
              onChange={(e) => {
                const val = e.target.value as ExamType;
                setExamType(val);
                setSection(examSections[val][0]);
              }}
            >
              {EXAM_TYPES.map((type) => (
                <option key={type} value={type}>
                  {t(`enums.examType.${type}`)}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>{t("common.section")}</Label>
            <Select className="mt-1.5" value={section} onChange={(e) => setSection(e.target.value)}>
              {examSections[examType].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>{t("common.description")}</Label>
            <Input className="mt-1.5" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t("auth.onboarding.descriptionPlaceholder")} />
          </div>
          <Button className="w-full" onClick={handleSave}>
            {editingId ? t("common.saveChanges") : t("auth.onboarding.createClass")}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

function BenefitRow({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border p-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="flex items-center gap-1.5 text-sm font-bold text-success">
        {icon}
        {value}
      </span>
    </div>
  );
}
