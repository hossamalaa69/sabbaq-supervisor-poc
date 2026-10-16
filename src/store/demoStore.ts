import { create } from "zustand";
import { useAuthStore } from "./authStore";
import { useStudentsStore } from "./studentsStore";
import { useClassesStore } from "./classesStore";
import { useQuestionsStore } from "./questionsStore";
import { useMaterialsStore } from "./materialsStore";
import { useStudyRoomStore } from "./studyRoomStore";
import { useMeetingsStore } from "./meetingsStore";
import { useNotificationsStore } from "./notificationsStore";
import { useAdminRequestsStore } from "./adminRequestsStore";
import { toast } from "sonner";

interface DemoState {
  isPanelOpen: boolean;
  togglePanel: () => void;
  resetDemo: () => void;
  simulateB2BApproval: () => void;
  addSampleStudent: () => void;
  generateSampleQuestion: () => void;
  simulateMeetingCreation: () => void;
}

const sampleNames = ["Khaled Al-Harbi", "Munira Al-Dosari", "Yousef Al-Shammari", "Haya Al-Qahtani"];

export const useDemoStore = create<DemoState>()((set) => ({
  isPanelOpen: false,
  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
  resetDemo: () => {
    useAuthStore.getState().reset();
    useStudentsStore.getState().reset();
    useClassesStore.getState().reset();
    useQuestionsStore.getState().reset();
    useMaterialsStore.getState().reset();
    useStudyRoomStore.getState().reset();
    useMeetingsStore.getState().reset();
    useNotificationsStore.getState().reset();
    useAdminRequestsStore.getState().reset();
    toast.success("Demo data has been reset to defaults.");
  },
  simulateB2BApproval: () => {
    useAuthStore.getState().setB2BStatus("approved");
    toast.success("B2B request approved! Welcome to Sabbaq Education Partner.");
  },
  addSampleStudent: () => {
    const name = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    useStudentsStore.getState().addStudent({ name, classId: "cls-qdr-quant", examType: "qudurat" });
    toast.success(`${name} was added to Qudurat - Quantitative.`);
  },
  generateSampleQuestion: () => {
    useQuestionsStore.getState().addQuestion({
      examType: "tahsili",
      section: "Mathematics",
      topic: "Algebra",
      difficulty: "Medium",
      type: "Multiple Choice",
      prompt: "If 5x + 3 = 28, what is the value of x?",
      choices: [
        { id: "A", label: "A", text: "4" },
        { id: "B", label: "B", text: "5" },
        { id: "C", label: "C", text: "6" },
        { id: "D", label: "D", text: "7" },
      ],
      correctChoiceId: "B",
      explanation: "5x = 25, so x = 5.",
    });
    toast.success("A new AI-generated question was added for review.");
  },
  simulateMeetingCreation: () => {
    useMeetingsStore.getState().createMeeting({
      title: "Sample Qudurat Revision Session",
      examType: "qudurat",
      date: "8 October 2026",
      time: "7:00 PM",
      durationMinutes: 60,
      participantCount: 10,
    });
    toast.success("A sample Google Meet session was created.");
  },
}));
