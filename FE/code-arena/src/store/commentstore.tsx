import { create } from "zustand";
import api from "@/utils/api";

interface Comment {
  id: string;
  content: string;
  likes: number;
  nickname: string;
  secret: boolean;
  createdAt: string;
  memberId: string;
}

interface CommentStoreState {
  comments: Comment[];
  isLoading: boolean;
  error: string | null;
  fetchComments: (boardId: string) => Promise<void>;
  addComment: (commentData: {
    memberId: string;
    boardId: string;
    content: string;
    secret: boolean;
  }) => Promise<void>;
  updateComment: (commentData: {
    commentId: string;
    memberId: string;
    boardId: string;
    content: string;
    secret: boolean;
  }) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  likeComment: (commentData: {
    commentId: string;
    memberId: string;
    boardId: string;
  }) => Promise<void>;
}

const useCommentStore = create<CommentStoreState>((set) => ({
  comments: [],
  isLoading: false,
  error: null,

  // 댓글 조회
  fetchComments: async (boardId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<Comment[]>(`/comment/${boardId}`);
      console.log(response.data);
      set({ comments: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching comments:", error);
      set({ error: "Failed to fetch comments", isLoading: false });
    }
  },

  // 댓글 작성
  addComment: async (commentData) => {
    set({ isLoading: true, error: null });
    try {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) {
        throw new Error("No token found");
      }

      const response = await api.post(`/comment`, commentData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      set((state) => ({
        comments: [response.data, ...state.comments],
        isLoading: false,
      }));
      window.location.reload(); // 새로고침
    } catch (error) {
      console.error("Error adding comment:", error);
      set({ error: "Failed to add comment", isLoading: false });
    }
  },

  // 댓글 수정
  updateComment: async (commentData) => {
    set({ isLoading: true, error: null });
    try {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) {
        throw new Error("No token found");
      }

      const response = await api.put(`/comment`, commentData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      set((state) => ({
        comments: state.comments.map((comment) =>
          comment.id === commentData.commentId ? response.data : comment
        ),
        isLoading: false,
      }));
      window.location.reload(); // 새로고침
    } catch (error) {
      console.error("Error updating comment:", error);
      set({ error: "Failed to update comment", isLoading: false });
    }
  },

  // 댓글 삭제
  deleteComment: async (commentId) => {
    set({ isLoading: true, error: null });
    try {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) {
        throw new Error("No token found");
      }

      await api.delete(`/comment/${commentId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      set((state) => ({
        comments: state.comments.filter((comment) => comment.id !== commentId),
        isLoading: false,
      }));
      window.location.reload(); // 새로고침
    } catch (error) {
      console.error("Error deleting comment:", error);
      set({ error: "Failed to delete comment", isLoading: false });
    }
  },

  // 댓글 좋아요
  likeComment: async (commentData) => {
    set({ isLoading: true, error: null });
    try {
      const accessToken = localStorage.getItem("access");
      if (!accessToken) {
        throw new Error("No token found");
      }

      const response = await api.put(
        `/comment/like/${commentData.commentId}`,
        commentData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      set((state) => ({
        comments: state.comments.map((comment) =>
          comment.id === commentData.commentId
            ? { ...comment, likes: response.data.likes } // 서버에서 받은 likes 값으로 업데이트
            : comment
        ),
        isLoading: false,
      }));

      console.log(response);
    } catch (error) {
      console.error("Error liking comment:", error);
      set({ error: "Failed to like comment", isLoading: false });
    }
  },
}));

export default useCommentStore;
