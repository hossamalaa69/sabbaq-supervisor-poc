import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select, Checkbox } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { FileDropzone, UploadedFileRow, type FakeUploadedFile } from "@/components/FileDropzone";
import { EXAM_TYPES, type ExamType } from "@/types";
import { useAuthStore } from "@/store";
import { cn } from "@/utils/cn";
import { toast } from "sonner";
import { useTranslation } from "@/utils/i18n";

export default function Signup() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const submitB2BRequest = useAuthStore((s) => s.submitB2BRequest);
  const [step, setStep] = useState(0);
  const steps = [
    t("auth.signup.steps.account"),
    t("auth.signup.steps.teachingProfile"),
    t("auth.signup.steps.certification"),
    t("auth.signup.steps.review"),
  ];

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [school, setSchool] = useState("");
  const [teacherRole, setTeacherRole] = useState("");
  const [subjects, setSubjects] = useState("");
  const [expectedStudents, setExpectedStudents] = useState("60");
  const [examTypes, setExamTypes] = useState<ExamType[]>(["qudurat"]);

  const [certificates, setCertificates] = useState<string[]>([]);
  const [certInput, setCertInput] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseExpiry, setLicenseExpiry] = useState("");
  const [documents, setDocuments] = useState<FakeUploadedFile[]>([]);

  function toggleExamType(type: ExamType) {
    setExamTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
  }

  function addCertificate() {
    if (!certInput.trim()) return;
    setCertificates((prev) => [...prev, certInput.trim()]);
    setCertInput("");
  }

  function isStepValid(): boolean {
    if (step === 0) return !!(fullName && email && phone && password);
    if (step === 1) return !!(school && teacherRole && examTypes.length > 0);
    if (step === 2) return true;
    return true;
  }

  function handleNext() {
    if (!isStepValid()) {
      toast.error(t("auth.signup.toastFillRequired"));
      return;
    }
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function handleSubmit() {
    submitB2BRequest();
    toast.success(t("auth.signup.toastSubmitted"));
    navigate("/b2b-status");
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-extrabold">{t("auth.signup.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("auth.signup.subtitle")}</p>
      </div>

      <div className="mb-8 flex items-center justify-between">
        {steps.map((label, i) => (
          <div key={label} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors",
                  i < step
                    ? "bg-success text-success-foreground"
                    : i === step
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                )}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className={cn("text-xs font-medium", i === step ? "text-foreground" : "text-muted-foreground")}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn("mx-2 h-0.5 flex-1", i < step ? "bg-success" : "bg-muted")} />
            )}
          </div>
        ))}
      </div>

      <Card className="p-6">
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <Label>{t("auth.signup.fullName")}</Label>
              <Input className="mt-1.5" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={t("auth.signup.fullNamePlaceholder")} />
            </div>
            <div>
              <Label>{t("auth.signup.email")}</Label>
              <Input className="mt-1.5" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("auth.signup.emailPlaceholder")} />
            </div>
            <div>
              <Label>{t("auth.signup.phone")}</Label>
              <Input className="mt-1.5" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t("auth.signup.phonePlaceholder")} />
            </div>
            <div>
              <Label>{t("auth.signup.password")}</Label>
              <Input className="mt-1.5" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("auth.signup.passwordPlaceholder")} />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label>{t("auth.signup.school")}</Label>
              <Input className="mt-1.5" value={school} onChange={(e) => setSchool(e.target.value)} placeholder={t("auth.signup.schoolPlaceholder")} />
            </div>
            <div>
              <Label>{t("auth.signup.teacherRole")}</Label>
              <Input className="mt-1.5" value={teacherRole} onChange={(e) => setTeacherRole(e.target.value)} placeholder={t("auth.signup.teacherRolePlaceholder")} />
            </div>
            <div>
              <Label>{t("auth.signup.subjectsTaught")}</Label>
              <Input className="mt-1.5" value={subjects} onChange={(e) => setSubjects(e.target.value)} placeholder={t("auth.signup.subjectsPlaceholder")} />
            </div>
            <div>
              <Label>{t("auth.signup.expectedStudents")}</Label>
              <Input
                className="mt-1.5"
                type="number"
                value={expectedStudents}
                onChange={(e) => setExpectedStudents(e.target.value)}
              />
            </div>
            <div>
              <Label>{t("auth.signup.examTypesTaught")}</Label>
              <div className="mt-2 space-y-2">
                {EXAM_TYPES.map((type) => (
                  <label
                    key={type}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3",
                      examTypes.includes(type) ? "border-primary bg-primary/5" : "border-border"
                    )}
                  >
                    <Checkbox checked={examTypes.includes(type)} onChange={() => toggleExamType(type)} />
                    <span className="text-sm font-semibold">{t(`enums.examType.${type}`)}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <Label>{t("auth.signup.certificates")}</Label>
              <div className="mt-1.5 flex gap-2">
                <Input
                  value={certInput}
                  onChange={(e) => setCertInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCertificate())}
                  placeholder={t("auth.signup.certificatePlaceholder")}
                />
                <Button type="button" variant="outline" size="icon" onClick={addCertificate}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {certificates.map((cert, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                  >
                    {cert}
                    <button onClick={() => setCertificates((prev) => prev.filter((_, idx) => idx !== i))}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label>{t("auth.signup.licenseNumber")}</Label>
                <Input className="mt-1.5" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} placeholder={t("auth.signup.licenseNumberPlaceholder")} />
              </div>
              <div>
                <Label>{t("auth.signup.licenseExpiry")}</Label>
                <Input className="mt-1.5" type="date" value={licenseExpiry} onChange={(e) => setLicenseExpiry(e.target.value)} />
              </div>
            </div>
            <div>
              <Label>{t("auth.signup.supportingDocuments")}</Label>
              <div className="mt-1.5">
                <FileDropzone
                  hint={t("auth.signup.supportingDocumentsHint")}
                  onFilesAdded={(files) => setDocuments((prev) => [...prev, ...files])}
                />
              </div>
              {documents.length > 0 && (
                <div className="mt-2 space-y-2">
                  {documents.map((doc) => (
                    <UploadedFileRow
                      key={doc.id}
                      file={doc}
                      onRemove={() => setDocuments((prev) => prev.filter((d) => d.id !== doc.id))}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <ReviewRow label={t("auth.signup.review.fullName")} value={fullName || t("common.dash")} />
            <ReviewRow label={t("auth.signup.review.email")} value={email || t("common.dash")} />
            <ReviewRow label={t("auth.signup.review.phone")} value={phone || t("common.dash")} />
            <ReviewRow label={t("auth.signup.review.school")} value={school || t("common.dash")} />
            <ReviewRow label={t("auth.signup.review.teacherRole")} value={teacherRole || t("common.dash")} />
            <ReviewRow label={t("auth.signup.review.expectedStudents")} value={expectedStudents} />
            <ReviewRow label={t("auth.signup.review.examTypes")} value={examTypes.map((et) => t(`enums.examType.${et}`)).join(", ") || t("common.dash")} />
            <ReviewRow label={t("auth.signup.review.certificates")} value={certificates.join(", ") || t("common.dash")} />
            <ReviewRow label={t("auth.signup.review.licenseNumber")} value={licenseNumber || t("common.dash")} />
            <ReviewRow label={t("auth.signup.review.supportingDocuments")} value={t("auth.signup.review.documentsAttached", { count: documents.length })} />
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep((s) => Math.max(s - 1, 0))}
            disabled={step === 0}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4 rtl:rotate-180" /> {t("auth.signup.back")}
          </Button>
          {step < steps.length - 1 ? (
            <Button type="button" onClick={handleNext} className="gap-1">
              {t("auth.signup.next")} <ChevronRight className="h-4 w-4 rtl:rotate-180" />
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit}>
              {t("auth.signup.submitRequest")}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
