import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Question, QuestionReviewStatus } from "@/types";
import { mockQuestions } from "@/mock";
import { generateId } from "@/utils/format";

interface QuestionsState {
  questions: Question[];
  addQuestion: (question: Omit<Question, "id" | "generatedAt" | "status" | "source">) => void;
  reviewQuestion: (id: string, status: QuestionReviewStatus, feedback?: string) => void;
  bulkImport: (questions: Question[]) => void;
  reset: () => void;
}

export const useQuestionsStore = create<QuestionsState>()(
  persist(
    (set) => ({
      questions: mockQuestions,
      addQuestion: (question) =>
        set((state) => ({
          questions: [
            {
              ...question,
              id: generateId("q"),
              generatedAt: new Date().toISOString().slice(0, 10),
              status: "Pending Review",
              source: "teacher",
            },
            ...state.questions,
          ],
        })),
      reviewQuestion: (id, status, feedback) =>
        set((state) => ({
          questions: state.questions.map((q) =>
            q.id === id ? { ...q, status, reviewFeedback: feedback } : q
          ),
        })),
      bulkImport: (questions) =>
        set((state) => ({ questions: [...questions, ...state.questions] })),
      reset: () => set({ questions: mockQuestions }),
    }),
    { name: "sabbaq-questions-store" }
  )
);
