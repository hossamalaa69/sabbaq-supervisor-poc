import type { StudyRoom } from "@/types";
import { createDemoVoiceNote } from "@/utils/voiceNotes";
import { mockStudents } from "./students";

const quantStudents = mockStudents.filter((s) => s.classId === "cls-qdr-quant").map((s) => s.id);
const mathStudents = mockStudents.filter((s) => s.classId === "cls-tah-math").map((s) => s.id);

function findName(id: string): string {
  return mockStudents.find((s) => s.id === id)?.name ?? "Student";
}

export const mockStudyRooms: StudyRoom[] = [
  {
    id: "room-1",
    name: "Qudurat Quantitative Revision",
    examType: "qudurat",
    classId: "cls-qdr-quant",
    description: "Weekly revision room for quantitative reasoning — practice problems and quick Q&A before assessments.",
    studentIds: quantStudents,
    createdAt: "2026-09-21",
    messages: [
      {
        id: "msg-1",
        authorId: "teacher",
        authorName: "Hossam Alaa",
        authorRole: "teacher",
        text: "Good evening everyone! Tonight let's go over ratio problems before Thursday's practice exam.",
        createdAt: "2026-10-06T17:00:00",
      },
      {
        id: "msg-2",
        authorId: quantStudents[0] ?? "stu-1",
        authorName: findName(quantStudents[0] ?? "stu-1"),
        authorRole: "student",
        text: "Ustaz, can you re-explain the train speed problem from last time?",
        createdAt: "2026-10-06T17:02:00",
      },
      {
        id: "msg-3",
        authorId: "teacher",
        authorName: "Hossam Alaa",
        authorRole: "teacher",
        text: "Sure — speed = distance ÷ time. We'll do a fresh example together in a moment.",
        createdAt: "2026-10-06T17:03:00",
      },
      {
        id: "msg-4",
        authorId: quantStudents[1] ?? "stu-2",
        authorName: findName(quantStudents[1] ?? "stu-2"),
        authorRole: "student",
        text: "Thank you! Also could we review geometry area formulas?",
        createdAt: "2026-10-06T17:05:00",
      },
      {
        id: "msg-voice-1",
        authorId: quantStudents[2] ?? "stu-3",
        authorName: findName(quantStudents[2] ?? "stu-3"),
        authorRole: "student",
        text: "",
        voiceNote: createDemoVoiceNote(4),
        createdAt: "2026-10-06T17:07:00",
      },
    ],
    topics: [
      {
        id: "topic-1",
        roomId: "room-1",
        title: "Quantitative Reasoning",
        description: "Core quantitative reasoning techniques: percentages, ratios, sequences, and word problems.",
        createdAt: "2026-09-22",
        messages: [
          {
            id: "tmsg-1",
            authorId: "teacher",
            authorName: "Hossam Alaa",
            authorRole: "teacher",
            text: "Let's start with percentage problems — remember to convert percentages to decimals before calculating.",
            createdAt: "2026-09-22T10:00:00",
          },
          {
            id: "tmsg-2",
            authorId: quantStudents[2] ?? "stu-3",
            authorName: findName(quantStudents[2] ?? "stu-3"),
            authorRole: "student",
            text: "Got it, that makes the increased-by-20% problems much easier.",
            createdAt: "2026-09-22T10:05:00",
          },
        ],
      },
      {
        id: "topic-2",
        roomId: "room-1",
        title: "Exam Strategy",
        description: "Time management and question-order strategy for the Qudurat quantitative section.",
        createdAt: "2026-09-25",
        messages: [
          {
            id: "tmsg-3",
            authorId: "teacher",
            authorName: "Hossam Alaa",
            authorRole: "teacher",
            text: "Tip: skip questions that take more than 90 seconds and come back to them at the end.",
            createdAt: "2026-09-25T09:00:00",
          },
        ],
      },
    ],
    questionPosts: [
      {
        id: "qp-1",
        roomId: "room-1",
        prompt: "If a number is increased by 20% and becomes 120, what was the original number?",
        choices: [
          { id: "A", label: "A", text: "80" },
          { id: "B", label: "B", text: "90" },
          { id: "C", label: "C", text: "100" },
          { id: "D", label: "D", text: "110" },
        ],
        correctChoiceId: "C",
        createdAt: "2026-10-06T17:10:00",
        responses: [
          { studentId: quantStudents[0] ?? "stu-1", studentName: findName(quantStudents[0] ?? "stu-1"), choiceId: "C", correct: true },
          { studentId: quantStudents[1] ?? "stu-2", studentName: findName(quantStudents[1] ?? "stu-2"), choiceId: "B", correct: false },
          { studentId: quantStudents[2] ?? "stu-3", studentName: findName(quantStudents[2] ?? "stu-3"), choiceId: "C", correct: true },
        ],
      },
    ],
  },
  {
    id: "room-2",
    name: "Tahsili Mathematics Study Group",
    examType: "tahsili",
    classId: "cls-tah-math",
    description: "Collaborative study room for Tahsili mathematics — algebra, functions, trigonometry, and statistics.",
    studentIds: mathStudents,
    createdAt: "2026-09-23",
    messages: [
      {
        id: "msg-5",
        authorId: "teacher",
        authorName: "Hossam Alaa",
        authorRole: "teacher",
        text: "This week we'll focus on functions. Please review f(x) notation before our session.",
        createdAt: "2026-10-05T16:00:00",
      },
      {
        id: "msg-6",
        authorId: mathStudents[0] ?? "stu-19",
        authorName: findName(mathStudents[0] ?? "stu-19"),
        authorRole: "student",
        text: "Noted! Is the practice test still on Sunday?",
        createdAt: "2026-10-05T16:01:00",
      },
      {
        id: "msg-7",
        authorId: "teacher",
        authorName: "Hossam Alaa",
        authorRole: "teacher",
        text: "Yes, Sunday at 5 PM. I'll post a reminder in the Study Materials section too.",
        createdAt: "2026-10-05T16:02:00",
      },
    ],
    topics: [
      {
        id: "topic-3",
        roomId: "room-2",
        title: "Mathematics",
        description: "Algebra, functions, and statistics core concepts for the Tahsili mathematics section.",
        createdAt: "2026-09-24",
        messages: [
          {
            id: "tmsg-4",
            authorId: "teacher",
            authorName: "Hossam Alaa",
            authorRole: "teacher",
            text: "Remember: a function assigns exactly one output to each input. Let's practice evaluating f(2), f(-1), etc.",
            createdAt: "2026-09-24T11:00:00",
          },
        ],
      },
      {
        id: "topic-4",
        roomId: "room-2",
        title: "Physics",
        description: "Mechanics and energy concepts shared with the Tahsili science track.",
        createdAt: "2026-09-26",
        messages: [],
      },
    ],
    questionPosts: [
      {
        id: "qp-2",
        roomId: "room-2",
        prompt: "If 3x − 7 = 2x + 5, what is the value of x?",
        choices: [
          { id: "A", label: "A", text: "8" },
          { id: "B", label: "B", text: "10" },
          { id: "C", label: "C", text: "12" },
          { id: "D", label: "D", text: "14" },
        ],
        correctChoiceId: "C",
        createdAt: "2026-10-05T16:10:00",
        responses: [
          { studentId: mathStudents[0] ?? "stu-19", studentName: findName(mathStudents[0] ?? "stu-19"), choiceId: "C", correct: true },
          { studentId: mathStudents[1] ?? "stu-20", studentName: findName(mathStudents[1] ?? "stu-20"), choiceId: "A", correct: false },
        ],
      },
    ],
  },
];
