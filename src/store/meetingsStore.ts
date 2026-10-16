import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CreatedMeeting } from "@/types";
import { generateId } from "@/utils/format";

interface MeetingsState {
  meetings: CreatedMeeting[];
  createMeeting: (meeting: Omit<CreatedMeeting, "id" | "createdAt" | "meetLink">) => CreatedMeeting;
  reset: () => void;
}

export const useMeetingsStore = create<MeetingsState>()(
  persist(
    (set) => ({
      meetings: [],
      createMeeting: (meeting) => {
        const created: CreatedMeeting = {
          ...meeting,
          id: generateId("meet"),
          createdAt: new Date().toISOString(),
          meetLink: `https://meet.google.com/mock-sbq-${Math.floor(100 + Math.random() * 900)}`,
        };
        set((state) => ({ meetings: [created, ...state.meetings] }));
        return created;
      },
      reset: () => set({ meetings: [] }),
    }),
    { name: "sabbaq-meetings-store" }
  )
);
