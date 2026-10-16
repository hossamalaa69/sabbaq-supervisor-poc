import { useMemo, useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";
import { Dialog, DialogHeader } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import { useClassesStore } from "@/store";
import { toast } from "sonner";
import { useTranslation } from "@/utils/i18n";
import { localizeClassContent } from "@/utils/contentTranslations";

export function InviteStudentsModal({
  open,
  onClose,
  defaultClassId,
}: {
  open: boolean;
  onClose: () => void;
  defaultClassId?: string;
}) {
  const { t, lang } = useTranslation();
  const classes = useClassesStore((s) => s.classes);
  const [classId, setClassId] = useState(defaultClassId ?? classes[0]?.id ?? "");
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const selectedClass = classes.find((c) => c.id === classId) ?? classes[0];

  const code = useMemo(() => {
    if (!selectedClass) return "SBQ-000-0000";
    const prefix = selectedClass.examType === "qudurat" ? "QDR" : "TAH";
    const hash = Math.abs(
      selectedClass.id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
    );
    return `SBQ-${prefix}-${(4000 + (hash % 5000)).toString().slice(0, 4)}`;
  }, [selectedClass]);

  const link = `sabbaqai.com/join/${code}`;

  function copy(text: string, which: "code" | "link") {
    navigator.clipboard?.writeText(text);
    if (which === "code") {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 1500);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 1500);
    }
    toast.success(t("invite.toastCopied"));
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader
        title={t("invite.title")}
        description={t("invite.desc")}
        onClose={onClose}
      />
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">{t("invite.classLabel")}</label>
          <Select value={classId} onChange={(e) => setClassId(e.target.value)}>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {localizeClassContent(c, lang).name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">{t("invite.invitationCode")}</label>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
            <span className="flex-1 font-mono text-sm font-semibold">{code}</span>
            <button onClick={() => copy(code, "code")} className="text-primary">
              {copiedCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">{t("invite.invitationLink")}</label>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
            <span className="flex-1 truncate text-sm text-muted-foreground">{link}</span>
            <button onClick={() => copy(link, "link")} className="text-primary">
              {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button
          className="w-full gap-2"
          onClick={() => toast.success(t("invite.toastShared"))}
        >
          <Share2 className="h-4 w-4" /> {t("invite.shareInvitation")}
        </Button>
      </div>
    </Dialog>
  );
}
