import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PortalNotification } from "@/types";
import { generateId } from "@/utils/format";

const seededNotifications: PortalNotification[] = [
  {
    id: "notif-1",
    category: "administration",
    title: { en: "Exam season schedule published", ar: "نشر جدول موسم الاختبارات" },
    message: {
      en: "Administration published the Qudurat and Tahsili revision calendar for this term.",
      ar: "نشرت الإدارة تقويم مراجعات القدرات والتحصيلي لهذا الفصل.",
    },
    createdAt: "2026-10-15T09:00:00",
    read: false,
    important: true,
    emailSent: true,
  },
  {
    id: "notif-2",
    category: "student",
    title: { en: "New student join requests", ar: "طلبات انضمام جديدة" },
    message: {
      en: "Students are waiting for approval to join your classes.",
      ar: "يوجد طلاب بانتظار موافقتك على الانضمام إلى فصولك.",
    },
    createdAt: "2026-10-15T08:20:00",
    read: false,
    important: true,
    emailSent: true,
    link: "/students",
  },
  {
    id: "notif-3",
    category: "student",
    title: { en: "New voice note in a study room", ar: "رسالة صوتية جديدة في غرفة مذاكرة" },
    message: {
      en: "A student sent a voice note asking about ratio problems.",
      ar: "أرسل طالب رسالة صوتية يسأل فيها عن مسائل النسب.",
    },
    createdAt: "2026-10-14T18:10:00",
    read: false,
    important: false,
    emailSent: false,
    link: "/study-rooms/room-1",
  },
  {
    id: "notif-4",
    category: "platform",
    title: { en: "Question bank updated", ar: "تحديث بنك الأسئلة" },
    message: {
      en: "New exam-style practice questions are available for review.",
      ar: "تتوفر أسئلة تدريبية جديدة بنمط الاختبار للمراجعة.",
    },
    createdAt: "2026-10-13T12:00:00",
    read: true,
    important: false,
    emailSent: false,
    link: "/questions/review",
  },
  {
    id: "notif-5",
    category: "request",
    title: { en: "Administration replied to your request", ar: "ردت الإدارة على طلبك" },
    message: {
      en: "Your request about additional practice exams is now in review.",
      ar: "طلبك بشأن اختبارات تدريبية إضافية قيد المراجعة الآن.",
    },
    createdAt: "2026-10-12T15:30:00",
    read: true,
    important: true,
    emailSent: true,
    link: "/admin-requests",
  },
];

interface NotificationsState {
  notifications: PortalNotification[];
  emailEnabled: boolean;
  importantEmailOnly: boolean;
  addNotification: (
    notification: Omit<PortalNotification, "id" | "createdAt" | "read" | "emailSent">
  ) => void;
  markRead: (id: string) => void;
  markUnread: (id: string) => void;
  markAllRead: () => void;
  setEmailPreferences: (emailEnabled: boolean, importantEmailOnly: boolean) => void;
  reset: () => void;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set) => ({
      notifications: seededNotifications,
      emailEnabled: true,
      importantEmailOnly: false,
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: generateId("notif"),
              createdAt: new Date().toISOString(),
              read: false,
              emailSent:
                state.emailEnabled &&
                (!state.importantEmailOnly || notification.important),
            },
            ...state.notifications,
          ],
        })),
      markRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((item) =>
            item.id === id ? { ...item, read: true } : item
          ),
        })),
      markUnread: (id) =>
        set((state) => ({
          notifications: state.notifications.map((item) =>
            item.id === id ? { ...item, read: false } : item
          ),
        })),
      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((item) => ({ ...item, read: true })),
        })),
      setEmailPreferences: (emailEnabled, importantEmailOnly) =>
        set({ emailEnabled, importantEmailOnly }),
      reset: () =>
        set({
          notifications: seededNotifications,
          emailEnabled: true,
          importantEmailOnly: false,
        }),
    }),
    { name: "sabbaq-notifications-store" }
  )
);
