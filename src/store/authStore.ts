import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { B2BStatus, Teacher, B2BSignupData } from "@/types";
import { mockTeacher } from "@/mock";

interface AuthState {
  teacher: Teacher;
  isAuthenticated: boolean;
  signupData: Partial<B2BSignupData>;
  login: () => void;
  logout: () => void;
  updateSignupData: (data: Partial<B2BSignupData>) => void;
  submitB2BRequest: () => void;
  setB2BStatus: (status: B2BStatus) => void;
  reset: () => void;
}

const initialTeacher: Teacher = { ...mockTeacher };

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      teacher: initialTeacher,
      isAuthenticated: true,
      signupData: {},
      login: () => set({ isAuthenticated: true }),
      logout: () => set({ isAuthenticated: false }),
      updateSignupData: (data) =>
        set((state) => ({ signupData: { ...state.signupData, ...data } })),
      submitB2BRequest: () =>
        set((state) => ({
          teacher: { ...state.teacher, b2bStatus: "pending" },
        })),
      setB2BStatus: (status) =>
        set((state) => ({ teacher: { ...state.teacher, b2bStatus: status } })),
      reset: () => set({ teacher: initialTeacher, isAuthenticated: true, signupData: {} }),
    }),
    { name: "sabbaq-auth-store" }
  )
);
