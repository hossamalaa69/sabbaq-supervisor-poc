import type { ExamType } from "./exam";

export type QuestionDifficulty = "Easy" | "Medium" | "Hard";
export type QuestionType = "Multiple Choice" | "True/False";
export type QuestionReviewStatus = "Pending Review" | "Approved" | "Needs Revision" | "Rejected";
export type QuestionSource = "ai" | "teacher" | "bank";

export interface QuestionChoice {
  id: string;
  label: string; // A, B, C, D
  text: string;
}

export interface Question {
  id: string;
  examType: ExamType;
  section: string; // Quantitative / Verbal / Mathematics / Science
  topic: string;
  difficulty: QuestionDifficulty;
  type: QuestionType;
  prompt: string;
  choices: QuestionChoice[];
  correctChoiceId: string;
  explanation: string;
  status: QuestionReviewStatus;
  source: QuestionSource;
  generatedAt: string;
  reviewFeedback?: string;
}
