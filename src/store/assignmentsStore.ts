import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Assignment, StudentGroup } from "@/types";
import type { AssignmentSubmissionStatus } from "@/types";
import { mockAssignments } from "@/mock";
import { generateId } from "@/utils/format";

interface AssignmentRecipient {
  studentId: string;
  classId: string;
}

interface NewAssignment {
  title: string;
  classIds: string[];
  groups: StudentGroup[];
  questionIds: string[];
  dueDate: string;
  recipients: AssignmentRecipient[];
}

interface AssignmentsState {
  assignments: Assignment[];
  publishAssignment: (assignment: NewAssignment) => void;
  reset: () => void;
}

interface PersistedAssignmentsState {
  assignments?: Array<
    Omit<Assignment, "submissions"> & {
      submissions: Array<
        Omit<Assignment["submissions"][number], "status"> & {
          status: AssignmentSubmissionStatus | "submitted";
        }
      >;
    }
  >;
}

export const useAssignmentsStore = create<AssignmentsState>()(
  persist(
    (set) => ({
      assignments: mockAssignments,
      publishAssignment: ({ title, classIds, groups, questionIds, dueDate, recipients }) =>
        set((state) => ({
          assignments: [
            {
              id: generateId("assignment"),
              title: title.trim(),
              classIds,
              groups,
              questionIds,
              dueDate,
              publishedAt: new Date().toISOString(),
              submissions: recipients.map(({ studentId, classId }) => ({
                studentId,
                classId,
                status: "not_submitted",
              })),
            },
            ...state.assignments,
          ],
        })),
      reset: () => set({ assignments: mockAssignments }),
    }),
    {
      name: "sabbaq-assignments-store",
      version: 1,
      migrate: (persistedState) => {
        const persisted = persistedState as PersistedAssignmentsState;
        return {
          ...persisted,
          assignments: persisted.assignments?.map((assignment) => ({
            ...assignment,
            submissions: assignment.submissions.map((submission) =>
              submission.status === "submitted"
                ? { studentId: submission.studentId, classId: submission.classId, status: "not_submitted" }
                : submission
            ),
          })) ?? mockAssignments,
        } as AssignmentsState;
      },
    }
  )
);
