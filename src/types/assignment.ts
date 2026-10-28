import type { StudentGroup } from "./student";

export type AssignmentSubmissionStatus = "graded" | "not_submitted";

export interface AssignmentSubmission {
  studentId: string;
  classId: string;
  status: AssignmentSubmissionStatus;
  score?: number;
  submittedAt?: string;
}

export interface Assignment {
  id: string;
  title: string;
  classIds: string[];
  groups: StudentGroup[];
  questionIds: string[];
  dueDate: string;
  publishedAt: string;
  submissions: AssignmentSubmission[];
}
