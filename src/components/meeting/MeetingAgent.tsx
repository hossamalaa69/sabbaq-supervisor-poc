import { useEffect, useMemo, useState } from "react";
import { Bot, Send, X, Sparkles, Video, Copy, Check } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Input";
import { type ExamType } from "@/types";
import { useClassesStore, useStudentsStore, useMeetingsStore, useMeetingAgentUiStore } from "@/store";
import { generateId } from "@/utils/format";
import { toast } from "sonner";
import { useTranslation } from "@/utils/i18n";

type Role = "agent" | "teacher";
interface ChatMessage {
  id: string;
  role: Role;
  text: string;
}

type Stage =
  | "chat"
  | "title"
  | "datetime"
  | "duration"
  | "participants-intro"
  | "participants-select"
  | "created";

interface Draft {
  title: string;
  examType: ExamType | null;
  classId: string | null;
  date: string;
  time: string;
  durationMinutes: number | null;
}

const emptyDraft: Draft = {
  title: "",
  examType: null,
  classId: null,
  date: "",
  time: "",
  durationMinutes: null,
};

function detectExamType(text: string): ExamType | null {
  const lower = text.toLowerCase();
  if (lower.includes("qudurat") || lower.includes("قدرات")) return "qudurat";
  if (lower.includes("tahsili") || lower.includes("تحصيلي")) return "tahsili";
  return null;
}

