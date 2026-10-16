import type { AIInsight, Alert } from "@/types";
import { mockStudents } from "./students";

export const mockInsights: AIInsight[] = [
  {
    id: "ins-1",
    examType: "qudurat",
    message: "Grade 10A improved by 12% in Qudurat quantitative performance over the last three assessments.",
    createdAt: "2026-10-07",
  },
  {
    id: "ins-2",
    examType: "qudurat",
    message: "18 students are struggling with quantitative reasoning in Qudurat.",
    createdAt: "2026-10-06",
  },
  {
    id: "ins-3",
    examType: "tahsili",
    message: "Students who completed the latest Tahsili mathematics study material scored 17% higher on average.",
    createdAt: "2026-10-06",
  },
  {
    id: "ins-4",
    examType: "qudurat",
    message: "Qudurat verbal performance is improving faster than quantitative performance for this class.",
    createdAt: "2026-10-05",
  },
  {
    id: "ins-5",
    examType: "tahsili",
    message: "Tahsili science scores dipped slightly this week — consider assigning the chemistry stoichiometry review.",
    createdAt: "2026-10-04",
  },
  {
    id: "ins-6",
    examType: "qudurat",
    message: "Students practicing daily on Qudurat quantitative drills show a 23% faster improvement rate.",
    createdAt: "2026-10-03",
  },
];

const strugglingIds = mockStudents.slice(0, 3).map((s) => s.id);
const inactiveIds = mockStudents.filter((s) => s.status === "inactive").slice(0, 7).map((s) => s.id);
const dropIds = mockStudents.slice(3, 4).map((s) => s.id);

export const mockAlerts: Alert[] = [
  {
    id: "alt-1",
    examType: "qudurat",
    message: `${mockStudents[3]?.name ?? "A student"} has dropped 18% in his last two Qudurat assessments.`,
    severity: "high",
    studentIds: dropIds,
    createdAt: "2026-10-07",
  },
  {
    id: "alt-2",
    examType: "tahsili",
    message: "7 students have not completed their latest Tahsili assessment.",
    severity: "medium",
    studentIds: inactiveIds,
    createdAt: "2026-10-06",
  },
  {
    id: "alt-3",
    examType: "qudurat",
    message: "12 students are struggling with quantitative reasoning.",
    severity: "high",
    studentIds: strugglingIds,
    createdAt: "2026-10-06",
  },
  {
    id: "alt-4",
    examType: "general",
    message: "9 students have been inactive for more than a week.",
    severity: "medium",
    studentIds: inactiveIds,
    createdAt: "2026-10-05",
  },
  {
    id: "alt-5",
    examType: "tahsili",
    message: "Average completion rate for Tahsili Science Practice dropped to 75%.",
    severity: "low",
    studentIds: [],
    createdAt: "2026-10-04",
  },
  {
    id: "alt-6",
    examType: "qudurat",
    message: "3 students scored below 50% on the latest Qudurat verbal practice.",
    severity: "high",
    studentIds: strugglingIds,
    createdAt: "2026-10-03",
  },
  {
    id: "alt-7",
    examType: "general",
    message: "Grade 10A's overall engagement increased by 9% this week.",
    severity: "low",
    studentIds: [],
    createdAt: "2026-10-02",
  },
  {
    id: "alt-8",
    examType: "tahsili",
    message: "5 students have not started the Tahsili mathematics assignment due tomorrow.",
    severity: "medium",
    studentIds: inactiveIds.slice(0, 5),
    createdAt: "2026-10-01",
  },
  {
    id: "alt-9",
    examType: "qudurat",
    message: "Qudurat Quantitative class average rose above 75% for the first time this term.",
    severity: "low",
    studentIds: [],
    createdAt: "2026-09-30",
  },
  {
    id: "alt-10",
    examType: "general",
    message: "2 students requested extra support sessions this week.",
    severity: "medium",
    studentIds: strugglingIds.slice(0, 2),
    createdAt: "2026-09-29",
  },
];
