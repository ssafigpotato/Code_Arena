import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import ProgramLang from "../programlang/ProgramLang";
import Timer from "./roominfo-component/Timer";
import { useRouter, useParams } from "next/navigation";
import { useRoomStore } from "@/store/roomstore";
import useUserStore from "@/store/userstore";
import api from "@/utils/api";
import ProgramLangImg from "../programlang/ProgramLangImg/ProgramLangImg";
import useAiStore from "@/store/aistore";
import useReportStore from "@/store/reportstore";
import { ProblemDto } from "@/store/aistore";

const InfoContainer = styled.div`
  width: 1400px;
  height: 4rem;
  padding: 0.5rem 1.2rem;
  display: grid;
  grid-template-columns: 2fr 2fr 1.5fr 0.5fr;
  grid-template-rows: 1fr;
  border-bottom: 1px solid var(--primary-color);
`;

const Live = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.div`
  // width: 30rem;
  // height 5rem;
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const User = styled.div`
  display: flex;
  width: 100%;
  height: 1rem;
  div {
    // wwidth: 50%;
    height: 100%;
    margin: 0;

    img {
      height: 100%;
    }
  }
`;

const UserName = styled.div`
  font-size: 1rem;
  width: 70%;
`;

const LangContainer = styled.div`
  font-size: 1rem;
  // width: 8rem;
  height: 100%;
  display: flex;
  span {
    margin-left: 0.3rem;
    font-weight: bold;
    color: var(--primary-color);
  }
`;

const Position = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin: 0 0.5rem;
  div {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 8rem;
    height: 3rem;
    background-color: var(--yellow-color);
    font-family: "Pretendard";
    font-size: 1.5rem;
    font-weight: 700;
    border-radius: 1rem;
    color: #000000;
  }
`;

const TimerContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Status = styled.button<{ $status: number }>`
  display: flex;
  border-radius: 1rem;
  background-color: ${({ $status }) =>
    $status === 0 ? "var(--light-color)" : "var(--red-color)"};
  justify-content: center;
  align-items: center;
  color: #000000;
  font-family: "Pretendard";
  font-size: 2rem;
  font-weight: 700;
  cursor: pointer;
`;

const StartContainer = styled.div`
  display: flex;
  
  button {
    border-radius: 1rem;
    justify-content: center;
    align-items; center;
    color: #000000;
    font-family: "Pretendard";
    font-size: 1.7rem;
    font-weight: 700;
    cursor: pointer;
    width: 9rem;
     border: 1px solid #000000;
  }


`;

const StartButton = styled.button<{ $isPrepared: boolean }>`
  border-radius: 1rem;
  background-color: ${({ $isPrepared }) =>
    $isPrepared ? "var(--yellow-color)" : "var(--light-color)"};
  justify-content: center;
  align-items: center;
  color: #000000;
  font-family: "Pretendard";
  font-size: 1.7rem;
  font-weight: 700;
  cursor: pointer;
  width: 9rem;
  border: 1px solid #000000;
`;
const PrepButton = styled.button<{ $isPrepared: boolean }>`
  border-radius: 1rem;
  background-color: ${({ $isPrepared }) =>
    $isPrepared ? "var(--red-color)" : "var(--yellow-color)"};
  justify-content: center;
  align-items: center;
  color: #000000;
  font-family: "Pretendard";
  font-size: 1.7rem;
  font-weight: 700;
  cursor: pointer;
  width: 9rem;
  border: 1px solid #000000;
`;
// 룸(라이브 코딩 테스트) 정보
interface RoomInfoProps {
  type: "TESTER" | "INTERVIEWER" | string;
  MyRoomMemberId: string | null | undefined;
}

let isAlertShown = false;

