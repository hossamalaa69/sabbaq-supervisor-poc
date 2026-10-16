import type { ExamType } from "./exam";

export type B2BStatus = "pending" | "under_review" | "approved" | "rejected" | "needs_info";

export interface Teacher {
  name: string;
  role: string;
  school: string;
  email: string;
  phone: string;
  b2bStatus: B2BStatus;
  expectedStudents: number;
  certificates: string[];
  examTypes: ExamType[];
  avatarInitials: string;
}

export interface B2BSignupData {
  // Step 1
  fullName: string;
  email: string;
  phone: string;
  password: string;
  // Step 2
  school: string;
  teacherRole: string;
  subjects: string;
  expectedStudents: number;
  examTypes: ExamType[];
  // Step 3
  certificates: string[];
  licenseNumber: string;
  licenseExpiry: string;
  documents: string[];
}

export interface B2BStatusStep {
  status: B2BStatus;
  label: string;
  date: string;
  completed: boolean;
}
