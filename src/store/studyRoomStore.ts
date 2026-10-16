import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StudyRoom, StudyRoomMessage, StudyRoomTopic, StudyRoomQuestionPost } from "@/types";
import { mockStudyRooms } from "@/mock";
import { generateId } from "@/utils/format";

interface StudyRoomState {
  rooms: StudyRoom[];
  createRoom: (room: Omit<StudyRoom, "id" | "createdAt" | "messages" | "topics" | "questionPosts">) => StudyRoom;
  sendMessage: (roomId: string, message: Omit<StudyRoomMessage, "id" | "createdAt">) => void;
  createTopic: (roomId: string, topic: Omit<StudyRoomTopic, "id" | "roomId" | "createdAt" | "messages">) => void;
  sendTopicMessage: (roomId: string, topicId: string, message: Omit<StudyRoomMessage, "id" | "createdAt">) => void;
  createQuestionPost: (roomId: string, post: Omit<StudyRoomQuestionPost, "id" | "roomId" | "createdAt" | "responses">) => void;
  reset: () => void;
}

export const useStudyRoomStore = create<StudyRoomState>()(
  persist(
    (set, get) => ({
      rooms: mockStudyRooms,
      createRoom: (room) => {
        const newRoom: StudyRoom = {
          ...room,
          id: generateId("room"),
          createdAt: new Date().toISOString().slice(0, 10),
          messages: [],
          topics: [],
          questionPosts: [],
        };
        set((state) => ({ rooms: [newRoom, ...state.rooms] }));
        return newRoom;
      },
      sendMessage: (roomId, message) =>
        set((state) => ({
          rooms: state.rooms.map((r) =>
            r.id === roomId
              ? {
                  ...r,
                  messages: [
                    ...r.messages,
                    { ...message, id: generateId("msg"), createdAt: new Date().toISOString() },
                  ],
                }
              : r
          ),
        })),
      createTopic: (roomId, topic) =>
        set((state) => ({
          rooms: state.rooms.map((r) =>
            r.id === roomId
              ? {
                  ...r,
                  topics: [
                    ...r.topics,
                    {
                      ...topic,
                      id: generateId("topic"),
                      roomId,
                      createdAt: new Date().toISOString().slice(0, 10),
                      messages: [],
                    },
                  ],
                }
              : r
          ),
        })),
      sendTopicMessage: (roomId, topicId, message) =>
        set((state) => ({
          rooms: state.rooms.map((r) =>
            r.id === roomId
              ? {
                  ...r,
                  topics: r.topics.map((t) =>
                    t.id === topicId
                      ? {
                          ...t,
                          messages: [
                            ...t.messages,
                            { ...message, id: generateId("tmsg"), createdAt: new Date().toISOString() },
                          ],
                        }
                      : t
                  ),
                }
              : r
          ),
        })),
      createQuestionPost: (roomId, post) =>
        set((state) => ({
          rooms: state.rooms.map((r) =>
            r.id === roomId
              ? {
                  ...r,
                  questionPosts: [
                    ...r.questionPosts,
                    {
                      ...post,
                      id: generateId("qp"),
                      roomId,
                      createdAt: new Date().toISOString(),
                      responses: [],
                    },
                  ],
                }
              : r
          ),
        })),
      reset: () => set({ rooms: mockStudyRooms }),
    }),
    {
      name: "sabbaq-studyroom-store",
      version: 1,
      migrate: (persistedState) => {
        const state = persistedState as Pick<StudyRoomState, "rooms">;
        const seededVoiceNote = mockStudyRooms
          .find((room) => room.id === "room-1")
          ?.messages.find((message) => message.id === "msg-voice-1");

        if (!state?.rooms || !seededVoiceNote) return state;
        return {
          ...state,
          rooms: state.rooms.map((room) =>
            room.id === "room-1" &&
            !room.messages.some((message) => message.id === seededVoiceNote.id)
              ? { ...room, messages: [...room.messages, seededVoiceNote] }
              : room
          ),
        };
      },
    }
  )
);
