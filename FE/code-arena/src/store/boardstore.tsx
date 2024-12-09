import { create } from "zustand";
import api from "@/utils/api";

export interface BoardData {
  board: {
    boardType: string;
    content: string;
    createdAt: string;
    deleted: boolean;
    deletedAt: string | null;
    id: string;
    likes: number;
    title: string;
    updatedAt: string;
    views: number;
  };
  comments: number;
  memberNickname: string;
  memberId: string;
}

export interface SearchData {
  boardId: string;
  title: string;
  content: string;
  nickname: string;
  comments: number;
  likes: number;
  writerImage: string | null;
  createdAt: string;
  boardType: string;
  views: number;
}

interface StoreState {
  boardList: BoardData[];
  board: BoardData | null;
  isLoading: boolean;
  error: string | null;
  publishBoard: (postData: {
    // memberId: string;
    title: string;
    content: string;
    type: string;
  }) => Promise<void>;
  fetchBoardList: (board: string) => Promise<void>;
  fetchBoardById: (boardId: string) => Promise<void>;
  updateBoard: (updateData: {
    boardId: string;
    title: string;
    content: string;
  }) => Promise<void>;
  deleteBoard: (boardId: string) => Promise<void>;
  likeBoard: (boardId: string, memberId: string) => Promise<void>;
  searchBoard: (searchType: string, keyword: string) => Promise<void>;
  searchResults: SearchData[];
}

const useBoardStore = create<StoreState>((set) => ({
  boardList: [],
  board: null,
  isLoading: false,
  error: null,
  searchResults: [],

  // 게시글 등록
  publishBoard: async (postData) => {
    set({ isLoading: true, error: null });
    try {
      console.log("Sending post data:", postData);
      const response = await api.post("/board", postData);
      console.log("Response received:", response.data);
      set((state) => ({
        boardList: [response.data, ...state.boardList],
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error creating post:", error);
      set({ error: "Failed to publish post", isLoading: false });
    }
  },

  // 게시글 리스트 조회
  fetchBoardList: async (board: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<BoardData[]>(`/board/type/${board}`);
      console.log(response.data);
      set({ boardList: response.data, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch posts", isLoading: false });
    }
  },

  // 게시글 상세 조회
  fetchBoardById: async (boardId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<BoardData>(`/board/${boardId}`);
      console.log(response.data);
      set({ board: response.data, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch post detail", isLoading: false });
    }
  },

  // 게시글 수정
  updateBoard: async (updateData) => {
    set({ isLoading: true, error: null });
    try {
      console.log("Sending update data:", updateData);
      const accessToken = localStorage.getItem("access"); // localStorage에서 토큰 가져오기
      if (!accessToken) {
        throw new Error("No token found");
      }
      const response = await api.put(`/board`, updateData, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // 요청 헤더에 토큰을 추가
        },
      });
      console.log("Response received:", response.data);
      set((state) => ({
        boardList: state.boardList.map((board) =>
          board.board.id === updateData.boardId ? response.data : board
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error updating post:", error);
      set({ error: "Failed to update post", isLoading: false });
    }
  },

  // 게시글 삭제
  deleteBoard: async (boardId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.delete(`/board/${boardId}`);
      console.log("Response received:", response.data);
      set((state) => ({
        boardList: state.boardList.filter(
          (board) => board.board.id !== boardId
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error deleting post:", error);
      set({ error: "Failed to delete post", isLoading: false });
    }
  },

  // 게시글 좋아요
  likeBoard: async (boardId, memberId) => {
    set({ isLoading: true, error: null });
    try {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) {
        throw new Error("No token found");
      }

      const response = await api.put(
        `/board/like`,
        { boardId, memberId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("Like response:", response.data);

      set((state) => ({
        board: state.board
          ? {
              ...state.board,
              board: {
                ...state.board.board,
                likes: response.data.likes,
              },
            }
          : null,
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error liking post:", error);
      set({ error: "Failed to like post", isLoading: false });
    }
  },

  // 게시글 검색
  searchBoard: async (searchType, keyword) => {
    set({ searchResults: [], isLoading: true, error: null });
    try {
      const response = await api.get<SearchData[]>(
        `/board/search/${searchType}/${keyword}`
      );
      console.log("Search results:", response.data);
      set({ searchResults: response.data, isLoading: false });
    } catch (error) {
      console.error("Error searching posts:", error);
      set({ error: "Failed to search posts", isLoading: false });
    }
  },
}));

export default useBoardStore;
