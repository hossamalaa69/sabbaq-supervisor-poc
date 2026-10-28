import { useMemo, useState, type FormEvent } from "react";
import { CalendarDays, ClipboardList, Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Checkbox, Input, Label, Select } from "@/components/ui/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { useAssignmentsStore, useClassesStore, useQuestionsStore, useStudentsStore } from "@/store";
import type { Assignment, AssignmentSubmission, Question, StudentGroup } from "@/types";
import { formatDate } from "@/utils/format";
import {
  localizeAssignmentContent,
  localizeClassContent,
  localizeQuestionContent,
  localizePersonName,
} from "@/utils/contentTranslations";
import { useTranslation } from "@/utils/i18n";

type PageTab = "assignments" | "grades";
type QuestionSourceFilter = "all" | Question["source"];

const studentGroups: StudentGroup[] = ["Advanced", "Intermediate", "Needs Support"];

function localDateInputValue() {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

function sourceVariant(source: Question["source"]) {
  if (source === "ai") return "accent" as const;
  if (source === "teacher") return "default" as const;
  return "secondary" as const;
}

export default function AssignmentsPage() {
  const { t, lang } = useTranslation();
  const assignments = useAssignmentsStore((state) => state.assignments);
  const publishAssignment = useAssignmentsStore((state) => state.publishAssignment);
  const classes = useClassesStore((state) => state.classes);
  const students = useStudentsStore((state) => state.students);
  const questions = useQuestionsStore((state) => state.questions);

  const [tab, setTab] = useState<PageTab>("assignments");
  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<StudentGroup[]>([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [sourceFilter, setSourceFilter] = useState<QuestionSourceFilter>("all");
  const [dueDate, setDueDate] = useState("");
  const [reportAssignmentId, setReportAssignmentId] = useState("all");
  const [reportClassId, setReportClassId] = useState("all");

  const eligibleQuestions = useMemo(
    () => {
      const selectedClasses = classes.filter((classItem) =>
        selectedClassIds.includes(classItem.id)
      );
      return questions.filter(
        (question) =>
          question.status === "Approved" &&
          (selectedClasses.length === 0 ||
            selectedClasses.every(
              (classItem) =>
                question.examType === classItem.examType &&
                question.section === classItem.section
            ))
      );
    },
    [classes, questions, selectedClassIds]
  );
  const validSelectedQuestionIds = selectedQuestionIds.filter((questionId) =>
    eligibleQuestions.some((question) => question.id === questionId)
  );
  const visibleQuestions = useMemo(
    () =>
      eligibleQuestions.filter(
        (question) => sourceFilter === "all" || question.source === sourceFilter
      ),
    [eligibleQuestions, sourceFilter]
  );
  const recipients = useMemo(
    () =>
      students.filter(
        (student) =>
          selectedClassIds.includes(student.classId) &&
          (selectedGroups.length === 0 || selectedGroups.includes(student.group)) &&
          student.accessStatus !== "deactivated"
      ),
    [students, selectedClassIds, selectedGroups]
  );
  const reportRows = useMemo(() => {
    const selectedAssignments =
      reportAssignmentId === "all"
        ? assignments
        : assignments.filter((assignment) => assignment.id === reportAssignmentId);
    return selectedAssignments.flatMap((assignment) =>
      assignment.submissions
        .filter((submission) => reportClassId === "all" || submission.classId === reportClassId)
        .map((submission) => ({ assignment, submission }))
    );
  }, [assignments, reportAssignmentId, reportClassId]);

  const gradedRows = reportRows.filter(
    ({ submission }) => submission.status === "graded" && submission.score !== undefined
  );
  const averageScore = gradedRows.length
    ? Math.round(gradedRows.reduce((total, { submission }) => total + (submission.score ?? 0), 0) / gradedRows.length)
    : null;
  const submittedCount = reportRows.filter(
    ({ submission }) => submission.status === "graded"
  ).length;

  function toggleValue<T extends string>(values: T[], value: T, setValues: (next: T[]) => void) {
    setValues(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  }

  function resetForm() {
    setTitle("");
    setSelectedClassIds([]);
    setSelectedGroups([]);
    setSelectedQuestionIds([]);
    setSourceFilter("all");
    setDueDate("");
  }

  function handlePublish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) {
      toast.error(t("assignments.validationTitle"));
      return;
    }
    if (selectedClassIds.length === 0) {
      toast.error(t("assignments.validationClass"));
      return;
    }
    if (validSelectedQuestionIds.length === 0) {
      toast.error(t("assignments.validationQuestion"));
      return;
    }
    if (!dueDate || dueDate < localDateInputValue()) {
      toast.error(t("assignments.validationDeadline"));
      return;
    }

    publishAssignment({
      title,
      classIds: selectedClassIds,
      groups: selectedGroups,
      questionIds: validSelectedQuestionIds,
      dueDate,
      recipients: recipients.map(({ id, classId }) => ({ studentId: id, classId })),
    });
    toast.success(t("assignments.publishedToast", { count: recipients.length }));
    resetForm();
    setCreateOpen(false);
  }

  function assignmentClassNames(assignment: Assignment) {
    return assignment.classIds
      .map((classId) => classes.find((item) => item.id === classId))
      .filter((item): item is (typeof classes)[number] => Boolean(item))
      .map((item) => localizeClassContent(item, lang).name)
      .join(", ");
  }

  function statusBadge(submission: AssignmentSubmission) {
    if (submission.status === "graded") {
      return <Badge variant="success">{t("assignments.scored")}</Badge>;
    }
    return <Badge variant="destructive">{t("assignments.notSubmitted")}</Badge>;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">{t("assignments.title")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("assignments.subtitle")}</p>
        </div>
        <Button onClick={() => setCreateOpen((open) => !open)}>
          <Plus className="h-4 w-4" />
          {createOpen ? t("common.cancel") : t("assignments.create")}
        </Button>
      </div>

      <div className="flex gap-2 border-b border-border" role="tablist" aria-label={t("assignments.title")}>
        {(["assignments", "grades"] as const).map((value) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={tab === value}
            onClick={() => {
              setTab(value);
              setCreateOpen(false);
            }}
            className={`border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              tab === value ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t(value === "assignments" ? "assignments.listTab" : "assignments.gradesTab")}
          </button>
        ))}
      </div>

      {createOpen && (
        <Card>
          <CardHeader>
            <CardTitle>{t("assignments.createTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handlePublish}>
              <div>
                <Label htmlFor="assignment-title">{t("assignments.assignmentTitle")}</Label>
                <Input
                  id="assignment-title"
                  className="mt-1.5"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder={t("assignments.titlePlaceholder")}
                  required
                />
              </div>

              <fieldset className="space-y-2">
                <legend className="text-sm font-medium">{t("assignments.classes")}</legend>
                <p className="text-xs text-muted-foreground">{t("assignments.classesHint")}</p>
                {classes.length === 0 ? (
                  <p className="rounded-xl bg-muted p-3 text-sm text-muted-foreground">{t("assignments.noClasses")}</p>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {classes.map((classItem) => {
                      const localizedClass = localizeClassContent(classItem, lang);
                      return (
                        <label key={classItem.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-3 text-sm">
                          <Checkbox
                            checked={selectedClassIds.includes(classItem.id)}
                            onChange={() =>
                              toggleValue(selectedClassIds, classItem.id, setSelectedClassIds)
                            }
                          />
                          <span className="flex-1 font-medium">{localizedClass.name}</span>
                          <span className="text-xs text-muted-foreground">{classItem.studentCount} {t("assignments.students")}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </fieldset>

              {selectedClassIds.length > 0 && (
                <fieldset className="space-y-2">
                  <legend className="text-sm font-medium">{t("assignments.groups")}</legend>
                  <p className="text-xs text-muted-foreground">{t("assignments.groupsHint")}</p>
                  <div className="flex flex-wrap gap-3">
                    {studentGroups.map((group) => (
                      <label key={group} className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm">
                        <Checkbox
                          checked={selectedGroups.includes(group)}
                          onChange={() => toggleValue(selectedGroups, group, setSelectedGroups)}
                        />
                        {t(`assignments.groupsNames.${group}`)}
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              <div className="max-w-sm">
                <Label htmlFor="assignment-deadline">{t("assignments.deadline")}</Label>
                <Input
                  id="assignment-deadline"
                  type="date"
                  min={localDateInputValue()}
                  className="mt-1.5"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                  required
                />
              </div>

              <fieldset className="space-y-3">
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <div>
                    <legend className="text-sm font-medium">{t("assignments.questions")}</legend>
                    <p className="mt-1 text-xs text-muted-foreground">{t("assignments.questionsHint")}</p>
                  </div>
                  <Select
                    className="w-auto min-w-[170px]"
                    value={sourceFilter}
                    onChange={(event) => setSourceFilter(event.target.value as QuestionSourceFilter)}
                    aria-label={t("assignments.source")}
                  >
                    <option value="all">{t("assignments.allSources")}</option>
                    <option value="ai">{t("assignments.aiGenerated")}</option>
                    <option value="teacher">{t("assignments.teacherCreated")}</option>
                    <option value="bank">{t("assignments.questionBank")}</option>
                  </Select>
                </div>
                <p className="text-xs font-semibold text-primary">
                  {t("assignments.selectedQuestions", { count: validSelectedQuestionIds.length })}
                </p>
                {visibleQuestions.length === 0 ? (
                  <p className="rounded-xl bg-muted p-3 text-sm text-muted-foreground">{t("assignments.noEligibleQuestions")}</p>
                ) : (
                  <div className="max-h-72 space-y-2 overflow-y-auto rounded-xl border border-border p-2">
                    {visibleQuestions.map((question) => {
                      const localizedQuestion = localizeQuestionContent(question, lang);
                      return (
                        <label key={question.id} className="flex cursor-pointer items-start gap-3 rounded-lg p-3 hover:bg-muted/60">
                          <Checkbox
                            className="mt-0.5"
                            checked={selectedQuestionIds.includes(question.id)}
                            onChange={() =>
                              toggleValue(selectedQuestionIds, question.id, setSelectedQuestionIds)
                            }
                          />
                          <span className="min-w-0 flex-1">
                            <span dir="auto" className="block text-sm font-medium">{localizedQuestion.prompt}</span>
                            <span className="mt-1 block text-xs text-muted-foreground">{localizedQuestion.topic}</span>
                          </span>
                          <Badge variant={sourceVariant(question.source)}>
                            {t(`assignments.sourceNames.${question.source}`)}
                          </Badge>
                        </label>
                      );
                    })}
                  </div>
                )}
              </fieldset>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {t("assignments.recipients", { count: recipients.length })}
                </p>
                <Button type="submit" disabled={classes.length === 0 || recipients.length === 0}>
                  <ClipboardList className="h-4 w-4" />
                  {t("assignments.publish")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {tab === "assignments" ? (
        <Card>
          <CardContent className="pt-5">
            {assignments.length === 0 ? (
              <div className="py-10 text-center">
                <ClipboardList className="mx-auto h-9 w-9 text-muted-foreground" />
                <p className="mt-3 font-semibold">{t("assignments.noAssignments")}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t("assignments.noAssignmentsHint")}</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("assignments.assignment")}</TableHead>
                    <TableHead>{t("assignments.class")}</TableHead>
                    <TableHead>{t("assignments.deadlineColumn")}</TableHead>
                    <TableHead>{t("assignments.questionsColumn")}</TableHead>
                    <TableHead>{t("assignments.completion")}</TableHead>
                    <TableHead>{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.map((assignment) => {
                    const submitted = assignment.submissions.filter(
                      (submission) => submission.status === "graded"
                    ).length;
                    return (
                      <TableRow key={assignment.id}>
                        <TableCell>
                          <p className="font-semibold">
                            {localizeAssignmentContent(assignment, lang).title}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {t("assignments.published")} {formatDate(assignment.publishedAt, lang)}
                          </p>
                        </TableCell>
                        <TableCell className="max-w-xs text-sm text-muted-foreground">{assignmentClassNames(assignment)}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            {formatDate(assignment.dueDate, lang)}
                          </span>
                        </TableCell>
                        <TableCell>{assignment.questionIds.length}</TableCell>
                        <TableCell>
                          <span className="font-semibold">{submitted}/{assignment.submissions.length}</span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setReportAssignmentId(assignment.id);
                              setTab("grades");
                            }}
                          >
                            {t("assignments.viewGrades")}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="min-w-[220px] flex-1">
              <Label htmlFor="report-assignment">{t("assignments.assignment")}</Label>
              <Select
                id="report-assignment"
                className="mt-1.5"
                value={reportAssignmentId}
                onChange={(event) => setReportAssignmentId(event.target.value)}
              >
                <option value="all">{t("assignments.allAssignments")}</option>
                {assignments.map((assignment) => (
                  <option key={assignment.id} value={assignment.id}>
                    {localizeAssignmentContent(assignment, lang).title}
                  </option>
                ))}
              </Select>
            </div>
            <div className="min-w-[220px] flex-1">
              <Label htmlFor="report-class">{t("assignments.class")}</Label>
              <Select
                id="report-class"
                className="mt-1.5"
                value={reportClassId}
                onChange={(event) => setReportClassId(event.target.value)}
              >
                <option value="all">{t("assignments.allClasses")}</option>
                {classes.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {localizeClassContent(classItem, lang).name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Card>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">{t("assignments.totalStudents")}</p>
                <p className="mt-1 text-2xl font-bold">{reportRows.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">{t("assignments.completion")}</p>
                <p className="mt-1 text-2xl font-bold">{submittedCount}/{reportRows.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">{t("assignments.averageScore")}</p>
                <p className="mt-1 text-2xl font-bold">{averageScore === null ? "—" : `${averageScore}%`}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("assignments.gradeReport")}</CardTitle>
              <p className="text-sm text-muted-foreground">{t("assignments.reportHint")}</p>
            </CardHeader>
            <CardContent>
              {reportRows.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">{t("assignments.emptyReport")}</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("assignments.student")}</TableHead>
                      <TableHead>{t("assignments.class")}</TableHead>
                      <TableHead>{t("assignments.assignment")}</TableHead>
                      <TableHead>{t("assignments.score")}</TableHead>
                      <TableHead>{t("assignments.status")}</TableHead>
                      <TableHead>{t("assignments.submittedAt")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportRows.map(({ assignment, submission }) => {
                      const student = students.find((item) => item.id === submission.studentId);
                      const classItem = classes.find((item) => item.id === submission.classId);
                      return (
                        <TableRow key={`${assignment.id}-${submission.studentId}`}>
                          <TableCell className="font-medium">
                            {student ? localizePersonName(student.name, lang) : t("common.dash")}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {classItem ? localizeClassContent(classItem, lang).name : t("common.dash")}
                          </TableCell>
                          <TableCell className="max-w-[220px] truncate">
                            {localizeAssignmentContent(assignment, lang).title}
                          </TableCell>
                          <TableCell className="font-semibold">
                            {submission.score === undefined ? t("common.dash") : `${submission.score}%`}
                          </TableCell>
                          <TableCell>{statusBadge(submission)}</TableCell>
                          <TableCell className="whitespace-nowrap text-muted-foreground">
                            {submission.submittedAt ? formatDate(submission.submittedAt, lang) : t("common.dash")}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
