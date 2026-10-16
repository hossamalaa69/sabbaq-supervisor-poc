import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AdminRequest,
  AdminRequestCategory,
  AdminRequestKind,
  AdminRequestStatus,
} from "@/types";
import { generateId } from "@/utils/format";
import { useNotificationsStore } from "./notificationsStore";

const adminAuthor = { en: "Sabbaq Administration", ar: "إدارة سباق" };

const seededRequests: AdminRequest[] = [
  {
    id: "admin-req-1",
    kind: "request",
    category: "content",
    subject: "Additional Tahsili chemistry practice exams",
    message: "Please add two more full-length Tahsili practice exams with chemistry-heavy sections.",
    status: "inReview",
    createdAt: "2026-10-10T10:00:00",
    updatedAt: "2026-10-12T15:30:00",
    responses: [
      {
        id: "admin-res-1",
        author: adminAuthor,
        message: {
          en: "Thank you. The content team is reviewing this request.",
          ar: "شكراً لك. يراجع فريق المحتوى هذا الطلب حالياً.",
        },
        createdAt: "2026-10-12T15:30:00",
      },
    ],
  },
  {
    id: "admin-req-2",
    kind: "feedback",
    category: "technical",
    subject: "Study room usability feedback",
    message: "The study room layout is clear and easy for students to use.",
    status: "resolved",
    createdAt: "2026-10-03T13:00:00",
    updatedAt: "2026-10-05T09:15:00",
    responses: [
      {
        id: "admin-res-2",
        author: adminAuthor,
        message: {
          en: "We appreciate the feedback and have shared it with the product team.",
          ar: "نقدّر ملاحظاتك، وقد شاركناها مع فريق المنتج.",
        },
        createdAt: "2026-10-05T09:15:00",
      },
    ],
  },
];

const nextStatus: Record<AdminRequestStatus, AdminRequestStatus> = {
  submitted: "inReview",
  inReview: "resolved",
  resolved: "resolved",
  rejected: "rejected",
};

interface AdminRequestsState {
  requests: AdminRequest[];
  submitRequest: (input: {
    kind: AdminRequestKind;
    category: AdminRequestCategory;
    subject: string;
    message: string;
  }) => void;
  simulateAdminResponse: (requestId: string) => void;
  reset: () => void;
}

export const useAdminRequestsStore = create<AdminRequestsState>()(
  persist(
    (set, get) => ({
      requests: seededRequests,
      submitRequest: (input) => {
        const now = new Date().toISOString();
        set((state) => ({
          requests: [
            {
              ...input,
              id: generateId("admin-req"),
              status: "submitted",
              createdAt: now,
              updatedAt: now,
              responses: [],
            },
            ...state.requests,
          ],
        }));
        useNotificationsStore.getState().addNotification({
          category: "request",
          title: { en: "Request submitted", ar: "تم إرسال الطلب" },
          message: {
            en: `Administration received “${input.subject}”.`,
            ar: `استلمت الإدارة «${input.subject}».`,
          },
          important: false,
          link: "/admin-requests",
        });
      },
      simulateAdminResponse: (requestId) => {
        const request = get().requests.find((item) => item.id === requestId);
        if (!request || request.status === "resolved" || request.status === "rejected") return;

        const status = nextStatus[request.status];
        const now = new Date().toISOString();
        const response = {
          id: generateId("admin-res"),
          author: adminAuthor,
          message:
            status === "resolved"
              ? {
                  en: "Your request has been resolved. Please check the platform for the update.",
                  ar: "تمت معالجة طلبك. يرجى مراجعة المنصة للاطلاع على التحديث.",
                }
              : {
                  en: "Your request is now under review by the administration team.",
                  ar: "طلبك الآن قيد المراجعة لدى فريق الإدارة.",
                },
          createdAt: now,
        };

        set((state) => ({
          requests: state.requests.map((item) =>
            item.id === requestId
              ? { ...item, status, updatedAt: now, responses: [...item.responses, response] }
              : item
          ),
        }));
        useNotificationsStore.getState().addNotification({
          category: "request",
          title:
            status === "resolved"
              ? { en: "Request resolved", ar: "تمت معالجة الطلب" }
              : { en: "Request in review", ar: "الطلب قيد المراجعة" },
          message: {
            en: `Administration updated “${request.subject}”.`,
            ar: `حدّثت الإدارة حالة «${request.subject}».`,
          },
          important: true,
          link: "/admin-requests",
        });
      },
      reset: () => set({ requests: seededRequests }),
    }),
    { name: "sabbaq-admin-requests-store" }
  )
);
