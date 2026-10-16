import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Student, StudentGroup, StudentJoinRequest } from "@/types";
import { mockStudents, mockStudentJoinRequests } from "@/mock";
import { generateId } from "@/utils/format";

interface StudentsState {
  students: Student[];
  pendingJoinRequests: StudentJoinRequest[];
  assignGroup: (studentIds: string[], group: StudentGroup) => void;
  addStudent: (student: Partial<Student>) => void;
  acceptJoinRequest: (requestId: string) => void;
  rejectJoinRequest: (requestId: string) => void;
  resetJoinRequests: () => void;
  deactivateStudent: (studentId: string, reason: string) => void;
  reactivateStudent: (studentId: string) => void;
  reset: () => void;
}

export const useStudentsStore = create<StudentsState>()(
  persist(
    (set) => ({
      students: mockStudents,
      pendingJoinRequests: mockStudentJoinRequests,
      assignGroup: (studentIds, group) =>
        set((state) => ({
          students: state.students.map((s) =>
            studentIds.includes(s.id) ? { ...s, group } : s
          ),
        })),
      addStudent: (student) =>
        set((state) => ({
          students: [
            {
              id: generateId("stu"),
              name: student.name ?? "New Student",
              avatarColor: "#4C44E4",
              classId: student.classId ?? "cls-qdr-quant",
              examType: student.examType ?? "qudurat",
              group: student.group ?? "Intermediate",
              averageScore: student.averageScore ?? 70,
              improvementPct: student.improvementPct ?? 0,
              lastActivity: new Date().toISOString().slice(0, 10),
              status: "active",
              accessStatus: "active",
              email: student.email ?? "new.student@sabbaqmail.com",
              phone: student.phone ?? "+966 50 000 0000",
              assessmentsCompleted: 0,
              trend: [60, 62, 65, 68, 70],
              ...student,
            } as Student,
            ...state.students,
          ],
        })),
      acceptJoinRequest: (requestId) =>
        set((state) => {
          const request = state.pendingJoinRequests.find((item) => item.id === requestId);
          if (!request) return state;

          const student: Student = {
            id: generateId("stu"),
            name: request.name,
            avatarColor: "#4C44E4",
            classId: request.classId,
            examType: request.examType,
            group: "Intermediate",
            averageScore: 0,
            improvementPct: 0,
            lastActivity: new Date().toISOString().slice(0, 10),
            status: "active",
            accessStatus: "active",
            email: request.email,
            phone: request.phone,
            assessmentsCompleted: 0,
            trend: [],
          };

          return {
            students: [student, ...state.students],
            pendingJoinRequests: state.pendingJoinRequests.filter((item) => item.id !== requestId),
          };
        }),
      rejectJoinRequest: (requestId) =>
        set((state) => ({
          pendingJoinRequests: state.pendingJoinRequests.filter((item) => item.id !== requestId),
        })),
      resetJoinRequests: () =>
        set({ pendingJoinRequests: mockStudentJoinRequests }),
      deactivateStudent: (studentId, reason) =>
        set((state) => ({
          students: state.students.map((student) =>
            student.id === studentId
              ? {
                  ...student,
                  accessStatus: "deactivated",
                  deactivatedAt: new Date().toISOString(),
                  deactivationReason: reason,
                }
              : student
          ),
        })),
      reactivateStudent: (studentId) =>
        set((state) => ({
          students: state.students.map((student) =>
            student.id === studentId
              ? {
                  ...student,
                  accessStatus: "active",
                  deactivatedAt: undefined,
                  deactivationReason: undefined,
                }
              : student
          ),
        })),
      reset: () => set({ students: mockStudents, pendingJoinRequests: mockStudentJoinRequests }),
    }),
    { name: "sabbaq-students-store" }
  )
);
