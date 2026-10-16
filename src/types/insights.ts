import type { ExamType } from "./exam";

export interface Assessment {
  id: string;
  name: string;
  examType: ExamType;
  classId: string;
  date: string;
  studentsCount: number;
  averageScore: number;
  completionPct: number;
}

export interface StudentAssessmentAnswer {
  questionId: string;
  selectedChoiceId: string | null;
  timeSpentSeconds: number;
}

export interface StudentAssessmentAttempt {
  id: string;
  studentId: string;
  assessmentId: string;
  startedAt: string;
  completedAt: string;
  durationSeconds: number;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  answers: StudentAssessmentAnswer[];
}

export interface AIInsight {
  id: string;
  examType: ExamType;
  message: string;
  createdAt: string;
}

export type AlertSeverity = "high" | "medium" | "low";

export interface Alert {
  id: string;
  examType: ExamType | "general";
  message: string;
  severity: AlertSeverity;
  studentIds: string[];
  createdAt: string;
}

export type MaterialStatus = "Draft" | "Published";

export interface StudyMaterial {
  id: string;
  title: string;
  examType: ExamType;
  subject: string;
  topic: string;
  classId: string;
  uploadDate: string;
  status: MaterialStatus;
  fileName: string;
}
