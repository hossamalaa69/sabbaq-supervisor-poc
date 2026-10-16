import { Check, Infinity as InfinityIcon, Mail, Phone, School, Users, Award } from "lucide-react";
import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { ExamTypeBadge } from "@/components/ExamTypeBadge";
import { useAuthStore } from "@/store";
import { EXAM_TYPES } from "@/types";
import { useTranslation } from "@/utils/i18n";

const statusVariant = {
  pending: "warning",
  under_review: "accent",
  approved: "success",
  rejected: "destructive",
  needs_info: "warning",
} as const;

export default function AccountPage() {
  const teacher = useAuthStore((s) => s.teacher);
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card>
        <CardContent className="flex flex-wrap items-center gap-5 pt-6">
          <Avatar name={teacher.name} size="lg" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold">{teacher.name}</h2>
              <Badge variant={statusVariant[teacher.b2bStatus]}>{t(`enums.b2bStatus.${teacher.b2bStatus}`)}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{teacher.role}</p>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Mail className="h-4 w-4" /> {teacher.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="h-4 w-4" /> {teacher.phone}
              </span>
              <span className="flex items-center gap-1.5">
                <School className="h-4 w-4" /> {teacher.school}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" /> {t("account.certificates")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {teacher.certificates.map((cert) => (
            <Badge key={cert} variant="secondary">
              {cert}
            </Badge>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("account.partnerTitle")}</CardTitle>
          <CardDescription>{t("account.contractPeriod")}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <BenefitRow label={t("account.includedStudents")} value={String(teacher.expectedStudents)} icon={<Users className="h-4 w-4" />} />
          <BenefitRow label={t("account.includedAssessments")} value={t("account.unlimited")} icon={<InfinityIcon className="h-4 w-4" />} />
          <BenefitRow label={t("account.aiQuestionGeneration")} value={t("account.included")} icon={<Check className="h-4 w-4" />} />
          <BenefitRow label={t("account.teacherDashboard")} value={t("account.included")} icon={<Check className="h-4 w-4" />} />
          <BenefitRow label={t("account.studyRooms")} value={t("account.included")} icon={<Check className="h-4 w-4" />} />
          <BenefitRow label={t("account.questionContribution")} value={t("account.included")} icon={<Check className="h-4 w-4" />} />
          <div className="sm:col-span-2">
            <p className="mb-2 text-sm font-semibold">{t("account.supportedExams")}</p>
            <div className="flex gap-2">
              {EXAM_TYPES.map((t) => (
                <ExamTypeBadge key={t} examType={t} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
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
