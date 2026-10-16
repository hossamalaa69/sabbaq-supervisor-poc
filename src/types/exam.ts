/**
 * Core exam scope for the entire application.
 * Sabbaq Teacher Portal supports exactly two exam products — never add a third.
 */
export type ExamType = "qudurat" | "tahsili";

export const EXAM_TYPES: ExamType[] = ["qudurat", "tahsili"];

export const examTypeLabels: Record<ExamType, string> = {
  qudurat: "Qudurat (قدرات)",
  tahsili: "Tahsili (تحصيلي)",
};

export const examTypeShortLabels: Record<ExamType, string> = {
  qudurat: "Qudurat",
  tahsili: "Tahsili",
};

/** Sections/subjects scoped per exam type, used across questions, materials, and study rooms. */
export const examSections: Record<ExamType, string[]> = {
  qudurat: ["Quantitative", "Verbal"],
  tahsili: ["Mathematics", "Science"],
};

export const studyRoomTopicsByExam: Record<ExamType, string[]> = {
  qudurat: ["Quantitative Reasoning", "Verbal Reasoning", "Problem Solving", "Exam Strategy"],
  tahsili: ["Mathematics", "Physics", "Chemistry", "Biology"],
};
