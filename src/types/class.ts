import type { ExamType } from "./exam";

export interface SabbaqClass {
  id: string;
  name: string; // e.g. "Qudurat - Quantitative"
  examType: ExamType;
  section: string; // e.g. "Quantitative"
  studentCount: number;
  createdAt: string;
  description: string;
}
