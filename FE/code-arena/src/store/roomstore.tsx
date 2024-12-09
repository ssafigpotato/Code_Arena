import { create } from "zustand";
import api from "@/utils/api";
import { notFound } from "next/navigation";
import { Axios, AxiosError } from "axios";
import { Problem } from "./aistore";
export interface RoomResponse {
  roomId: string;
  roomMemberId: string;
  name?: string;
  password: string;
  status?: "PRIVATE" | "PUBLIC";
  startStatus: "ON" | "OFF" | "END";
  roomLanguage: "Java" | "Python" | "CPP";
  testTime: number;
  maxNum: number;
  members?: Member[];
  nowNum?: number;
  curNum?: number;
  startTime: string | null;
  tester: Member | null;
}
interface RoomStoreState {
  room: RoomResponse;
  roomList: RoomResponse[];
  isLoading: boolean;
  error: string | null;
  inputMaxNum: number;
  amIReady: boolean;
  isAllReady: boolean;
  isStarted: boolean;
  myRoomMemberId: string | null | undefined;
  setInputMaxNum: (inputNum: number) => void;
  fetchAllRooms: () => Promise<void>;
  fetchRoomById: (roomId: string) => Promise<any>;
  leaveRoom: (roomId: string, userId: string | undefined) => Promise<void>;
  toggleReady: (roomId: string | undefined | null) => void;
  checkAllReady: (roomId: string) => void;
  start: (roomId: string) => void;
  end: (roomId: string) => void;
  deleteRoom: (roomId: string) => void;
  setIsStarted: (input: boolean) => void;
  enterRoom: (data: enterRoomProps) => void;
}
export interface Member {
  roomId: string;
  memberId: string;
  roomMemberId: string;
  nickName: string;
  interviewerType: string;
  status: "FULL" | "ALREADY" | "INVITE" | "ACCEPT";
  roomLanguage: "Java" | "Python" | "CPP";
  testTime: number;
}
export interface enterRoomProps {
  roomId: string;
  password: string;
  type: "INTERVIEWER" | "TESTER" | string;
}

export const useRoomStore = create<RoomStoreState>((set) => ({
  room: {
    roomId: "",
    roomMemberId: "",
    password: "",
    roomLanguage: "Java",
    testTime: 0,
    startTime: null,
    endTime: 0,
    maxNum: 1,
    tester: null,
    startStatus: "OFF",
  },
  roomList: [],
  isLoading: false,
  error: null,
  inputMaxNum: 1,
  isStarted: false,
  amIReady: false,
  isAllReady: false,
  myRoomMemberId: null,
  setInputMaxNum: (inputNum) => {
    set({ inputMaxNum: inputNum });
  },
  fetchAllRooms: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<RoomResponse[]>("/room");
      set({ roomList: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching rooms:", error);
      set({ error: "Failed to fetch rooms", isLoading: false });
    }
  },
  fetchRoomById: async (roomId: string) => {
    set({ error: null });
    try {
      const response = await api.get<RoomResponse>("/room/" + roomId);
      set({ room: response.data });
      if (response.data.startStatus == "ON") {
        set({ isStarted: true });
      }
    } catch (error) {
      set({ error: "No room found" });
    }
  },
  enterRoom: async (data: enterRoomProps) => {
    try {
      const enterRoomResp = await api.post("/room/enter", data);
      set({ myRoomMemberId: enterRoomResp.data.roomMemberId });
    } catch (error) {
      console.log(error);
    }
  },

  leaveRoom: async (roomId: string, userId: string | undefined) => {
    set({ error: null });
    try {
      const leaveRoomResp = await api.post("/room/leave", {
        roomId: roomId,
        userId: userId,
      });
    } catch (error) {
      set({ error: "Tester Out" });
    }
    // set({ room: undefined });
    set({ isStarted: false });
    set({ isAllReady: false });
    set({ amIReady: false });
  },
  toggleReady: async (roomMemberId: string | undefined | null) => {
    set({ error: null });
    try {
      const toggleReadyResp = await api.put("/room/ready/" + roomMemberId);
      set((state) => ({ amIReady: !state.amIReady }));
    } catch (error) {
      set({ error: "Toggle Ready Failed" });
    }
  },
  checkAllReady: async (roomId: string) => {
    set({ error: null });
    try {
      const checkAllReadyResp = await api.get("/room/ready/" + roomId);
      if (checkAllReadyResp.data == true) {
        set({ isAllReady: true });
        // console.log("모두 준비 완료!");
      } else {
        set({ isAllReady: false });
        // console.log("아직 준비 안됐어");
      }
    } catch (error) {
      set({ error: "Check All Ready Failed" });
    }
  },
  start: async (roomId: string) => {
    const startResponse = await api.put("/room/start/" + roomId);
    set({ isStarted: true });
  },
  end: async (roomId: string) => {
    // const endResponse = await api.put("/room/end/" + roomId);
    set({ isStarted: false });
  },
  deleteRoom: async (roomId: string) => {
    const deleteResponse = await api.delete("/room/" + roomId);
  },
  setIsStarted: (input: boolean) => {
    set({ isStarted: input });
  },
}));
