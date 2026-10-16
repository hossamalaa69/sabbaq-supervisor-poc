import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SabbaqClass } from "@/types";
import { mockClasses } from "@/mock";
import { generateId } from "@/utils/format";

interface ClassesState {
  classes: SabbaqClass[];
  addClass: (cls: Omit<SabbaqClass, "id" | "createdAt">) => void;
  updateClass: (id: string, updates: Partial<SabbaqClass>) => void;
  deleteClass: (id: string) => void;
  reset: () => void;
}

export const useClassesStore = create<ClassesState>()(
  persist(
    (set) => ({
      classes: mockClasses,
      addClass: (cls) =>
        set((state) => ({
          classes: [
            {
              ...cls,
              id: generateId("cls"),
              createdAt: new Date().toISOString().slice(0, 10),
            },
            ...state.classes,
          ],
        })),
      updateClass: (id, updates) =>
        set((state) => ({
          classes: state.classes.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),
      deleteClass: (id) =>
        set((state) => ({ classes: state.classes.filter((c) => c.id !== id) })),
      reset: () => set({ classes: mockClasses }),
    }),
    { name: "sabbaq-classes-store" }
  )
);