export function MeetingAgent() {
  const { t } = useTranslation();
  const open = useMeetingAgentUiStore((s) => s.isOpen);
  const setOpenStore = useMeetingAgentUiStore((s) => s.open);
  const closeStore = useMeetingAgentUiStore((s) => s.close);
  const consumePrefill = useMeetingAgentUiStore((s) => s.consumePrefill);
  const [stage, setStage] = useState<Stage>("chat");
  const [input, setInput] = useState("");
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [allSelected, setAllSelected] = useState(true);
  const [copied, setCopied] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      role: "agent",
      text: t("meetingAgent.welcomeMessage"),
    },
  ]);

  const classes = useClassesStore((s) => s.classes);
  const students = useStudentsStore((s) => s.students);
  const createMeeting = useMeetingsStore((s) => s.createMeeting);
  const createdMeeting = useMeetingsStore((s) => s.meetings[0]);

  const classStudents = useMemo(
    () =>
      draft.classId
        ? students.filter(
            (student) =>
              student.classId === draft.classId && student.accessStatus !== "deactivated"
          )
        : [],
    [draft.classId, students]
  );

  useEffect(() => {
    if (!open) return;
    const prefillClassId = consumePrefill();
    if (!prefillClassId) return;
    const cls = classes.find((c) => c.id === prefillClassId);
    if (!cls) return;
    setDraft((d) => ({ ...d, examType: cls.examType, classId: cls.id }));
    setMessages((m) => [
      ...m,
      {
        id: generateId("m"),
        role: "agent",
        text: t("meetingAgent.prefillMessage", { class: cls.name }),
      },
    ]);
    setStage("title");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function pushAgent(text: string) {
    setMessages((m) => [...m, { id: generateId("m"), role: "agent", text }]);
  }
  function pushTeacher(text: string) {
    setMessages((m) => [...m, { id: generateId("m"), role: "teacher", text }]);
  }

  function reset() {
    setStage("chat");
    setDraft(emptyDraft);
    setSelectedIds([]);
    setAllSelected(true);
    setMessages([
      {
        id: "init",
        role: "agent",
        text: t("meetingAgent.welcomeMessage"),
      },
    ]);
  }

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    pushTeacher(text);
    setInput("");

    if (stage === "chat") {
      const examType = detectExamType(text);
      const matchedClass = classes.find((c) => examType && c.examType === examType) ?? classes[0];
      setDraft((d) => ({ ...d, examType: examType ?? "qudurat", classId: matchedClass?.id ?? null }));
      setTimeout(() => {
        pushAgent(t("meetingAgent.askTitleResponse"));
        setStage("title");
      }, 400);
      return;
    }

    if (stage === "title") {
      setDraft((d) => ({ ...d, title: text }));
      setTimeout(() => {
        pushAgent(t("meetingAgent.askDatetimeResponse"));
        setStage("datetime");
      }, 400);
      return;
    }

    if (stage === "datetime") {
      setDraft((d) => ({ ...d, date: "8 October 2026", time: text.toLowerCase().includes("tomorrow") ? "7:00 PM" : text }));
      setTimeout(() => {
        pushAgent(t("meetingAgent.askDurationResponse"));
        setStage("duration");
      }, 400);
      return;
    }

    if (stage === "duration") {
      const minutesMatch = text.match(/\d+/);
      const minutes = minutesMatch ? parseInt(minutesMatch[0], 10) : 60;
      setDraft((d) => ({ ...d, durationMinutes: minutes }));
      setTimeout(() => {
        pushAgent(t("meetingAgent.askParticipantsResponse"));
        setStage("participants-intro");
      }, 400);
      return;
    }

    if (stage === "participants-intro") {
      setTimeout(() => {
        pushAgent(t("meetingAgent.confirmAttendeesResponse"));
        setSelectedIds(classStudents.map((s) => s.id));
        setAllSelected(true);
        setStage("participants-select");
      }, 400);
    }
  }

  function toggleAll() {
    const next = !allSelected;
    setAllSelected(next);
    setSelectedIds(next ? classStudents.map((s) => s.id) : []);
  }

  function toggleStudent(id: string) {
    setSelectedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      setAllSelected(next.length === classStudents.length);
      return next;
    });
  }

  function handleConfirmMeeting() {
    if (!draft.examType) return;
    createMeeting({
      title: draft.title || "Revision Meeting",
      examType: draft.examType,
      date: draft.date || "8 October 2026",
      time: draft.time || "7:00 PM",
      durationMinutes: draft.durationMinutes ?? 60,
      participantCount: selectedIds.length,
    });
    setStage("created");
    toast.success(t("meetingAgent.toastCreated"));
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpenStore()}
        className="fixed bottom-20 start-4 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-brand-gradient text-white shadow-glow transition-transform hover:scale-105"
        aria-label={t("meetingAgent.openAria")}
        title={t("meetingAgent.title")}
      >
        <Bot className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 start-4 z-[60] flex w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-border bg-popover shadow-popover animate-fade-in">
      <div className="flex items-center justify-between gap-2 bg-brand-gradient px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <p className="text-sm font-bold">{t("meetingAgent.title")}</p>
        </div>
        <button
          onClick={() => closeStore()}
          className="rounded-lg p-1 hover:bg-white/20"
          aria-label={t("meetingAgent.closeAria")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="max-h-96 flex-1 space-y-3 overflow-y-auto scrollbar-thin px-4 py-3">
        {messages.map((m) => (
          <div key={m.id} className={cn("flex", m.role === "teacher" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[85%] rounded-xl px-3 py-2 text-sm",
                m.role === "teacher" ? "ms-auto bg-primary text-primary-foreground" : "me-auto bg-muted text-foreground"
              )}
            >
              {m.text}
            </div>
          </div>
        ))}

        {stage === "participants-select" && (
          <div className="rounded-xl border border-border p-3">
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <Checkbox checked={allSelected} onChange={toggleAll} />
              {t("meetingAgent.allStudents", { count: classStudents.length })}
            </label>
            <div className="max-h-40 space-y-1 overflow-y-auto scrollbar-thin ps-1">
              {classStudents.map((s) => (
                <label key={s.id} className="flex items-center gap-2 text-sm">
                  <Checkbox checked={selectedIds.includes(s.id)} onChange={() => toggleStudent(s.id)} />
                  {s.name}
                </label>
              ))}
            </div>
            <Button className="mt-3 w-full" size="sm" onClick={handleConfirmMeeting}>
              {t("meetingAgent.confirmCreate")}
            </Button>
          </div>
        )}

        {stage === "created" && createdMeeting && (
          <div className="rounded-xl border border-success/30 bg-success/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-success">
              <Video className="h-5 w-5" />
              <p className="font-bold">{t("meetingAgent.created.title")}</p>
            </div>
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t("meetingAgent.created.titleField")}</dt>
                <dd className="font-medium">{createdMeeting.title}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t("meetingAgent.created.examType")}</dt>
                <dd className="font-medium">{t(`enums.examType.${createdMeeting.examType}`)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t("meetingAgent.created.date")}</dt>
                <dd className="font-medium">{createdMeeting.date}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t("meetingAgent.created.time")}</dt>
                <dd className="font-medium">{createdMeeting.time}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t("meetingAgent.created.duration")}</dt>
                <dd className="font-medium">{t("meetingAgent.created.durationValue", { count: createdMeeting.durationMinutes })}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t("meetingAgent.created.participants")}</dt>
                <dd className="font-medium">{t("meetingAgent.created.participantsValue", { count: createdMeeting.participantCount })}</dd>
              </div>
            </dl>
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-background px-3 py-2 text-xs">
              <span className="truncate text-muted-foreground">{createdMeeting.meetLink}</span>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(createdMeeting.meetLink);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className="shrink-0 text-primary"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
            <div className="mt-3 flex gap-2">
              <Button className="flex-1" size="sm" onClick={() => window.open(createdMeeting.meetLink, "_blank")}>
                {t("meetingAgent.joinMeeting")}
              </Button>
              <Button variant="outline" size="sm" className="flex-1" onClick={reset}>
                {t("meetingAgent.newMeeting")}
              </Button>
            </div>
          </div>
        )}
      </div>

      {stage !== "participants-select" && stage !== "created" && (
        <div className="flex items-center gap-2 border-t border-border p-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={t("meetingAgent.inputPlaceholder")}
            className="h-10 flex-1 rounded-xl border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <Button size="icon" onClick={handleSend} aria-label={t("meetingAgent.sendAria")}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
