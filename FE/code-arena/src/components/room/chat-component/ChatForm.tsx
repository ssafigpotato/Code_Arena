import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import useUserStore from "@/store/userstore";
import { usePathname } from "next/navigation";
import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";
import { useRoomStore } from "@/store/roomstore";

interface Message {
  content: string;
  nickname: string | undefined;
}

const Wrapper = styled.div`
  display: flex;
  height: 14rem;
  padding: 0.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  width: 17.5rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;
const ChatComponent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 17.5rem;
  overflow-y: auto;
  margin-botton: 0.5rem;
  &::-webkit-scrollbar {
    width: 9px;
    border-radius: 0.5rem;
  }

  &::-webkit-scrollbar-track {
    border-radius: 0.5rem;
    background-color: var(--primary-color);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--secondary-color);
    // border: 0.75rem solid transparent;
    border-radius: 0.5rem;
    background-clip: padding-box;
  }
`;
const ChatInput = styled.input`
  width: 13rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  margin-top: auto;
  outline: none;
  position: absoulte;
  bottom: 0.5rem;
`;
const NickName = styled.div<{ isOwnMessage: boolean }>`
  display: flex;
  font-size: 0.6rem;
  font-weight: 800;
  align-self: ${(props) => (props.isOwnMessage ? "flex-end" : "flex-start")};
  color: var(--primary-color);
`;
const ChatMessage = styled.div<{ isOwnMessage: boolean }>`
  background-color: ${(props) =>
    props.isOwnMessage ? "var(--yellow-color)" : "var(--light-color)"};
  color: #000000;
  padding: 0.5rem;
  border-radius: 0.5rem;
  max-width: 75%;
  align-self: ${(props) => (props.isOwnMessage ? "flex-end" : "flex-start")};
  //   margin-bottom: 0.5rem;
  margin: 0 0.5rem 0.5rem 0.5rem;
  word-wrap: break-word;
`;

const ChatForm = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const { currentUser } = useUserStore();
  const { room } = useRoomStore();
  const pathname = usePathname();
  const roomId = pathname?.split("/").pop();
  const [stompClient, setStompClient] = useState<any>();
  const socketRef = useRef<any>(null);
  const chatComponentRef = useRef<HTMLDivElement>(null);

  // const [terminalResults, setTerminalResults] = useState(results || []);

  // const latestContent = useRef<string>("");
  // const isRemoteUpdate = useRef(false); // 서버로부터의 업데이트를 감지하기 위한 플래그
  const [client, setClient] = useState(
    new Client({
      brokerURL: "wss://i11a807.p.ssafy.io/rabbitmq/ws",
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
          `/queue/arena.queue.${roomId}.chat`,
          (message: IMessage) => {
            try {
              const messageContent = JSON.parse(message.body);
              console.log("메시지에서 구독하는것?", messageContent);
              if (messageContent.nickname !== currentUser?.nickname) {
                setMessages((prevMessages) => [
                  ...prevMessages,
                  {
                    content: messageContent.content,
                    nickname: messageContent.nickname,
                  },
                ]);
                // setInputValue("");
                // if (
                //   !isComposing &&
                //   terminalRef.current &&
                //   latestContent.current !== messageContent.content
                // ) {
                // terminalRef.current.textContent = messageContent.content;

                // setTerminalResults(messageContent.responses);

                // latestContent.current = messageContent.content;
                // isRemoteUpdate.current = true;
                console.log("메시지 수신", messageContent.responses);
                // } else {
                //   console.log("setTerminalREsults를 못하고 있음!");
                // }
              }
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
    const socket = new SockJS("https://i11a807.p.ssafy.io/rabbitmq/ws");
    socketRef.current = socket;

    client.activate();
    // setStompClient(client);

    // 언마운트시 비활성화
    return () => {
      client?.deactivate();
    };
  }, []);

  const handleSendMessage = (content: string) => {
    if (inputValue.trim() !== "" && client?.connected) {
      const messageBody = JSON.stringify({
        roomId: roomId,
        content: content,
        nickname: currentUser?.nickname,
      });
      console.log("룸아이디도 잘 받아오냐?", roomId);
      console.log("Sending message:", messageBody);
      console.log("stompClient 상태는?", stompClient?.connected);

      // console.log(`현재 웹소켓 상태:  ${readyState}`);
      // if (currentUser?.id === room.tester?.memberId) {
      try {
        client?.publish({
          // 도착지도 바꿔줘ㅓ야함..
          destination: "/app/chat",
          body: messageBody,
        });
        console.log("난 한번만 publish했는데....");

        setMessages([
          ...messages,
          { content: inputValue, nickname: currentUser?.nickname },
        ]);
        setInputValue("");
      } catch (error) {
        console.error("메시지 publish 실패!!!:", error);
      }
    } else {
      console.error("에러");
    }
  };

  useEffect(() => {
    if (chatComponentRef.current) {
      chatComponentRef.current.scrollTop =
        chatComponentRef.current.scrollHeight;
    }
  }, [messages]);

  // useEffect를 사용하여 결과가 변경될 때마다 sendCode 호출
  // useEffect(() => {
  //   console.log("Results updated 상태변화 감지하니??:", results);
  //   if (results.length > 0) {
  //     sendCode(results);
  //   }
  // }, [results]);
  return (
    <>
      <Wrapper>
        <ChatComponent ref={chatComponentRef}>
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              isOwnMessage={message.nickname === currentUser?.nickname}
            >
              <NickName
                isOwnMessage={message.nickname === currentUser?.nickname}
              >
                | {message.nickname}
              </NickName>
              {message.content}
            </ChatMessage>
          ))}
        </ChatComponent>
        <ChatInput
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // 폼 제출 방지 (브라우저 기본 동작 방지)
              handleSendMessage(inputValue);
            }
          }}
          placeholder="메시지를 입력하세요"
        />
      </Wrapper>
    </>
  );
};

export default ChatForm;
