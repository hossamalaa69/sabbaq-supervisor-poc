import type { ExamType } from "./exam";

export type StudentGroup = "Advanced" | "Intermediate" | "Needs Support";

export type StudentStatus = "active" | "inactive";
export type StudentAccessStatus = "active" | "deactivated";
export type JoinRequestSource = "code" | "link";

export interface StudentJoinRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  classId: string;
  examType: ExamType;
  requestedAt: string;
  source: JoinRequestSource;
}

export interface Student {
  id: string;
  name: string;
  avatarColor: string;
  classId: string;
  examType: ExamType;
  group: StudentGroup;
  averageScore: number;
  improvementPct: number;
  lastActivity: string; // ISO date
  status: StudentStatus;
  accessStatus?: StudentAccessStatus;
  deactivatedAt?: string;
  deactivationReason?: string;
  email: string;
  phone: string;
  assessmentsCompleted: number;
  trend: number[]; // last few scores for sparkline
}

export interface StudentCategorySummary {
  category: "improving" | "struggling" | "inactive";
  label: string;
  count: number;
  percentage: number;
}
