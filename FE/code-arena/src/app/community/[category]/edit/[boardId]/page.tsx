"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import { notFound } from "next/navigation";
import styled from "styled-components";
import useBoardStore, { BoardData } from "@/store/boardstore";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import { Editor } from "@toast-ui/react-editor";

export default function EditPage() {
  const editorRef = useRef<Editor | null>(null); // 타입스크립트 오류 해결

  // 경로 검사
  const params = useParams();
  const router = useRouter();
  const validBoards = ["feedbacks", "groups", "questions"];
  const category = params?.category as string;
  const boardId = params?.boardId as string;

  // 404 페이지로 리다이렉트
  useEffect(() => {
    if (!validBoards.includes(category)) {
      notFound();
    }
  }, [category]);

  if (!validBoards.includes(category as string)) {
    return null;
  }

  // 글 작성 중인지 확인용 변수
  const [isDirty, setIsDirty] = useState(false);

  const handleFormChange = () => {
    setIsDirty(true);
  };

  // 토큰에서 사용자 id 추출해서 작성자인지 아닌지 비교하는 로직 필요
  // boardstore에서 게시글 가져오기
  const { board, isLoading, error, fetchBoardById, updateBoard } =
    useBoardStore();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    if (boardId) {
      fetchBoardById(boardId);
      // console.log(boardId);
    }
  }, [boardId, fetchBoardById]);

  // board 상태 설정
  useEffect(() => {
    if (board) {
      setTitle(board.board.title);
      setContent(board.board.content);
      setType(board.board.boardType);
    }
  }, [board]);

  // 수정하기 버튼
  // 정말 수정하시겠습니까? alert 필요할까?
  const handleFormSubmit = async () => {
    const content = editorRef.current?.getInstance().getMarkdown(); // 에디터에서 markdown 텍스트를 가져옴

    // 제목과 내용을 확인 (공백 제외하고)
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    const boardData = {
      boardId,
      title,
      content,
    };

    try {
      setIsDirty(false);
      await updateBoard(boardData); // await에 의해 이 작업이 완료된 후
      console.log("Type inside handleFormSubmit:", type);
      router.push(`/community/${type.toLowerCase()}/${boardId}`); //라우터가 푸쉬됨
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  // 글 작성 중 새로고침 방지
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  // 글 작성 중 뒤로가기 방지, 페이지 이동 방지 필요

  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>{error}</div>;
  // if (!board) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <>
      <Wrapper>
        <Title>제목</Title>
        <TitleInput
          type="text"
          placeholder="제목을 입력해주세요."
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            handleFormChange();
          }}
        />
        <Title>내용</Title>
        {/* <ContentInput
          placeholder="내용을 입력해주세요."
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            handleFormChange();
          }}
        /> */}

        {/* board 데이터가 로드되기 전까지 로딩 상태 표시 */}
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          board && (
            <Editor
              ref={editorRef}
              height="450px"
              initialValue={board?.board.content}
              placeholder="내용을 입력해주세요."
              previewStyle={window.innerWidth > 1000 ? "vertical" : "tab"}
              initialEditType="markdown"
              hideModeSwitch={false}
              toolbarItems={[
                ["heading", "bold", "italic", "strike"],
                ["hr", "quote"],
                ["table", "image", "link"],
                ["code", "codeblock"],
                ["scrollSync"],
              ]}
              theme="dark"
              usageStatistics={false}
              onChange={handleFormChange} // 내용이 변경될 때 isDirty 설정
            />
          )
        )}
        <ButtonWrapper>
          <WriteButton onClick={handleFormSubmit} disabled={isLoading}>
            <span className="material-icons">edit</span>
            <span>수정하기</span>
          </WriteButton>
        </ButtonWrapper>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  font-family: Pretendard;
  display: flex;
  flex-direction: column;

  width: 1000px;
  margin: 0px auto;
`;

const Title = styled.div`
  color: white;
  font-size: 32px;
  font-weight: 700;
  font-family: Pretendard;
  padding: 10px;
  margin-top: 20px;
  margin-bottom: 10px;
`;

const TitleInput = styled.input`
  padding: 12px;
  font-size: 16px;
  border-radius: 20px;
  border: 1px solid white;
  background-color: #202e41;
  color: white;
  margin: 0 10px;
  margin-bottom: 20px;
`;

const ContentInput = styled.textarea`
  font-family: Pretendard;
  padding: 12px;
  font-size: 16px;
  border-radius: 20px;
  border: 1px solid white;
  background-color: #202e41;
  margin: 0 10px;
  color: white;
  height: 300px;
  resize: none;

  ::placeholder {
    text-align: start;
  }

  /* 웹킷 기반 브라우저 스크롤바 커스터마이징 */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #202e41;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  /* 파이어폭스 스크롤바 커스터마이징 */
  scrollbar-width: thin;
  scrollbar-color: #888 #202e41;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin: 40px 0;
`;

const WriteButton = styled.button`
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
  border: none;

  &:hover {
    background-color: #ffe066;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .material-icons {
    margin-right: 4px;
  }
`;
