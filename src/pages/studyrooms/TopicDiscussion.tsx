import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { OnlineCount } from "@/components/studyrooms/OnlineCount";
import { VoiceNotePlayer, VoiceNoteRecorder } from "@/components/studyrooms/VoiceNote";
import { useStudyRoomStore, useStudentsStore, useNotificationsStore } from "@/store";
import type { StudyRoomVoiceNote } from "@/types";
import { cn } from "@/utils/cn";
import { formatTime } from "@/utils/format";
import { useTranslation } from "@/utils/i18n";
import { createDemoVoiceNote } from "@/utils/voiceNotes";
import { localizePersonName, localizeStudyRoomContent } from "@/utils/contentTranslations";

export default function TopicDiscussion() {
  const { t, lang } = useTranslation();
  const { id, topicId } = useParams();
  const navigate = useNavigate();
  const rooms = useStudyRoomStore((s) => s.rooms);
  const sendTopicMessage = useStudyRoomStore((s) => s.sendTopicMessage);
  const students = useStudentsStore((s) => s.students);
  const addNotification = useNotificationsStore((s) => s.addNotification);
  const [messageInput, setMessageInput] = useState("");

  const room = rooms.find((r) => r.id === id);
  const topic = room?.topics.find((t) => t.id === topicId);

  if (!room || !topic) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="font-semibold">{t("studyRooms.topic.notFound")}</p>
        <Button variant="outline" onClick={() => navigate(`/study-rooms/${id ?? ""}`)}>
          {t("studyRooms.topic.backToRoom")}
        </Button>
      </div>
    );
  }

  const participants = students.filter(
    (student) =>
      student.classId === room.classId && student.accessStatus !== "deactivated"
  );
  const displayRoom = localizeStudyRoomContent(room, lang);
  const displayTopic = displayRoom.topics.find((item) => item.id === topic.id) ?? topic;

  function handleSendVoiceNote(voiceNote: StudyRoomVoiceNote) {
    const currentRoom = room!;
    const currentTopic = topic!;
    sendTopicMessage(currentRoom.id, currentTopic.id, {
      authorId: "teacher",
      authorName: lang === "ar" ? "حسام علاء" : "Hossam Alaa",
      authorRole: "teacher",
      text: "",
      voiceNote,
    });

    const responder = participants[0];
    if (!responder) return;
    window.setTimeout(() => {
      useStudyRoomStore.getState().sendTopicMessage(currentRoom.id, currentTopic.id, {
        authorId: responder.id,
        authorName: localizePersonName(responder.name, lang),
        authorRole: "student",
        text: "",
        voiceNote: createDemoVoiceNote(3),
      });
      addNotification({
        category: "student",
        title: { en: "New voice note", ar: "رسالة صوتية جديدة" },
        message: {
          en: `${responder.name} replied with a voice note in ${currentTopic.title}.`,
          ar: `رد ${localizePersonName(responder.name, "ar")} برسالة صوتية في ${(localizeStudyRoomContent(currentRoom, "ar").topics.find((item) => item.id === currentTopic.id) ?? currentTopic).title}.`,
        },
        important: false,
        link: `/study-rooms/${currentRoom.id}/topics/${currentTopic.id}`,
      });
    }, 2500);
  }

  function handleSend() {
    if (!messageInput.trim()) return;
    sendTopicMessage(room!.id, topic!.id, {
      authorId: "teacher",
      authorName: lang === "ar" ? "حسام علاء" : "Hossam Alaa",
      authorRole: "teacher",
      text: messageInput,
    });
    setMessageInput("");
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => navigate(`/study-rooms/${room.id}`)}
        className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className={cn("h-4 w-4", lang === "ar" && "rotate-180")} /> {t("studyRooms.topic.backToNamedRoom", { room: displayRoom.name })}
      </button>

      <Card>
        <CardContent className="pt-5">
          <h2 className="text-lg font-bold">{displayTopic.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{displayTopic.description}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" /> {t("studyRooms.topic.participantsCount", { count: participants.length })}
            </p>
            <OnlineCount id={topic.id} total={participants.length} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-3 pt-5">
          <div className="flex min-h-[20rem] max-h-[28rem] flex-col gap-3 overflow-y-auto scrollbar-thin pe-1">
            {displayTopic.messages.length === 0 && (
              <p className="py-10 text-center text-sm text-muted-foreground">{t("studyRooms.topic.noMessages")}</p>
            )}
            {displayTopic.messages.map((msg) => (
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
              placeholder={t("studyRooms.topic.replyPlaceholder")}
            />
            <VoiceNoteRecorder onSend={handleSendVoiceNote} />
            <Button size="icon" onClick={handleSend} aria-label={t("studyRooms.topic.sendReplyAria")}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
