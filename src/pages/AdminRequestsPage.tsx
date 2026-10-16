import { useState } from "react";
import { MessageSquareText, Send, ShieldCheck, Clock3 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select, Textarea } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAdminRequestsStore } from "@/store";
import type { AdminRequestCategory, AdminRequestKind, AdminRequestStatus } from "@/types";
import { formatDate } from "@/utils/format";
import { useTranslation } from "@/utils/i18n";

const statusVariant: Record<AdminRequestStatus, "default" | "warning" | "success" | "destructive"> = {
  submitted: "default",
  inReview: "warning",
  resolved: "success",
  rejected: "destructive",
};

export default function AdminRequestsPage() {
  const { t, lang } = useTranslation();
  const { requests, submitRequest, simulateAdminResponse } = useAdminRequestsStore();
  const [kind, setKind] = useState<AdminRequestKind>("request");
  const [category, setCategory] = useState<AdminRequestCategory>("technical");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit() {
    if (!subject.trim() || !message.trim()) {
      toast.error(t("adminRequests.validation"));
      return;
    }
    submitRequest({ kind, category, subject: subject.trim(), message: message.trim() });
    setSubject("");
    setMessage("");
    toast.success(t("adminRequests.toastSubmitted"));
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[24rem_1fr]">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>{t("adminRequests.newTitle")}</CardTitle>
          <CardDescription>{t("adminRequests.newDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>{t("adminRequests.kind")}</Label>
            <Select className="mt-1.5" value={kind} onChange={(e) => setKind(e.target.value as AdminRequestKind)}>
              <option value="request">{t("adminRequests.kinds.request")}</option>
              <option value="feedback">{t("adminRequests.kinds.feedback")}</option>
            </Select>
          </div>
          <div>
            <Label>{t("adminRequests.category")}</Label>
            <Select
              className="mt-1.5"
              value={category}
              onChange={(e) => setCategory(e.target.value as AdminRequestCategory)}
            >
              {(["technical", "account", "content", "students", "other"] as AdminRequestCategory[]).map((item) => (
                <option key={item} value={item}>
                  {t(`adminRequests.categories.${item}`)}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>{t("adminRequests.subject")}</Label>
            <Input
              className="mt-1.5"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t("adminRequests.subjectPlaceholder")}
            />
          </div>
          <div>
            <Label>{t("adminRequests.message")}</Label>
            <Textarea
              className="mt-1.5 min-h-32"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("adminRequests.messagePlaceholder")}
            />
          </div>
          <Button className="w-full" onClick={handleSubmit}>
            <Send className="h-4 w-4" /> {t("adminRequests.submit")}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <div>
          <h2 className="font-bold">{t("adminRequests.historyTitle")}</h2>
          <p className="text-sm text-muted-foreground">{t("adminRequests.historyDesc")}</p>
        </div>

        {requests.length === 0 ? (
          <EmptyState
            icon={<MessageSquareText className="h-8 w-8" />}
            title={t("adminRequests.emptyTitle")}
            description={t("adminRequests.emptyDesc")}
          />
        ) : (
          requests.map((request) => (
            <Card key={request.id}>
              <CardContent className="space-y-4 pt-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p dir="auto" className="font-bold">{request.subject}</p>
                      <Badge variant={statusVariant[request.status]}>
                        {t(`adminRequests.statuses.${request.status}`)}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t(`adminRequests.kinds.${request.kind}`)} · {t(`adminRequests.categories.${request.category}`)} ·{" "}
                      {t("adminRequests.updated", { date: formatDate(request.updatedAt, lang) })}
                    </p>
                  </div>
                  {(request.status === "submitted" || request.status === "inReview") && (
                    <Button variant="outline" size="sm" onClick={() => simulateAdminResponse(request.id)}>
                      <ShieldCheck className="h-4 w-4" /> {t("adminRequests.simulateResponse")}
                    </Button>
                  )}
                </div>

                <p dir="auto" className="rounded-xl bg-muted/50 p-3 text-sm">{request.message}</p>

                {request.responses.length > 0 ? (
                  <div className="space-y-2">
                    {request.responses.map((response) => (
                      <div key={response.id} className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm">
                        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
                          <p className="font-semibold">{response.author[lang]}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(response.createdAt, lang)}</p>
                        </div>
                        <p>{response.message[lang]}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock3 className="h-4 w-4" /> {t("adminRequests.awaitingResponse")}
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
