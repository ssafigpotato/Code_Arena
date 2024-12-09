"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { notFound } from "next/navigation";
import styled, { css } from "styled-components";
import useBoardStore, { BoardData } from "@/store/boardstore";
import useUserStore from "@/store/userstore";
import useCommentStore from "@/store/commentstore";
import BorderButton from "@/components/common/button/BorderButton";

import { Viewer } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import "tui-color-picker/dist/tui-color-picker.css";
import "prismjs/themes/prism-tomorrow.css"; // 다크 테마 적용
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import Prism from "prismjs";

const BoardDetail: React.FC = () => {
  const params = useParams();

  const handleGoHome = () => {
    router.push("/");
  };

  const { board, isLoading, error, fetchBoardById, deleteBoard, likeBoard } =
    useBoardStore();
  const {
    comments,
    isLoading: commentLoading,
    error: commentError,
    fetchComments,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
  } = useCommentStore();

  const { currentUser } = useUserStore();

  const [newComment, setNewComment] = useState("");

  // 공개 댓글 여부
  const [isSecret, setIsSecret] = useState(false);

  // boardstore에서 게시글, 댓글 가져오기
  useEffect(() => {
    const boardId = params?.boardId;
    if (boardId) {
      const id = Array.isArray(boardId) ? boardId[0] : boardId; // typescript 오류 해결용도 (배열인지 아닌지 체크)
      fetchBoardById(id);
      fetchComments(id);
      console.log("currentUser: ", currentUser);
      console.log("Fetching board with ID: ", id);
    }
  }, [params]);

  // 에러 핸들링
  useEffect(() => {
    if (error) {
      console.error("Error fetching board:", error);
    }
    if (commentError) {
      console.error("Error fetching comments:", commentError);
    }
  }, [error, commentError]);

  const formatDate = (dateString: string) => {
    // 마이크로초 부분 제거
    const sanitizedDateString = dateString.split(".")[0];
    const date = new Date(sanitizedDateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}초 전`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}분 전`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}시간 전`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}일 전`;
    } else {
      // 7일이 넘으면 원래 날짜 형식으로 표시
      return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      }).format(date);
    }
  };

  // 댓글창 높이 동적 조정
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (commentInputRef.current) {
      commentInputRef.current.style.height = "auto";
      commentInputRef.current.style.height = `${commentInputRef.current.scrollHeight}px`;
    }
  }, [newComment]);

  const toggleSecret = () => {
    setIsSecret(!isSecret);
  };

  // 수정, 삭제 모달
  const { category, boardId } = params as { category: string; boardId: string }; // useParams로 category와 boardId 가져오기
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // 수정하기
  const handleEditClick = () => {
    router.push(`/community/${category}/edit/${boardId}`);
  };

  // 삭제하기
  const handleDeleteClick = async () => {
    const confirmDelete = confirm("정말 삭제하시겠습니까?");
    if (confirmDelete) {
      try {
        await deleteBoard(boardId);
        router.push(`/community/${category}`); // 삭제 후 게시글 목록 페이지로 이동
      } catch (error) {
        console.error("Failed to delete post:", error);
      }
    }
  };

  // 좋아요
  const handleLikeClick = async () => {
    if (currentUser) {
      try {
        await likeBoard(board!.board.id, currentUser.id);
      } catch (error) {
        console.error("Failed to like post:", error);
      }
    } else {
      alert("로그인이 필요합니다.");
    }
  };

  // 댓글 작성
  const handleCommentSubmit = async () => {
    const boardId = Array.isArray(params!.boardId)
      ? params!.boardId[0]
      : params!.boardId;
    if (currentUser && newComment.trim()) {
      try {
        await addComment({
          memberId: currentUser.id,
          boardId,
          content: newComment,
          secret: isSecret,
        });
        setNewComment("");
        setIsSecret(false);
      } catch (error) {
        console.error("Failed to add comment:", error);
      }
    } else {
      alert("로그인이 필요합니다.");
    }
  };

  // 댓글 모달 상태를 관리하는 부분
  const [commentModals, setCommentModals] = useState<boolean[]>(
    Array(comments.length).fill(false)
  );

  const toggleCommentModal = (index: number) => {
    setCommentModals((prev) => {
      const newModals = [...prev];
      newModals[index] = !newModals[index];
      return newModals;
    });
  };

  // 댓글 수정
  const [isEditing, setIsEditing] = useState<boolean[]>(
    Array(comments.length).fill(false)
  );
  const [editedComments, setEditedComments] = useState<string[]>(
    comments.map((comment) => comment.content)
  );

  const handleEditToggle = (index: number) => {
    setIsEditing((prev) => {
      const newEditing = [...prev];
      newEditing[index] = !newEditing[index];
      return newEditing;
    });
    setEditedComments((prev) => {
      const newComments = [...prev];
      newComments[index] = comments[index].content;
      return newComments;
    });
  };

  // 댓글 수정하기
  const handleCommentChange = (index: number, value: string) => {
    setEditedComments((prev) => {
      const newComments = [...prev];
      newComments[index] = value;
      return newComments;
    });
  };

  // 댓글 수정 취소(수정취소)
  const handleCancelEdit = (index: number) => {
    setIsEditing((prev) => {
      const newEditing = [...prev];
      newEditing[index] = false;
      return newEditing;
    });
    setEditedComments((prev) => {
      const newComments = [...prev];
      newComments[index] = comments[index].content;
      return newComments;
    });
  };

  // 저장(수정)
  const handleCommentSave = async (index: number, commentId: string) => {
    const boardId = Array.isArray(params!.boardId)
      ? params!.boardId[0]
      : params!.boardId; // 임시로 null 아님을 보장
    const commentData = {
      commentId,
      memberId: currentUser!.id,
      boardId,
      content: editedComments[index],
      secret: comments[index].secret,
    };

    try {
      await updateComment(commentData);
      setIsEditing((prev) => {
        const newEditing = [...prev];
        newEditing[index] = false;
        return newEditing;
      });
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: string) => {
    const confirmDelete = confirm("정말 댓글을 삭제하시겠습니까?");
    if (confirmDelete) {
      try {
        await deleteComment(commentId);
      } catch (error) {
        console.error("Failed to delete comment:", error);
      }
    }
  };

  // 댓글 좋아요
  const handleLikeComment = async (commentId: string) => {
    const boardId = Array.isArray(params!.boardId)
      ? params!.boardId[0]
      : params!.boardId;
    const commentData = {
      commentId,
      memberId: currentUser!.id,
      boardId,
    };

    try {
      await likeComment(commentData);
    } catch (error) {
      console.error("Failed to like comment:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!isLoading && !board)
    return (
      <Wrapper>
        <h1>404 - Page Not Found</h1>
        <p>존재하지 않는 페이지입니다.</p>
        <BorderButton
          text="홈으로"
          onClick={handleGoHome}
          $bgColor="#ffffff"
          $hoverColor="var(--primary-color)"
          $borderColor="#ffffff"
        />
      </Wrapper>
    );

  return (
    <PostContainer>
      <TitleWrapper>
        <PostTitle>{board!.board.title}</PostTitle>
        {currentUser?.id === board!.memberId && (
          <Buttons onClick={toggleModal}>
            <span className="material-icons">more_vert</span>
            {isModalOpen && (
              <Modal>
                <ModalButton onClick={handleEditClick}>
                  <span className="material-icons">edit_square</span>수정하기
                </ModalButton>
                <ModalButton onClick={handleDeleteClick}>
                  <span className="material-icons">delete</span>삭제하기
                </ModalButton>
              </Modal>
            )}
          </Buttons>
        )}
      </TitleWrapper>
      <PostMeta>
        <AuthorInfo>
          <ProfileImage
            src={"/default-profile.jpeg"}
            alt={`${board!.memberNickname}의 프로필 사진`}
          />
          {board!.memberNickname} · {formatDate(board!.board.createdAt)}
        </AuthorInfo>
        <PostStats>
          <span className="material-icons">visibility</span>
          {board!.board.views} <span className="material-icons">thumb_up</span>
          {board!.board.likes}{" "}
          <span className="material-icons">chat_bubble</span>
          {board!.comments}
        </PostStats>
      </PostMeta>
      <PostContent>
        <Viewer
          width="100%"
          plugins={[[codeSyntaxHighlight, { highlighter: Prism }]]}
          initialValue={board!.board.content}
          theme="dark"
        />
      </PostContent>

      <LikeButton onClick={handleLikeClick}>
        <span className="material-icons">thumb_up</span> {board!.board.likes}
      </LikeButton>

      <CommentsSection>
        <CommentsTitle>{comments.length}개의 댓글</CommentsTitle>

        {comments.map((comment, index) => (
          <CommentContainer key={index}>
            <CommentHeader>
              <CommentAuthor>
                <ProfileImage
                  src="/default-profile.jpeg"
                  alt={`${comment.nickname}의 프로필 사진`}
                />
                {comment.nickname} · {formatDate(comment.createdAt)}
              </CommentAuthor>
              <LikeButton onClick={() => handleLikeComment(comment.id)}>
                <span className="material-icons">thumb_up</span> {comment.likes}
              </LikeButton>
              {currentUser?.id === comment.memberId && (
                <Buttons onClick={() => toggleCommentModal(index)}>
                  <span className="material-icons">more_vert</span>
                  {commentModals[index] && (
                    <Modal>
                      <ModalButton onClick={() => handleEditToggle(index)}>
                        <span className="material-icons">edit_square</span>
                        수정하기
                      </ModalButton>
                      <ModalButton
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        <span className="material-icons">delete</span>삭제하기
                      </ModalButton>
                    </Modal>
                  )}
                </Buttons>
              )}
            </CommentHeader>
            <CommentContent>
              {isEditing[index] ? (
                <CommentEditContainer>
                  <CommentEditInput
                    value={editedComments[index]}
                    onChange={(e) => handleCommentChange(index, e.target.value)}
                  />
                  <ButtonContainer>
                    <CancelButton onClick={() => handleCancelEdit(index)}>
                      취소
                    </CancelButton>
                    <SaveButton
                      onClick={() => handleCommentSave(index, comment.id)}
                    >
                      저장
                    </SaveButton>
                  </ButtonContainer>
                </CommentEditContainer>
              ) : comment.secret ? (
                <SecretComment>
                  <span className="material-icons">lock</span>비공개 댓글입니다.
                </SecretComment>
              ) : (
                comment.content
              )}
            </CommentContent>
          </CommentContainer>
        ))}

        <CommentInputContainer>
          <InputWrapper>
            <ProfileImage src="/default-profile.jpeg" alt="프로필 사진" />
            <CommentInput
              ref={commentInputRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 남겨주세요."
            />
          </InputWrapper>
          <ButtonWrapper>
            <IsSecretButton onClick={toggleSecret} $isSecret={isSecret}>
              {/* <span className="material-icons">
                {isSecret ? "lock" : "lock_open"}
              </span>
              {isSecret ? "비공개 댓글" : "공개 댓글"} */}
            </IsSecretButton>
            <WriteButton onClick={handleCommentSubmit}>
              <span className="material-icons">edit</span>
              <span>댓글 쓰기</span>
            </WriteButton>
          </ButtonWrapper>
        </CommentInputContainer>
      </CommentsSection>
    </PostContainer>
  );
};

const PostContainer = styled.div`
  padding: 30px;
  color: white;
  font-family: Pretendard;
  line-height: 200%;
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const PostTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
`;

const Buttons = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 500;

  margin-left: 10px;
  background-color: none;
  cursor: pointer;
`;

const Modal = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #202e41;
  border: 1px solid white;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 110px;
`;

const ModalButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Pretendard;
  font-size: 18px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  gap: 10px;

  .material-icons {
    font-size: 24px;
  }

  &:hover {
    color: #ccc;
  }
`;

const PostContent = styled.div`
  font-size: 18px;
  margin-bottom: 100px;
  padding: 20px;
`;

const LikeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 500;
  border-radius: 20px;
  padding: 8px 12px;
  height: 40px;
  margin-left: auto;
  background-color: #202e41;
  border: 1px solid white;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--bg-color);
  }

  .material-icons {
    font-size: 16px;
    margin-right: 4px;
  }
`;

const PostMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid white;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 15px;
  margin-right: 10px;
`;

const PostStats = styled.div`
  display: flex;
  align-items: center;
  color: white;
  font-weight: 500;

  .material-icons {
    font-size: 16px;
    margin: 0 8px;
  }
`;

const CommentsSection = styled.div`
  margin-top: 30px;
  border-top: 1px solid white;
  font-size: 16px;
`;

const CommentsTitle = styled.h2`
  padding: 20px;
  margin-top: 10px;
`;

const CommentContainer = styled.div`
  border-radius: 20px;
  border: 1px solid white;
  padding: 20px;
  margin-bottom: 20px;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CommentAuthor = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

const CommentContent = styled.div`
  padding: 10px;
  margin-bottom: 5px;
`;

const SecretComment = styled.div`
  color: #7a828e;
  display: flex;
  align-items: center;

  .material-icons {
    margin-right: 4px;
  }
`;

const CommentInputContainer = styled.div`
  margin-top: 40px;
`;

const InputWrapper = styled.div`
  display: flex;
  flex: 1;
`;

const CommentInput = styled.textarea`
  flex: 1;
  font-family: Pretendard;
  padding: 12px;
  font-size: 16px;
  border-radius: 20px;
  border: 1px solid white;
  background-color: #202e41;
  color: white;
  resize: none;
  overflow: hidden;
  margin-left: 10px;

  ::placeholder {
    text-align: start;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

interface IsSecretButtonProps {
  $isSecret: boolean;
}

const IsSecretButton = styled.button<IsSecretButtonProps>`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-family: Pretendard;
  font-size: 18px;
  background: none;
  border: none;
  color: ${({ $isSecret }) => ($isSecret ? "white" : "#7A828E")};
  padding: 0;
  margin-left: 60px;

  .material-icons {
    margin-right: 4px;
  }
`;

const WriteButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 500;
  border-radius: 20px;
  padding: 8px 12px;
  margin-left: 10px;
  background-color: var(--yellow-color);
  cursor: pointer;
  transition: background-color 0.3s ease;
  color: black;

  &:hover {
    background-color: #ffe066;
  }

  .material-icons {
    margin-right: 4px;
  }
`;

const CommentEditContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const CommentEditInput = styled.textarea`
  flex: 1;
  font-family: Pretendard;
  padding: 12px;
  font-size: 16px;
  border-radius: 10px;
  border: 1px solid white;
  background-color: #202e41;
  color: white;
  resize: none;
  overflow: hidden;
  margin-bottom: 10px;

  ::placeholder {
    text-align: start;
  }
`;

const SaveButton = styled.button`
  align-self: flex-end;
  font-family: Pretendard;
  font-size: 16px;
  padding: 6px 12px;
  border-radius: 10px;
  background-color: var(--yellow-color);
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  color: black;

  &:hover {
    background-color: #ffe066;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
`;

const CancelButton = styled.button`
  font-family: Pretendard;
  font-size: 16px;
  padding: 6px 12px;
  border-radius: 10px;
  background-color: #f0f0f0;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  color: black;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const Wrapper = styled.div`
  min-height: 75vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: Pretendard;
  font-size: 40px;
  font-weight: 700;
  color: #ffffff;
  gap: 30px;
`;

export default BoardDetail;
