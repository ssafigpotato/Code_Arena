import { create } from "zustand";
import api from "@/utils/api";

interface Invite {
  groupId: string;
  memberId: string;
  inviteCode: string;
  memberNickname: string;
  memberEmail: string;
}

interface Leader {
  id: string;
  email: string;
  name: string;
  nickname: string;
  birth: string;
  role: string;
  image: string;
}

interface GroupResponse {
  groupId: string;
  groupName: string;
  information: string;
  language: string;
  maxNum: number;
  curNum: number;
  createdAt: string;
  groupType: "PUBLIC" | "PRIVATE";
  leader: Leader;
}

interface MemberResponse {
  id: string;
  email: string;
  name: string;
  nickname: string;
  birth: string;
  role: string;
  image: string;
}

interface GroupMember {
  groupId: string;
  meetingTime: number;
  memberResponse: MemberResponse;
  inviteCode: string;
  type: string;
}

interface GroupDetail {
  groupResponse: GroupResponse;
  groupMembers: GroupMember[];
}

interface GroupStoreState {
  groups: GroupResponse[];
  groupDetail: GroupDetail | null;
  inviteList: Invite[];
  isLoading: boolean;
  error: string | null;
  // 내가 속한 그룹
  myGroups: GroupDetail[];

  createGroup: (
    groupData: Omit<
      GroupResponse,
      "groupId" | "curNum" | "leader" | "createdAt"
    > & {
      leaderId: string;
    }
  ) => Promise<void>;
  fetchAllGroups: () => Promise<void>;
  fetchGroupById: (id: string) => Promise<void>;
  fetchGroupInvites: (groupId: string) => Promise<void>;
  deleteGroupById: (id: string) => Promise<void>;
  applyToGroup: (groupId: string, memberId: string) => Promise<void>;
  acceptGroupRequest: (groupId: string, memberId: string) => Promise<void>;
  rejectGroupRequest: (groupId: string, memberId: string) => Promise<void>;
  updateGroup: (groupData: {
    groupId: string;
    information: string;
    language: string;
  }) => Promise<void>;

  // 내 그룹 메서드
  mygroup: () => Promise<void>;

  changeGroupLeader: (groupId: string, leaderId: string) => Promise<void>;
}

const useGroupStore = create<GroupStoreState>((set) => ({
  groups: [],
  groupDetail: null,
  inviteList: [],
  isLoading: false,
  error: null,
  myGroups: [], // 내가 속한 그룹들 저장

  // 그룹 생성
  createGroup: async (groupData) => {
    set({ isLoading: true, error: null });
    try {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) {
        throw new Error("No token found");
      }

      const response = await api.post("/group", groupData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      set((state) => ({
        groups: [...state.groups, response.data],
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error creating group:", error);
      set({ error: "Failed to create group", isLoading: false });
    }
  },

  // 그룹 리스트 조회
  fetchAllGroups: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<GroupResponse[]>("/group/all");
      set({ groups: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching groups:", error);
      set({ error: "Failed to fetch groups", isLoading: false });
    }
  },

  // 그룹 상세 조회
  fetchGroupById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<GroupDetail>(`/group/${id}`);
      set({ groupDetail: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching group details:", error);
      set({ error: "Failed to fetch group details", isLoading: false });
    }
  },

  // 그룹 초대 리스트 조회
  fetchGroupInvites: async (groupId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<Invite[]>(`/group/invite/${groupId}`);
      set({ inviteList: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching group invites:", error);
      set({ error: "Failed to fetch group invites", isLoading: false });
    }
  },

  // 그룹 삭제
  deleteGroupById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) {
        throw new Error("No token found");
      }

      await api.delete(`/group/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      set((state) => ({
        groups: state.groups.filter((group) => group.groupId !== id),
        groupDetail:
          state.groupDetail?.groupResponse.groupId === id
            ? null
            : state.groupDetail,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error deleting group:", error);
      set({ error: "Failed to delete group", isLoading: false });
    }
  },

  // 공개 그룹 가입 신청
  applyToGroup: async (groupId, memberId) => {
    set({ isLoading: true, error: null });
    try {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) {
        throw new Error("No token found");
      }

      const requestBody = { groupId, memberId };

      const response = await api.post("/group/apply", requestBody, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("Apply response:", response.data);
      set({ isLoading: false });
      return response.data; // 응답 데이터를 반환
    } catch (error) {
      console.error("Error applying to group:", error);
      set({ error: "Failed to apply to group", isLoading: false });
      throw error; // 에러를 던져서 호출한 곳에서 처리할 수 있게 함
    }
  },

  // 그룹 가입 요청 수락
  acceptGroupRequest: async (groupId, memberId) => {
    set({ isLoading: true, error: null });
    try {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) {
        throw new Error("No token found");
      }

      const requestBody = { groupId, memberId };

      const response = await api.post("/group/accept", requestBody, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("Accept response:", response.data);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      console.error("Error accepting group request:", error);
      set({ error: "Failed to accept group request", isLoading: false });
      throw error;
    }
  },

  // 그룹 가입 요청 거절, 강퇴, 탈퇴
  rejectGroupRequest: async (groupId, memberId) => {
    set({ isLoading: true, error: null });
    try {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) {
        throw new Error("No token found");
      }

      const requestBody = { groupId, memberId };

      const response = await api.post("/group/withdraw", requestBody, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log("Reject response:", response.data);
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      console.error("Error rejecting group request:", error);
      set({ error: "Failed to reject group request", isLoading: false });
      throw error;
    }
  },

  // 그룹 수정
  updateGroup: async (groupData) => {
    set({ isLoading: true, error: null });
    try {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) {
        throw new Error("No token found");
      }

      const response = await api.put("/group", groupData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("Update Group: ", response);

      set((state) => ({
        groupDetail:
          state.groupDetail &&
          state.groupDetail.groupResponse.groupId === groupData.groupId
            ? {
                ...state.groupDetail,
                groupResponse: {
                  ...state.groupDetail.groupResponse,
                  ...groupData,
                },
              }
            : state.groupDetail,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error updating group:", error);
      set({ error: "Failed to update group", isLoading: false });
    }
  },

  // 내 그룹 조회
  mygroup: async () => {
    set({ isLoading: true, error: null });
    try {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) {
        throw new Error("No token found");
      }

      const response = await api.get<GroupDetail[]>("/group/my", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      set({ myGroups: response.data, isLoading: false }); // 응답 데이터를 상태로 설정
    } catch (error) {
      console.error("Error fetching my groups:", error);
      set({ error: "Failed to fetch my groups", isLoading: false });
    }
  },

  // 그룹장 위임
  changeGroupLeader: async (groupId, leaderId) => {
    set({ isLoading: true, error: null });
    try {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) {
        throw new Error("No token found");
      }

      const requestBody = { groupId, leaderId };

      const response = await api.post("/group/change", requestBody, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("Change Leader response:", response.data);

      set((state) => ({
        groupDetail:
          state.groupDetail &&
          state.groupDetail.groupResponse.groupId === groupId
            ? {
                ...state.groupDetail,
                groupResponse: {
                  ...state.groupDetail.groupResponse,
                  leader: response.data,
                },
              }
            : state.groupDetail,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error changing group leader:", error);
      set({ error: "Failed to change group leader", isLoading: false });
    }
  },
}));
export default useGroupStore;
