import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Plus, Users, MessageCircle, ListChecks, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Tabs } from "@/components/ui/Tabs";
import { Avatar } from "@/components/ui/Avatar";
import { Dialog, DialogHeader } from "@/components/ui/Dialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ExamTypeBadge } from "@/components/ExamTypeBadge";
import { QuestionPostCreator } from "@/components/studyrooms/QuestionPostCreator";
import { QuestionPostCard } from "@/components/studyrooms/QuestionPostCard";
import { OnlineCount } from "@/components/studyrooms/OnlineCount";
import { VoiceNotePlayer, VoiceNoteRecorder } from "@/components/studyrooms/VoiceNote";
import { useStudyRoomStore, useStudentsStore, useMeetingAgentUiStore, useNotificationsStore } from "@/store";
import { studyRoomTopicsByExam, type StudyRoomVoiceNote } from "@/types";
import { cn } from "@/utils/cn";
import { formatTime } from "@/utils/format";
import { createDemoVoiceNote } from "@/utils/voiceNotes";
import { toast } from "sonner";
import { useTranslation } from "@/utils/i18n";

type TabValue = "chat" | "topics" | "questions";

export default function StudyRoomDetail() {
  const { t, lang } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const rooms = useStudyRoomStore((s) => s.rooms);
  const sendMessage = useStudyRoomStore((s) => s.sendMessage);
  const createTopic = useStudyRoomStore((s) => s.createTopic);
  const students = useStudentsStore((s) => s.students);
  const openMeetingAgent = useMeetingAgentUiStore((s) => s.open);
  const addNotification = useNotificationsStore((s) => s.addNotification);

  const room = rooms.find((r) => r.id === id);
  const [tab, setTab] = useState<TabValue>("chat");
  const [messageInput, setMessageInput] = useState("");
  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [topicTitle, setTopicTitle] = useState("");
  const [topicDescription, setTopicDescription] = useState("");
  const [questionModalOpen, setQuestionModalOpen] = useState(false);

  if (!room) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="font-semibold">{t("studyRooms.detail.notFound")}</p>
        <Button variant="outline" onClick={() => navigate("/study-rooms")}>
          {t("studyRooms.detail.backToStudyRooms")}
        </Button>
      </div>
    );
  }

  const participants = students.filter(
    (student) =>
      student.classId === room.classId && student.accessStatus !== "deactivated"
  );
  const suggestedTopics = studyRoomTopicsByExam[room.examType].filter(
    (t) => !room.topics.some((existing) => existing.title === t)
  );

  function handleSend() {
    if (!messageInput.trim()) return;
    sendMessage(room!.id, { authorId: "teacher", authorName: "Hossam Alaa", authorRole: "teacher", text: messageInput });
    setMessageInput("");
  }

  function handleSendVoiceNote(voiceNote: StudyRoomVoiceNote) {
    const currentRoom = room!;
    sendMessage(currentRoom.id, {
      authorId: "teacher",
      authorName: "Hossam Alaa",
      authorRole: "teacher",
      text: "",
      voiceNote,
    });

    const responder = participants[0];
    if (!responder) return;
    window.setTimeout(() => {
      useStudyRoomStore.getState().sendMessage(currentRoom.id, {
        authorId: responder.id,
        authorName: responder.name,
        authorRole: "student",
        text: "",
        voiceNote: createDemoVoiceNote(3),
      });
      addNotification({
        category: "student",
        title: { en: "New voice note", ar: "رسالة صوتية جديدة" },
        message: {
          en: `${responder.name} replied with a voice note in ${currentRoom.name}.`,
          ar: `رد ${responder.name} برسالة صوتية في ${currentRoom.name}.`,
        },
        important: false,
        link: `/study-rooms/${currentRoom.id}`,
      });
    }, 2500);
  }

  function handleCreateTopic(presetTitle?: string) {
    const title = presetTitle ?? topicTitle;
    if (!title.trim()) {
      toast.error(t("studyRooms.detail.toastTopicTitleRequired"));
      return;
    }
    createTopic(room!.id, { title, description: topicDescription || `Discussion about ${title}.` });
    toast.success(t("studyRooms.detail.toastTopicCreated"));
    setTopicModalOpen(false);
    setTopicTitle("");
    setTopicDescription("");
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => navigate("/study-rooms")}
        className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className={cn("h-4 w-4", lang === "ar" && "rotate-180")} /> {t("studyRooms.detail.backToStudyRooms")}
      </button>

      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-5">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <h2 className="text-lg font-bold">{room.name}</h2>
              <ExamTypeBadge examType={room.examType} />
            </div>
            <p className="text-sm text-muted-foreground">{room.description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <OnlineCount id={room.id} total={participants.length} />
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="h-4 w-4" /> {t("studyRooms.detail.studentsCount", { count: participants.length })}
            </span>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => openMeetingAgent(room.classId)}>
              <Video className="h-3.5 w-3.5" /> {t("studyRooms.detail.scheduleMeeting")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs
        value={tab}
        onChange={(v) => setTab(v as TabValue)}
        tabs={[
          { value: "chat", label: t("studyRooms.detail.tabs.groupChat"), icon: <MessageCircle className="h-4 w-4" />, count: room.messages.length },
          { value: "topics", label: t("studyRooms.detail.tabs.topics"), icon: <ListChecks className="h-4 w-4" />, count: room.topics.length },
          { value: "questions", label: t("studyRooms.detail.tabs.questionPosts"), icon: <Plus className="h-4 w-4" />, count: room.questionPosts.length },
        ]}
      />

      {tab === "chat" && (
        <Card>
          <CardContent className="flex flex-col gap-3 pt-5">
            <div className="flex max-h-[28rem] min-h-[20rem] flex-col gap-3 overflow-y-auto scrollbar-thin pe-1">
              {room.messages.map((msg) => (
                <div key={msg.id} className={cn("flex gap-2", msg.authorRole === "teacher" && "flex-row-reverse")}>
                  <Avatar name={msg.authorName} size="sm" color={msg.authorRole === "teacher" ? "#4C44E4" : "#8155E7"} />
                  <div className={cn("max-w-[75%] rounded-xl px-3 py-2 text-sm", msg.authorRole === "teacher" ? "bg-primary text-primary-foreground" : "bg-muted")}>
                    <p className={cn("mb-0.5 text-xs font-semibold", msg.authorRole === "teacher" ? "text-primary-foreground/80" : "text-muted-foreground")}>
                      {msg.authorName}
                    </p>
                    {msg.voiceNote ? (
                      <VoiceNotePlayer voiceNote={msg.voiceNote} inverted={msg.authorRole === "teacher"} />
                    ) : (
                      <p>{msg.text}</p>
                    )}
                    <p className={cn("mt-1 text-[10px]", msg.authorRole === "teacher" ? "text-primary-foreground/70" : "text-muted-foreground")}>
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={t("studyRooms.detail.messagePlaceholder")}
              />
              <VoiceNoteRecorder onSend={handleSendVoiceNote} />
              <Button size="icon" onClick={handleSend} aria-label={t("studyRooms.detail.sendMessageAria")}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {tab === "topics" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{t("studyRooms.detail.topicsSubtitle")}</p>
            <Button size="sm" className="gap-1.5" onClick={() => setTopicModalOpen(true)}>
              <Plus className="h-4 w-4" /> {t("studyRooms.detail.createTopic")}
            </Button>
          </div>

          {room.topics.length === 0 ? (
            <EmptyState icon={<ListChecks className="h-8 w-8" />} title={t("studyRooms.detail.noTopics.title")} description={t("studyRooms.detail.noTopics.desc")} />
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {room.topics.map((topic) => (
                <button key={topic.id} onClick={() => navigate(`/study-rooms/${room.id}/topics/${topic.id}`)} className="text-start">
                  <Card className="h-full transition-shadow hover:shadow-popover">
                    <CardContent className="pt-4">
                      <p className="font-semibold">{topic.title}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{topic.description}</p>
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs text-muted-foreground">{t("studyRooms.detail.topicMessagesCount", { count: topic.messages.length })}</p>
                        <OnlineCount id={topic.id} total={participants.length} />
                      </div>
                    </CardContent>
                  </Card>
                </button>
              ))}
            </div>
          )}

          {suggestedTopics.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">{t("studyRooms.detail.suggestedTopicsFor", { exam: t(`enums.examType.${room.examType}`) })}</p>
              <div className="flex flex-wrap gap-2">
                {suggestedTopics.map((t) => (
                  <button
                    key={t}
                    onClick={() => handleCreateTopic(t)}
                    className="rounded-full border border-dashed border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:border-primary hover:text-primary"
                  >
                    + {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "questions" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{t("studyRooms.detail.questionsSubtitle")}</p>
            <Button size="sm" className="gap-1.5" onClick={() => setQuestionModalOpen(true)}>
              <Plus className="h-4 w-4" /> {t("studyRooms.detail.newQuestionPost")}
            </Button>
          </div>
          {room.questionPosts.length === 0 ? (
            <EmptyState icon={<Plus className="h-8 w-8" />} title={t("studyRooms.detail.noQuestionPosts.title")} description={t("studyRooms.detail.noQuestionPosts.desc")} />
          ) : (
            <div className="space-y-3">
              {room.questionPosts.map((post) => (
                <QuestionPostCard key={post.id} post={post} totalStudents={participants.length} />
              ))}
            </div>
          )}
        </div>
      )}

      <Dialog open={topicModalOpen} onClose={() => setTopicModalOpen(false)}>
        <DialogHeader title={t("studyRooms.detail.createTopicDialogTitle")} onClose={() => setTopicModalOpen(false)} />
        <div className="space-y-4">
          <div>
            <Label>{t("common.title")}</Label>
            <Input className="mt-1.5" value={topicTitle} onChange={(e) => setTopicTitle(e.target.value)} placeholder={t("studyRooms.detail.topicTitlePlaceholder")} />
          </div>
          <div>
            <Label>{t("common.description")}</Label>
            <Textarea className="mt-1.5" value={topicDescription} onChange={(e) => setTopicDescription(e.target.value)} placeholder={t("studyRooms.detail.topicDescriptionPlaceholder")} />
          </div>
          <Button className="w-full" onClick={() => handleCreateTopic()}>
            {t("studyRooms.detail.createTopic")}
          </Button>
        </div>
      </Dialog>

      <QuestionPostCreator
        open={questionModalOpen}
        onClose={() => setQuestionModalOpen(false)}
        roomId={room.id}
        examType={room.examType}
      />
    </div>
  );
}
