import type { Assignment } from "@/types";
import { mockStudents } from "./students";

function createSubmissions(classIds: string[], groups: Assignment["groups"], seed: number) {
  return mockStudents
    .filter((student) =>
      classIds.includes(student.classId) && (groups.length === 0 || groups.includes(student.group))
    )
    .map((student, index) => {
      const state = (index + seed) % 4;
      if (state === 0) {
        return { studentId: student.id, classId: student.classId, status: "not_submitted" as const };
      }

      return {
        studentId: student.id,
        classId: student.classId,
        status: "graded" as const,
        score: 62 + ((index * 7 + seed * 3) % 39),
        submittedAt: `2026-10-${String(12 + ((index + seed) % 10)).padStart(2, "0")}T14:30:00.000Z`,
      };
    });
}

const firstClassIds = ["cls-qdr-quant"];
const secondClassIds = ["cls-tah-science"];
const secondGroups: Assignment["groups"] = ["Advanced", "Intermediate"];

export const mockAssignments: Assignment[] = [
  {
    id: "assignment-1",
    title: "Quantitative reasoning checkpoint",
    classIds: firstClassIds,
    groups: [],
    questionIds: ["q-2", "q-4"],
    dueDate: "2026-11-02",
    publishedAt: "2026-10-10T09:00:00.000Z",
    submissions: createSubmissions(firstClassIds, [], 1),
  },
  {
    id: "assignment-2",
    title: "Science foundations review",
    classIds: secondClassIds,
    groups: secondGroups,
    questionIds: ["q-11", "q-13"],
    dueDate: "2026-11-05",
    publishedAt: "2026-10-12T09:00:00.000Z",
    submissions: createSubmissions(secondClassIds, secondGroups, 2),
  },
];
