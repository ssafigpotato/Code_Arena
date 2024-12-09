"use client";
import { useState, useEffect } from "react";
import styled from "styled-components";
import BorderButton from "@/components/common/button/BorderButton";
import { notFound, useParams, useRouter } from "next/navigation";
import { useRoomStore } from "@/store/roomstore";
import useUserStore from "@/store/userstore";

function Interviewer() {
  const roomId = useParams<{ id: string }>()?.id;
  const UUID =
    /^[0-9A-Fa-f]{8}\-[0-9A-Fa-f]{4}\-[0-9A-Fa-f]{4}\-[0-9A-Fa-f]{4}\-[0-9A-Fa-f]{12}$/;
  if (!roomId || !UUID.test(roomId)) {
    notFound();
  }

  const { room, error } = useRoomStore();
  const { currentUser } = useUserStore();

  const [score, setScore] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 글 작성 중인지 확인용 변수
  const [isDirty, setIsDirty] = useState(false);

  const handleFormChange = () => {
    setIsDirty(true);
  };

  // 발행 버튼
  const handleFormSubmit = async () => {
    setIsDirty(false);
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

  return (
    <Wrapper>
      <TestWrapper>
        <Title>테스트 피드백</Title>
        <Test>
          <Detail>
            <Header>| 테스트 상세</Header>
            <Context>
              <TableHeader>
                <p>참여테스트</p>
                <p>테스트시간</p>
              </TableHeader>
              <Table>
                <p>{room.name}</p>
                <p>167분 / {room.testTime}분</p>
                {/* room.endTime 필요 */}
              </Table>
            </Context>
          </Detail>
          <Detail>
            <Header>| 점수 입력</Header>
            <Form>
              <TestInput
                type="number"
                placeholder=""
                width="80px"
                min="0"
                value={score}
                onChange={(e) => {
                  setScore(e.target.value);
                  handleFormChange();
                }}
              />
              <TestText>/ 100점</TestText>
            </Form>
          </Detail>
        </Test>
        <WriteContainer>
          <Header>| 코멘트 작성</Header>
          <WriteForm>
            <p>제목</p>
            <TitleInput
              type="text"
              placeholder="제목을 입력해주세요."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                handleFormChange();
              }}
            />
          </WriteForm>
          <WriteForm>
            <p>내용</p>
            <ContentInput
              placeholder="내용을 입력해주세요."
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                handleFormChange();
              }}
            />
          </WriteForm>
          <ButtonWrapper>
            <WriteButton onClick={handleFormSubmit}>
              <span className="material-icons">edit</span>
              <span>발행하기</span>
            </WriteButton>
          </ButtonWrapper>
        </WriteContainer>
      </TestWrapper>
    </Wrapper>
  );
}

function Interviewee() {
  const router = useRouter();

  const handleGoDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <Wrapper>
      <Message>
        <h2>수고하셨습니다.</h2>
        <h1>테스트가 성공적으로 종료되었습니다!</h1>
        <h1>리포트 생성까지 시간이 걸릴 수 있습니다.</h1>
      </Message>
      <TestDetail>
        <Detail>
          <Header>| 테스트 상세</Header>
          <Context>
            <TableHeader>
              <p>시작시간</p>
              <p>참여테스트</p>
              <p>테스트시간</p>
            </TableHeader>
            <Table>
              <p>2024. 07. 24 10:00</p>
              <p>OO회사 대비 라이브코딩</p>
              <p>167min / 180min</p>
            </Table>
          </Context>
        </Detail>
        <Button>녹화본 시청하기</Button>
      </TestDetail>
      <BorderButton
        text="대시보드"
        onClick={handleGoDashboard}
        $bgColor="#ffffff"
        $hoverColor="var(--primary-color)"
        $borderColor="#ffffff"
      />
    </Wrapper>
  );
}

export default function Index() {
  const roomId = useParams<{ id: string }>()?.id;
  const { currentUser } = useUserStore();
  const { room, fetchRoomById } = useRoomStore();
  useEffect(() => {
    if (roomId) {
      fetchRoomById(roomId);
    }
    return () => {};
  }, []);

  const MyType =
    room.tester?.memberId == currentUser?.id ? "TESTER" : "INTERVIEWER";

  if (MyType === "INTERVIEWER") {
    return <Interviewer />;
  } else {
    return <Interviewee />;
  }
}

const Wrapper = styled.div`
  width: 1200px;
  min-height: 75vh;
  margin: 60px auto;
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

const TestWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  gap: 70px;
`;

const Title = styled.div`
  font-size: 40px;
  font-weight: 700;
`;

const Message = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;
  margin-bottom: 40px;

  h1 {
    font-size: 40px;
  }

  h2 {
    font-size: 30px;
  }
`;

const TestDetail = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 120px;
  margin-bottom: 30px;
`;

const Test = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 320px;
  margin-bottom: 30px;
`;

const WriteContainer = styled.div`
  flex-direction: column;
  display: flex;
  gap: 40px;
`;

const WriteForm = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 40px;

  p {
    padding: 10px 5px;
    font-size: 25px;
  }
`;

const Button = styled.button`
  display: flex;
  padding: 5px 76px;
  font-family: Pretendard;
  justify-content: center;
  align-items: center;
  max-width: 238px;
  max-height: 32px;
  white-space: nowrap;

  border-radius: 10px;
  color: black;
  font-size: 20px;
  font-weight: 700;

  cursor: pointer;
`;

const Detail = styled.div``;

const Header = styled.div`
  font-size: 30px;
  margin-bottom: 20px;
`;

const Form = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 150px;
`;

const Context = styled.div`
  display: flex;
`;

const TableHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 18px;
  margin-right: 60px;
`;

const Table = styled.div`
  display: flex;
  flex-direction: column;
  gap: 11px;
  font-size: 17px;
  font-weight: 500;
`;

const TestInput = styled.input<{ width?: string }>`
  padding: 12px;
  font-size: 16px;
  width: ${(props) => props.width || "736px"};
  border-radius: 20px;
  border: 1px solid white;
  background-color: #202e41;
  color: white;
`;

const TestText = styled.div`
  color: white;
  font-size: 20px;
  font-weight: 500;
  margin-left: 10px;
`;

const TitleInput = styled.input`
  flex: 1;
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
  flex: 1;
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
  margin: 0px 0;
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
  margin-bottom: 60px;

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
