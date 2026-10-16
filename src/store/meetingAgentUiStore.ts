import { create } from "zustand";

interface MeetingAgentUiState {
  isOpen: boolean;
  prefillClassId: string | null;
  open: (prefillClassId?: string) => void;
  close: () => void;
  toggle: () => void;
  consumePrefill: () => string | null;
}

export const useMeetingAgentUiStore = create<MeetingAgentUiState>()((set, get) => ({
  isOpen: false,
  prefillClassId: null,
  open: (prefillClassId) => set({ isOpen: true, prefillClassId: prefillClassId ?? null }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  consumePrefill: () => {
    const value = get().prefillClassId;
    set({ prefillClassId: null });
    return value;
  },
}));
