import type { SabbaqClass } from "@/types";

export const mockClasses: SabbaqClass[] = [
  {
    id: "cls-qdr-quant",
    name: "Qudurat - Quantitative",
    examType: "qudurat",
    section: "Quantitative",
    studentCount: 10,
    createdAt: "2026-08-20",
    description: "Quantitative reasoning preparation for the Qudurat exam — numbers, algebra, and geometry drills.",
  },
  {
    id: "cls-qdr-verbal",
    name: "Qudurat - Verbal",
    examType: "qudurat",
    section: "Verbal",
    studentCount: 9,
    createdAt: "2026-08-20",
    description: "Verbal reasoning and analogy practice for the Qudurat exam.",
  },
  {
    id: "cls-tah-math",
    name: "Tahsili - Mathematics",
    examType: "tahsili",
    section: "Mathematics",
    studentCount: 9,
    createdAt: "2026-08-22",
    description: "Core mathematics curriculum aligned with the Tahsili achievement test.",
  },
  {
    id: "cls-tah-science",
    name: "Tahsili - Science",
    examType: "tahsili",
    section: "Science",
    studentCount: 8,
    createdAt: "2026-08-22",
    description: "Physics, chemistry, and biology review for the Tahsili achievement test.",
  },
];
