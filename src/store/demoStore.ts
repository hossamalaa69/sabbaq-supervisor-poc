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

import { getStoredLanguage, translate } from "@/utils/i18n";

const sampleNames = {
  en: ["Khaled Al-Harbi", "Munira Al-Dosari", "Yousef Al-Shammari", "Haya Al-Qahtani"],
  ar: ["خالد الحربي", "منيرة الدوسري", "يوسف الشمري", "هيا القحطاني"],
};

function demoText(key: string, values?: Record<string, string | number>) {
  return translate(getStoredLanguage(), `demo.${key}`, values);
}

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
    toast.success(demoText("toastResetDone"));
  },
  simulateB2BApproval: () => {
    useAuthStore.getState().setB2BStatus("approved");
    toast.success(demoText("toastB2bApproved"));
  },
  addSampleStudent: () => {
    const lang = getStoredLanguage();
    const name = sampleNames[lang][Math.floor(Math.random() * sampleNames[lang].length)];
    useStudentsStore.getState().addStudent({ name, classId: "cls-qdr-quant", examType: "qudurat" });
    toast.success(
      demoText("toastStudentAdded", {
        name,
        class: translate(lang, "enums.examType.qudurat") + " - " + translate(lang, "enums.subject.Quantitative"),
      })
    );
  },
  generateSampleQuestion: () => {
    const isArabic = getStoredLanguage() === "ar";
    useQuestionsStore.getState().addQuestion({
      examType: "tahsili",
      section: "Mathematics",
      topic: isArabic ? "الجبر" : "Algebra",
      difficulty: "Medium",
      type: "Multiple Choice",
      prompt: isArabic ? "إذا كان ٥س + ٣ = ٢٨، فما قيمة س؟" : "If 5x + 3 = 28, what is the value of x?",
      choices: [
        { id: "A", label: isArabic ? "أ" : "A", text: isArabic ? "٤" : "4" },
        { id: "B", label: isArabic ? "ب" : "B", text: isArabic ? "٥" : "5" },
        { id: "C", label: isArabic ? "ج" : "C", text: isArabic ? "٦" : "6" },
        { id: "D", label: isArabic ? "د" : "D", text: isArabic ? "٧" : "7" },
      ],
      correctChoiceId: "B",
      explanation: isArabic ? "٥س = ٢٥، إذن س = ٥." : "5x = 25, so x = 5.",
    });
    toast.success(demoText("toastQuestionGenerated"));
  },
  simulateMeetingCreation: () => {
    const lang = getStoredLanguage();
    useMeetingsStore.getState().createMeeting({
      title: lang === "ar" ? "جلسة مراجعة اختبار القدرات" : "Sample Qudurat Revision Session",
      examType: "qudurat",
      date: lang === "ar" ? "٨ أكتوبر ٢٠٢٦" : "8 October 2026",
      time: lang === "ar" ? "٧:٠٠ مساءً" : "7:00 PM",
      durationMinutes: 60,
      participantCount: 10,
    });
    toast.success(demoText("toastMeetingSimulated"));
  },
}));
