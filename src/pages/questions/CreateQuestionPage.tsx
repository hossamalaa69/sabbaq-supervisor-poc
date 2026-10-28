import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Eye, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select, Textarea } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ExamTypeBadge } from "@/components/ExamTypeBadge";
import { useQuestionsStore } from "@/store";
import { EXAM_TYPES, examSections, type ExamType, type QuestionDifficulty, type QuestionType } from "@/types";
import { toast } from "sonner";
import { useTranslation } from "@/utils/i18n";
import { localizeChoiceLabel } from "@/utils/contentTranslations";

const difficulties: QuestionDifficulty[] = ["Easy", "Medium", "Hard"];
const questionTypes: QuestionType[] = ["Multiple Choice", "True/False"];

export default function CreateQuestionPage() {
  const navigate = useNavigate();
  const { t, lang } = useTranslation();
  const addQuestion = useQuestionsStore((s) => s.addQuestion);

  const [examType, setExamType] = useState<ExamType>("qudurat");
  const [section, setSection] = useState(examSections.qudurat[0]);
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<QuestionDifficulty>("Medium");
  const [type, setType] = useState<QuestionType>("Multiple Choice");
  const [prompt, setPrompt] = useState("");
  const [choices, setChoices] = useState([
    { id: "A", label: "A", text: "" },
    { id: "B", label: "B", text: "" },
    { id: "C", label: "C", text: "" },
    { id: "D", label: "D", text: "" },
  ]);
  const [correctChoiceId, setCorrectChoiceId] = useState("A");
  const [explanation, setExplanation] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  function handleTypeChange(t: QuestionType) {
    setType(t);
    if (t === "True/False") {
      setChoices([
        { id: "A", label: "True", text: "True" },
        { id: "B", label: "False", text: "False" },
      ]);
      setCorrectChoiceId("A");
    } else {
      setChoices([
        { id: "A", label: "A", text: "" },
        { id: "B", label: "B", text: "" },
        { id: "C", label: "C", text: "" },
        { id: "D", label: "D", text: "" },
      ]);
      setCorrectChoiceId("A");
    }
  }

  function addChoice() {
    const nextLabel = String.fromCharCode(65 + choices.length);
    setChoices((prev) => [...prev, { id: nextLabel, label: nextLabel, text: "" }]);
  }

  function removeChoice(id: string) {
    if (choices.length <= 2) return;
    setChoices((prev) => prev.filter((c) => c.id !== id));
    if (correctChoiceId === id) setCorrectChoiceId(choices[0].id);
  }

  function updateChoiceText(id: string, text: string) {
    setChoices((prev) => prev.map((c) => (c.id === id ? { ...c, text } : c)));
  }

  function isValid(): boolean {
    if (!topic.trim() || !prompt.trim() || !explanation.trim()) return false;
    if (choices.some((c) => !c.text.trim())) return false;
    return true;
  }

  function handleSave() {
    if (!isValid()) {
      toast.error(t("questions.create.toastFillRequired"));
      return;
    }
    addQuestion({
      examType,
      section,
      topic,
      difficulty,
      type,
      prompt,
      choices,
      correctChoiceId,
      explanation,
    });
    toast.success(t("questions.create.toastCreated"));
    navigate("/questions");
  }

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>{t("questions.create.title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{t("questions.create.examType")}</Label>
              <Select
                className="mt-1.5"
                value={examType}
                onChange={(e) => {
                  const val = e.target.value as ExamType;
                  setExamType(val);
                  setSection(examSections[val][0]);
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
              <Label>{t("questions.create.subjectSection")}</Label>
              <Select className="mt-1.5" value={section} onChange={(e) => setSection(e.target.value)}>
                {examSections[examType].map((s) => (
                  <option key={s} value={s}>
                    {t(`enums.subject.${s}`)}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <Label>{t("questions.create.topic")}</Label>
            <Input className="mt-1.5" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={t("questions.create.topicPlaceholder")} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>{t("questions.create.difficulty")}</Label>
              <Select className="mt-1.5" value={difficulty} onChange={(e) => setDifficulty(e.target.value as QuestionDifficulty)}>
                {difficulties.map((d) => (
                  <option key={d} value={d}>
                    {t(`enums.difficulty.${d}`)}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>{t("questions.create.questionType")}</Label>
              <Select className="mt-1.5" value={type} onChange={(e) => handleTypeChange(e.target.value as QuestionType)}>
                {questionTypes.map((qt) => (
                  <option key={qt} value={qt}>
                    {t(`enums.questionType.${qt}`)}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <Label>{t("questions.create.question")}</Label>
            <Textarea className="mt-1.5" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder={t("questions.create.questionPlaceholder")} />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <Label>{t("questions.create.answerChoices")}</Label>
              {type === "Multiple Choice" && (
                <button type="button" onClick={addChoice} className="flex items-center gap-1 text-xs font-semibold text-primary">
                  <Plus className="h-3.5 w-3.5" /> {t("questions.create.addChoice")}
                </button>
              )}
            </div>
            <div className="space-y-2">
              {choices.map((choice) => (
                <div key={choice.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correct"
                    checked={correctChoiceId === choice.id}
                    onChange={() => setCorrectChoiceId(choice.id)}
                    className="h-4 w-4 shrink-0 text-primary"
                  />
                  <span className="w-6 shrink-0 text-sm font-bold">
                    {localizeChoiceLabel(choice.label, choices.indexOf(choice), lang, type === "True/False")}
                  </span>
                  {type === "Multiple Choice" ? (
                    <Input
                      value={choice.text}
                      onChange={(e) => updateChoiceText(choice.id, e.target.value)}
                      placeholder={t("questions.create.choicePlaceholder", {
                        label: localizeChoiceLabel(choice.label, choices.indexOf(choice), lang),
                      })}
                    />
                  ) : (
                    <span className="flex-1 text-sm text-muted-foreground">
                      {type === "True/False" && lang === "ar"
                        ? choices.indexOf(choice) === 0
                          ? "صحيح"
                          : "خطأ"
                        : choice.text}
                    </span>
                  )}
                  {type === "Multiple Choice" && choices.length > 2 && (
                    <button onClick={() => removeChoice(choice.id)} className="shrink-0 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">{t("questions.create.selectCorrectHint")}</p>
          </div>

          <div>
            <Label>{t("questions.create.explanation")}</Label>
            <Textarea className="mt-1.5" value={explanation} onChange={(e) => setExplanation(e.target.value)} placeholder={t("questions.create.explanationPlaceholder")} />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 gap-1.5" onClick={() => setShowPreview((v) => !v)}>
              <Eye className="h-4 w-4" /> {showPreview ? t("questions.create.hidePreview") : t("questions.create.showPreview")}
            </Button>
            <Button className="flex-1 gap-1.5" onClick={handleSave}>
              <Save className="h-4 w-4" /> {t("questions.create.saveQuestion")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {showPreview && (
        <Card className="h-fit lg:sticky lg:top-20">
          <CardHeader>
            <CardTitle>{t("questions.create.previewTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <ExamTypeBadge examType={examType} />
              <Badge variant="secondary">{t(`enums.subject.${section}`)}</Badge>
              <Badge variant="outline">{t(`enums.difficulty.${difficulty}`)}</Badge>
            </div>
            <p dir="auto" className="font-medium">{prompt || t("questions.create.previewPlaceholder")}</p>
            <div className="space-y-2">
              {choices.map((choice) => (
                <div
                  key={choice.id}
                  className={`rounded-xl border px-3 py-2 text-sm ${
                    choice.id === correctChoiceId ? "border-success bg-success/5" : "border-border"
                  }`}
                >
                  <span className="font-bold">
                    {localizeChoiceLabel(choice.label, choices.indexOf(choice), lang, type === "True/False")}.
                  </span>{" "}
                  {type === "True/False" && lang === "ar"
                    ? choices.indexOf(choice) === 0
                      ? "صحيح"
                      : "خطأ"
                    : choice.text || t("common.dash")}
                </div>
              ))}
            </div>
            {explanation && <p className="text-sm text-muted-foreground">{explanation}</p>}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
