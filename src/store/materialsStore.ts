import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StudyMaterial } from "@/types";
import { mockMaterials } from "@/mock";
import { generateId } from "@/utils/format";

interface MaterialsState {
  materials: StudyMaterial[];
  addMaterial: (material: Omit<StudyMaterial, "id" | "uploadDate" | "status">) => void;
  reset: () => void;
}

export const useMaterialsStore = create<MaterialsState>()(
  persist(
    (set) => ({
      materials: mockMaterials,
      addMaterial: (material) =>
        set((state) => ({
          materials: [
            {
              ...material,
              id: generateId("mat"),
              uploadDate: new Date().toISOString().slice(0, 10),
              status: "Published",
            },
            ...state.materials,
          ],
        })),
      reset: () => set({ materials: mockMaterials }),
    }),
    { name: "sabbaq-materials-store" }
  )
);
