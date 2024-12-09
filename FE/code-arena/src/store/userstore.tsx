import { create } from "zustand";
import api from "@/utils/api";
import { persist } from "zustand/middleware";
// import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  nickname: string;
  email: string;
  image: string;
  role: string;
  birth: string;
}

interface StoreState {
  searchResult: User | null;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;

  isAuthed: boolean | false;
  currentUser: User | null;

  // 로그인 여부, 로그인 한 사용자 상태 관리
  // 토큰 상태 관리 - (로그아웃에 쓰이지 않을까..)
  setToken: (token: string | null) => void;
  setIsAuthed: (isAuthed: boolean | false) => void;
  setCurrentUser: (userData: User | null) => void;
  // searchUsers: () => Promise<void>;

  // initializeStore: () => void;
  logout: () => void;
  deleteAccount: () => Promise<void>;
  updateUser: (nickname: string, image: string) => Promise<void>;
}

// const router = useRouter();

const useUserStore = create<StoreState>()(
  persist(
    (set) => ({
      searchResult: null,
      isLoading: false,
      error: null,
      accessToken: null,
      isAuthed: false,
      currentUser: null,

      // 토큰 상태도 전역에서 관리
      setToken: (token: string | null) => {
        localStorage.setItem("access", token || "");
        set({ isLoading: true, error: null, accessToken: token });
      },

      // 로그인 여부 상태 관리
      setIsAuthed: (isAuthed: boolean | false) => {
        set({ isAuthed: true });
      },

      // 현재 로그인한 사용자 상태 관리
      setCurrentUser: (userData: User | null) => {
        set({ currentUser: userData });
      },

      // searchUsers: async () => {
      //   set({ isLoading: true, error: null });
      //   try {
      //     const response = await api.get(`/member/search`);
      //     set({ searchResult: response.data, isLoading: false });
      //   } catch (error) {
      //     console.error("Error searching users:", error);
      //     set({ error: "Failed to search users", isLoading: false });
      //   }
      // },

      logout: () => {
        alert("로그아웃 되었습니다.");

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user-storage");

        set({ isAuthed: false, currentUser: null, accessToken: null });
        // 상태 초기화 시, persist된 데이터를 삭제
        window.localStorage.removeItem("user-storage");

        // window.location.reload;
        // router.push("/");
        window.location.href = "/";
      },

      // 회원탈퇴
      deleteAccount: async () => {
        try {
          set({ isLoading: true, error: null });

          const accessToken = localStorage.getItem("access");
          if (!accessToken) {
            throw new Error("No token found");
          }

          // DELETE 요청 보내기
          await api.delete("/member/", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          // 성공 시 상태 초기화
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          localStorage.removeItem("user-storage");

          set({
            isAuthed: false,
            currentUser: null,
            accessToken: null,
            isLoading: false,
          });

          alert("회원 탈퇴가 완료되었습니다. 그동안 이용해주셔서 감사합니다.");
          window.location.href = "/";
        } catch (error) {
          console.error("Error deleting account:", error);
          set({ error: "회원 탈퇴에 실패했습니다.", isLoading: false });
        }
      },

      // 회원정보 수정
      updateUser: async (nickname: string, image: string) => {
        try {
          set({ isLoading: true, error: null });

          const accessToken = localStorage.getItem("access");
          if (!accessToken) {
            throw new Error("No token found");
          }

          const response = await api.put(
            "/member/",
            {
              changeNickname: nickname,
              changeImage: image,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          set({ currentUser: response.data, isLoading: false });
          alert("회원정보가 성공적으로 수정되었습니다.");
        } catch (error) {
          console.error("Error updating user:", error);
          set({ error: "회원정보 수정에 실패했습니다.", isLoading: false });
        }
      },

      // initializeStore: () => {
      //   console.log("Initializing store 초기화됐닝?"); // Debug log
      //   const token = localStorage.getItem("access");
      //   // const userData = localStorage.getItem("currentUser");
      //   if (token) {
      //     console.log("토큰은 있잖아..", token);
      //     set({
      //       isAuthed: true,
      //       currentUser
      //       // currentUser: userData ? JSON.parse(userData) : null,
      //     });
      //     // console.log("유저정보도 보이는디", userData);
      //   } else {
      //     set({ isAuthed: false, currentUser: null });
      //   }
      // },
    }),
    {
      name: "user-storage", // name of the item in the storage (must be unique)
      // storage: createJSONStorage(() => sessionStorage), // (optional)이기 때문에 해당 줄을 적지 않으면 'localStorage'가 기본 저장소로 사용된다.
      // partialize: (state) => ({
      //   isAuthed: state.isAuthed,
      //   currentUser: state.currentUser,
      //   // ? { nickname: state.currentUser.nickname }
      //   // : null,
      // }),
    }
  )
);

export default useUserStore;
