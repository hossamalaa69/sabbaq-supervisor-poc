import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MessagesSquare, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select, Textarea, Checkbox } from "@/components/ui/Input";
import { Dialog, DialogHeader } from "@/components/ui/Dialog";
import { ExamTypeBadge } from "@/components/ExamTypeBadge";
import { OnlineCount } from "@/components/studyrooms/OnlineCount";
import { EmptyState } from "@/components/ui/EmptyState";
import { useStudyRoomStore, useClassesStore, useStudentsStore } from "@/store";
import { EXAM_TYPES, type ExamType } from "@/types";
import { toast } from "sonner";
import { useTranslation } from "@/utils/i18n";

export default function StudyRoomsList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const rooms = useStudyRoomStore((s) => s.rooms);
  const createRoom = useStudyRoomStore((s) => s.createRoom);
  const classes = useClassesStore((s) => s.classes);
  const students = useStudentsStore((s) => s.students);

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [examType, setExamType] = useState<ExamType>("qudurat");
  const [classId, setClassId] = useState(classes[0]?.id ?? "");
  const [description, setDescription] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const eligibleStudents = students.filter(
    (student) =>
      student.classId === classId && student.accessStatus !== "deactivated"
  );

  function resetForm() {
    setName("");
    setExamType("qudurat");
    setClassId(classes[0]?.id ?? "");
    setDescription("");
    setSelectedStudents([]);
  }

  function handleCreate() {
    if (!name.trim()) {
      toast.error(t("studyRooms.toastNameRequired"));
      return;
    }
    const room = createRoom({
      name,
      examType,
      classId,
      description,
      studentIds: selectedStudents.length ? selectedStudents : eligibleStudents.map((s) => s.id),
    });
    toast.success(t("studyRooms.toastCreated"));
    setModalOpen(false);
    resetForm();
    navigate(`/study-rooms/${room.id}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{t("studyRooms.subtitle")}</p>
        <Button className="gap-1.5" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" /> {t("studyRooms.createRoom")}
        </Button>
      </div>

      {rooms.length === 0 ? (
        <EmptyState icon={<MessagesSquare className="h-8 w-8" />} title={t("studyRooms.noRooms.title")} description={t("studyRooms.noRooms.desc")} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <button key={room.id} onClick={() => navigate(`/study-rooms/${room.id}`)} className="text-start">
              <Card className="h-full transition-shadow hover:shadow-popover">
                <CardContent className="pt-5">
                  <div className="mb-3 flex items-start justify-between">
                    <ExamTypeBadge examType={room.examType} />
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />{" "}
                      {
                        students.filter(
                          (student) =>
                            student.classId === room.classId &&
                            student.accessStatus !== "deactivated"
                        ).length
                      }
                    </span>
                  </div>
                  <h3 className="font-bold">{room.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{room.description}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span>{t("studyRooms.topicsCount", { count: room.topics.length })}</span>
                    <span>{t("studyRooms.messagesCount", { count: room.messages.length })}</span>
                    <OnlineCount
                      id={room.id}
                      total={
                        students.filter(
                          (student) =>
                            student.classId === room.classId &&
                            student.accessStatus !== "deactivated"
                        ).length
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      )}

      <Dialog open={modalOpen} onClose={() => { setModalOpen(false); resetForm(); }}>
        <DialogHeader title={t("studyRooms.dialogTitle")} description={t("studyRooms.dialogDesc")} onClose={() => { setModalOpen(false); resetForm(); }} />
        <div className="space-y-4">
          <div>
            <Label>{t("studyRooms.roomName")}</Label>
            <Input className="mt-1.5" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("studyRooms.roomNamePlaceholder")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{t("studyRooms.examType")}</Label>
              <Select
                className="mt-1.5"
                value={examType}
                onChange={(e) => {
                  const val = e.target.value as ExamType;
                  setExamType(val);
                  const firstClass = classes.find((c) => c.examType === val);
                  if (firstClass) setClassId(firstClass.id);
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
              <Label>{t("studyRooms.class")}</Label>
              <Select className="mt-1.5" value={classId} onChange={(e) => setClassId(e.target.value)}>
                {classes.filter((c) => c.examType === examType).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div>
            <Label>{t("common.description")}</Label>
            <Textarea className="mt-1.5" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t("studyRooms.descriptionPlaceholder")} />
          </div>
          <div>
            <Label>{t("studyRooms.studentsLabel")}</Label>
            <div className="mt-1.5 max-h-40 space-y-1 overflow-y-auto scrollbar-thin rounded-xl border border-border p-2">
              {eligibleStudents.map((s) => (
                <label key={s.id} className="flex items-center gap-2 rounded-lg px-1 py-1 text-sm">
                  <Checkbox
                    checked={selectedStudents.length === 0 || selectedStudents.includes(s.id)}
                    onChange={() =>
                      setSelectedStudents((prev) =>
                        prev.includes(s.id) ? prev.filter((id) => id !== s.id) : [...prev, s.id]
                      )
                    }
                  />
                  {s.name}
                </label>
              ))}
            </div>
          </div>
          <Button className="w-full" onClick={handleCreate}>
            {t("studyRooms.createRoomButton")}
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
