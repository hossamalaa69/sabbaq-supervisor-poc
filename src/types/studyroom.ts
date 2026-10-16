import type { ExamType } from "./exam";

export interface StudyRoomVoiceNote {
  src: string;
  durationSeconds: number;
  mimeType: string;
}

export interface StudyRoomMessage {
  id: string;
  authorId: string; // "teacher" or student id
  authorName: string;
  authorRole: "teacher" | "student";
  text: string;
  voiceNote?: StudyRoomVoiceNote;
  createdAt: string;
}

export interface StudyRoomTopic {
  id: string;
  roomId: string;
  title: string;
  description: string;
  createdAt: string;
  messages: StudyRoomMessage[];
}

export interface StudyRoomQuestionResponse {
  studentId: string;
  studentName: string;
  choiceId: string;
  correct: boolean;
}

export interface StudyRoomQuestionPost {
  id: string;
  roomId: string;
  prompt: string;
  choices: { id: string; label: string; text: string }[];
  correctChoiceId: string;
  createdAt: string;
  responses: StudyRoomQuestionResponse[];
}

export interface StudyRoom {
  id: string;
  name: string;
  examType: ExamType;
  classId: string;
  description: string;
  studentIds: string[];
  createdAt: string;
  messages: StudyRoomMessage[];
  topics: StudyRoomTopic[];
  questionPosts: StudyRoomQuestionPost[];
}
