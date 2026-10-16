import type { ExamType } from "./exam";

export type MeetingAgentRole = "agent" | "teacher";

export interface MeetingAgentMessage {
  id: string;
  role: MeetingAgentRole;
  text: string;
  createdAt: string;
}

export type MeetingAgentStage =
  | "idle"
  | "collecting_title"
  | "collecting_datetime"
  | "collecting_duration"
  | "collecting_participants"
  | "confirming"
  | "selecting_participants"
  | "created";

export interface DraftMeeting {
  title?: string;
  examType?: ExamType;
  classId?: string;
  date?: string;
  time?: string;
  durationMinutes?: number;
  participantIds: string[];
  allStudents: boolean;
}

export interface CreatedMeeting {
  id: string;
  title: string;
  examType: ExamType;
  date: string;
  time: string;
  durationMinutes: number;
  participantCount: number;
  meetLink: string;
  createdAt: string;
}