const RoomInfo: React.FC<RoomInfoProps> = (props) => {
  const router = useRouter();
  const params = useParams();
  const roomId = params?.id as string;

  const { problem, sendGetProblemRequest, sendSetProblemRequest, setProblem } =
    useAiStore();
  const {
    room,
    isStarted,
    start,
    end,
    amIReady,
    toggleReady,
    isAllReady,
    checkAllReady,
    deleteRoom,
    error,
    setIsStarted,
    fetchRoomById,
  } = useRoomStore();
  const { currentUser } = useUserStore();
  const { publishReport } = useReportStore();

  // 3. 타이머
  // 초 단위로 time 변환
  const seconds = room.testTime * 60;
  // 타이머 상태관리
  const [timerStart, setTimerstart] = useState(room.startStatus == "ON");
  const [elapsedTime, setElapsedTime] = useState(0); // 경과 시간 상태

  // 4. 진행상태
  // 시작 버튼 관련 로직
  const handleStart = () => {
    sendGetProblemRequest(roomId);
    setTimerstart(true);
    start(roomId);
    fetchRoomById(roomId);
  };

  // 준비 버튼 관련 로직
  const handlePrepToggle = () => {
    toggleReady(props.MyRoomMemberId);
  };

  // 종료 버튼 관련 로직
  const handleStop = async () => {
    if (confirm("정말 테스트를 종료하시겠습니까?")) {
      const elapsedMinutes = elapsedTime / 60;
      setTimerstart(false); // 타이머 중지
      console.log("종료 까지 경과 시간: ", elapsedMinutes);

      const reportData = {
        roomId: roomId,
      };
      // 먼저 report를 발행
      await publishReport(reportData);
      console.log("Report published");

      // 이후에 룸을 삭제
      deleteRoom(roomId);
      console.log("Room deleted");

      // 상태 업데이트
      setIsStarted(false);
      setProblem(null);

      // 종료 페이지로 리다이렉트
      router.push(`/room/${roomId}/end`);
    }
  };

  // 타이머의 경과 시간 업데이트
  // const handleTimerUpdate = (newElapsedTime: number) => {
  //   setElapsedTime(newElapsedTime);
  // };

  // 면접관 시작 및 종료 체크
  useEffect(() => {
    if (props.type === "INTERVIEWER") {
      let startedCheck = setInterval(async () => {
        try {
          const resp = await api.get("/room/" + roomId);
          console.log(resp);
          if (resp.data.startStatus === "ON") {
            sendGetProblemRequest(roomId);
            setTimerstart(true);
            setIsStarted(true);
          }
        } catch (err) {
          console.log(error);
          if (!isAlertShown) {
            isAlertShown = true;
            alert("면접이 종료되었습니다.");
            router.push("/room/" + roomId + "/end");
            setTimeout(() => {
              isAlertShown = false;
            }, 5000); // 5초 후에 초기화
          }
        }
      }, 2000);
      return () => {
        clearInterval(startedCheck);
      };
    }
  });

  // 응시자 준비완료 체크
  useEffect(() => {
    if (props.type === "TESTER" && !isStarted) {
      let allReadyCheck = setInterval(async () => {
        checkAllReady(roomId);
      }, 2000);
      return () => {
        clearInterval(allReadyCheck);
      };
    }
  });

  return (
    <>
      <InfoContainer>
        {/* 1. 라이브 관련 정보(참여 라이브 제목, 유저네임, 사용언어) */}
        <Live>
          <Title>{room.name}</Title>
          <User>
            <UserName>{room.tester?.nickName}</UserName>
            <LangContainer>
              <ProgramLangImg name={room.roomLanguage} />
              <span>{room.roomLanguage}</span>
            </LangContainer>
          </User>
        </Live>

        {/* 2. 포지션(응시자, 면접관) */}
        <Position>
          <div>{props.type == "INTERVIEWER" ? "면접관" : "응시자"}</div>
        </Position>

        {/* 3. 타이머 */}
        <TimerContainer>
          <Timer
            limitTime={seconds}
            timerStart={timerStart}
            // onUpdate={handleTimerUpdate}
          ></Timer>
        </TimerContainer>

        {/* 4. 진행상태 */}
        {props.type === "TESTER" &&
        room.members &&
        room.members?.length >= 1 ? (
          !isStarted ? (
            isAllReady ? (
              <StartContainer>
                <StartButton
                  $isPrepared={isAllReady}
                  disabled={!isAllReady}
                  onClick={handleStart}
                >
                  시작하기
                </StartButton>
              </StartContainer>
            ) : isStarted ? (
              <StartContainer>
                <button onClick={handleStop}>종료하기</button>
              </StartContainer>
            ) : (
              []
            )
          ) : (
            <StartContainer>
              <button onClick={handleStop}>종료하기</button>
            </StartContainer>
          )
        ) : (
          props.type === "INTERVIEWER" &&
          !isStarted && (
            <StartContainer>
              <PrepButton $isPrepared={amIReady} onClick={handlePrepToggle}>
                {amIReady ? "준비완료" : "준비하기"}
              </PrepButton>
            </StartContainer>
          )
        )}
        {isStarted && props.type == "INTERVIEWER" && (
          <Status $status={isStarted ? 1 : 0}>진행중</Status>
        )}
      </InfoContainer>
    </>
  );
};

export default RoomInfo;
