import { useState } from "react";
import { Dialog, DialogHeader } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { useStudyRoomStore } from "@/store";
import type { ExamType } from "@/types";
import { toast } from "sonner";
import { useTranslation } from "@/utils/i18n";

export function QuestionPostCreator({
  open,
  onClose,
  roomId,
  examType,
}: {
  open: boolean;
  onClose: () => void;
  roomId: string;
  examType: ExamType;
}) {
  const { t } = useTranslation();
  const createQuestionPost = useStudyRoomStore((s) => s.createQuestionPost);
  const [prompt, setPrompt] = useState("");
  const [choices, setChoices] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);

  function reset() {
    setPrompt("");
    setChoices(["", "", "", ""]);
    setCorrectIndex(0);
  }

  function handleSubmit() {
    if (!prompt.trim() || choices.some((c) => !c.trim())) {
      toast.error(t("studyRooms.questionPost.toastFillChoices"));
      return;
    }
    const labels = ["A", "B", "C", "D"];
    createQuestionPost(roomId, {
      prompt,
      choices: choices.map((text, i) => ({ id: labels[i], label: labels[i], text })),
      correctChoiceId: labels[correctIndex],
    });
    toast.success(t("studyRooms.questionPost.toastPosted", { exam: t(`enums.examType.${examType}`) }));
    reset();
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader title={t("studyRooms.questionPost.title")} description={t("studyRooms.questionPost.desc")} onClose={onClose} />
      <div className="space-y-4">
        <div>
          <Label>{t("studyRooms.questionPost.questionLabel")}</Label>
          <Textarea className="mt-1.5" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder={t("studyRooms.questionPost.questionPlaceholder")} />
        </div>
        <div className="space-y-2">
          {choices.map((choice, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="radio"
                name="correctChoice"
                checked={correctIndex === i}
                onChange={() => setCorrectIndex(i)}
                className="h-4 w-4 text-primary"
              />
              <span className="w-6 text-sm font-bold">{["A", "B", "C", "D"][i]}</span>
              <Input
                value={choice}
                onChange={(e) =>
                  setChoices((prev) => prev.map((c, idx) => (idx === i ? e.target.value : c)))
                }
                placeholder={t("studyRooms.questionPost.choicePlaceholder", { label: ["A", "B", "C", "D"][i] })}
              />
            </div>
          ))}
        </div>
        <Button className="w-full" onClick={handleSubmit}>
          {t("studyRooms.questionPost.postQuestion")}
        </Button>
      </div>
    </Dialog>
  );
}
