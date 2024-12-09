import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import BorderButton from "@/components/common/button/BorderButton";
import Link from "next/link";
import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";
import useUserStore from "@/store/userstore";
import { useRoomStore } from "@/store/roomstore";
import { usePathname } from "next/navigation";
import { domain } from "@/utils/api";
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.2rem 1rem;
  height: 11.4rem;
  h1 {
    font-weight: 700;
    margin: 0.5rem 0;
  }
  border-top: 1px solid var(--primary-color);
`;
const TerminalMain = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 8px;
    border-radius: 0.5rem;
  }

  &::-webkit-scrollbar-track {
    border-radius: 0.5rem;
    background-color: var(--bg-color);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--primary-color);
    // border: 0.75rem solid transparent;
    border-radius: 0.5rem;
    background-clip: padding-box;
  }
`;
const TerminalLine = styled.div<{ correct: boolean; output?: string }>`
  display: grid;
  grid-template-columns: ${(props) =>
    props.output ? "1fr 2fr 1fr 1fr" : "1fr 1fr 1fr"};
  grid-temolate-rows: 1fr;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.2rem;
  font-size: 0.9rem;

  span:nth-child(${(props) => (props.output ? 3 : 2)}) {
    color: ${(props) =>
      props.correct ? "var(--yellow-color)" : "var(--red-color)"};
    font-weight: 700;
    display: flex;
    justify-content: end;
  }
  span:nth-child(${(props) => (props.output ? 2 : 3)}) {
    display: flex;
    justify-content: end;
  }
  span:nth-child(4) {
    display: flex;
    justify-content: end;
  }
`;
const InfoComment = styled.div`
  display: flex;
  color: var(--primary-color);
`;
interface TerminalProps {
  results: Array<{
    index: number;
    executionTime: number;
    correct: boolean;
    output?: string;
  }>;
}
// let client: Client | undefined;
const Terminal: React.FC<TerminalProps> = ({ results }) => {
  const { currentUser } = useUserStore();
  const { room } = useRoomStore();
  const pathname = usePathname();
  const roomId = pathname?.split("/").pop();
  const [stompClient, setStompClient] = useState<any>();
  const terminalRef = useRef<any>(null);
  const socketRef = useRef<any>(null);
  const [terminalResults, setTerminalResults] = useState(results || []);
  // 웹소켓 여러명 연결 테스트 코드
  const [isComposing, setIsComposing] = useState(false);
  const latestContent = useRef<string>("");
  const isRemoteUpdate = useRef(false); // 서버로부터의 업데이트를 감지하기 위한 플래그
  const [client, setClient] = useState(
    new Client({
      brokerURL: "wss://" + "i11a807.p.ssafy.io" + "/rabbitmq/ws",
      // brokerURL: "wss://localhost:443/rabbitmq/ws",
      webSocketFactory: () => socketRef.current,
      connectHeaders: {},
      // debug: (str) => console.log("STOMP 디버깅:", str),
      // 연결 재시도 간의 지연 시간
      reconnectDelay: 5000,
      // 서버와 클라이언트 간의 하트비트 간격을 설정
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      // STOMP 클라이언트가 연결되었을 때 호출
      // 채널을 구독하고 클라이언트를 상태로 설정
      onConnect: (frame) => {
        console.log("Connected는 됐다구~~~: " + frame);
        // if (currentUser?.id !== room.tester?.memberId) {
        client?.subscribe(
          // 이거 백엔드에서 만들어줘야함
          `/queue/arena.queue.${roomId}.terminal`,
          (message: IMessage) => {
            try {
              const messageContent = JSON.parse(message.body);
              console.log("메시지에서 구독하는것?", messageContent);
              // if (
              //   !isComposing &&
              //   terminalRef.current &&
              //   latestContent.current !== messageContent.content
              // ) {
              // terminalRef.current.textContent = messageContent.content;

              setTerminalResults(messageContent.responses);

              latestContent.current = messageContent.content;
              isRemoteUpdate.current = true;
              console.log("메시지 수신", messageContent.responses);
              // } else {
              //   console.log("setTerminalREsults를 못하고 있음!");
              // }
            } catch (error) {
              console.error("메시지바디 파싱 실패: ", error);
            }
          }
        );
        if (client?.connected) {
          setStompClient(client);
        }
      },
      //STOMP 오류가 발생했을 때 호출
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },

      onDisconnect: (frame) => {
        console.log("closed!!!", frame.body);
      },
    })
  );

  useEffect(() => {
    const socket = new SockJS("https://" + "i11a807.p.ssafy.io" + "/rabbitmq/ws");
    socketRef.current = socket;

    client.activate();
    // setStompClient(client);

    // 언마운트시 비활성화
    return () => {
      client?.deactivate();
    };
  }, []);

  useEffect(() => {
    console.log("초기 results 상태:", results);
    setTerminalResults(results);
  }, [results]);

  useEffect(() => {
    console.log("Updated terminalResults 어케됨??:", terminalResults);
  }, [terminalResults]);

  const sendCode = (responses: Array<any>) => {
    if (client?.connected && currentUser?.id === room.tester?.memberId) {
      const messageBody = JSON.stringify({
        roomId: roomId,
        responses: responses,
      });
      console.log("룸아이디도 잘 받아오냐?", roomId);
      console.log("Sending message:", messageBody);
      console.log("stompClient 상태는?", stompClient?.connected);

      // console.log(`현재 웹소켓 상태:  ${readyState}`);
      // if (currentUser?.id === room.tester?.memberId) {
      try {
        client?.publish({
          // 도착지도 바꿔줘ㅓ야함..
          destination: "/app/terminal",
          body: messageBody,
        });
        console.log("보냇나??!");
      } catch (error) {
        console.error("메시지 publish 실패!!!:", error);
      }
    } else {
      console.error("에러");
    }
  };

  // useEffect를 사용하여 결과가 변경될 때마다 sendCode 호출
  useEffect(() => {
    console.log("Results updated 상태변화 감지하니??:", results);
    if (results.length > 0) {
      sendCode(results);
    }
  }, [results]);

  // console.log("제대로 나오고있냐?!", terminalResults);
  return (
    <>
      <Wrapper>
        <h1>코드 터미널</h1>
        <TerminalMain ref={terminalRef}>
          {/* {results.length === 0 ? ( */}
          {terminalResults.length === 0 ? (
            <InfoComment>
              실행/제출 결과가 표시됩니다. 실행/제출까지 시간이 걸릴 수
              있습니다.
            </InfoComment>
          ) : (
            // results.map((result, index) => (
            terminalResults.map((result, index) => (
              <TerminalLine
                key={index}
                correct={result?.correct}
                output={result?.output}
              >
                <span>Test Case {result?.index}: </span>
                {result.output && <span>{result?.output}</span>}
                <span>
                  {result?.correct ? (
                    <span className="material-icons">check</span>
                  ) : (
                    <span className="material-icons">cancel</span>
                  )}
                </span>
                <span>실행시간: {result?.executionTime}ms </span>
              </TerminalLine>
            ))
          )}
        </TerminalMain>
      </Wrapper>
    </>
  );
};

export default Terminal;
