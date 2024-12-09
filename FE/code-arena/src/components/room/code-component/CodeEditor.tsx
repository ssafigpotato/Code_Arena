import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import BorderButton from "@/components/common/button/BorderButton";
import Link from "next/link";
import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";
import { usePathname } from "next/navigation";
import useUserStore from "@/store/userstore";
import Editor from "@monaco-editor/react";
import { useRoomStore } from "@/store/roomstore";
import api from "@/utils/api";
import { domain } from "@/utils/api";
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  h1 {
    // width: 100%;
    // box-sizing: border-box;
    // border-bottom: 1px solid var(--primary-color);
    // display: flex;
    // align-items: center;
    // height: 3.6rem;
    // padding: 0 1rem;
  }
  * {
    // border: 1px solid lime;
  }
`;
const Monaco = styled.div`
  // height: 60vh;
  padding: 0.5rem 0;
  .monaco-editor .scrollbar .slider {
    border-radius: 0.5rem;
  }
`;

const RunCode = styled.div`
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid var(--primary-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 3.6rem;
  padding: 0 1rem;
  button {
    padding: 0.4rem 1rem;
  }
`;

const Grading = styled.div`
  display: flex;
  justify-content: space-between;
  width: 12rem;
`;
// type SetResultType = (value: any[] | ((prevState: any[]) => any[])) => void;
interface EditorComponentProps {
  setResults: (result: any[]) => void;
}

// const EditorComponent = ({ setResults = () => {} }: EditorComponentProps) => {
const EditorComponent: React.FC<EditorComponentProps> = ({ setResults }) => {
  // const EditorComponent: React.FC<EditorComponentProps> = ({ setResults = () => {}}) => {
  // let client: Client | undefined;
  const [client, setClient] = useState(
    new Client({
      // STOMP 브로커와 연결할 WebSocket URL을 설정
      brokerURL: "wss://" + "i11a807.p.ssafy.io" + "/rabbitmq/ws",
      webSocketFactory: () => socketRef.current,
      connectHeaders: {},
      //디버그 로그를 출력
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
          `/queue/arena.queue.${roomId}`,
          // "/topic/code",
          (message: IMessage) => {
            try {
              const messageContent = JSON.parse(message.body);
              console.log(messageContent);
              if (
                !isComposing &&
                editorRef.current &&
                latestContent.current !== messageContent.content
              ) {
                // editorRef.current.textContent = messageContent.content;
                isRemoteUpdate.current = true; // 서버로부터 온 메시지임을 표시
                const position = editorRef.current.getPosition(); // 커서 위치 저장
                editorRef.current.setValue(messageContent.content);
                editorRef.current.setPosition(position); // 커서 위치 복원
                latestContent.current = messageContent.content;
                // console.log(editorRef.current.getValue());
                console.log("메시지 수신", messageContent.content);
                // console.log("메시지 해더", message.headers);
                // console.log("메시지 ack?", message.ack);
              }
            } catch (error) {
              console.error("메시지바디 파싱 실패: ", error);
            }
          }
        );
        // }

        if (client?.connected) {
          setStompClient(client);
          setIsConnected(true);
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
  const [isComposing, setIsComposing] = useState(false);
  // const [stompClient, setStompClient] = useState<Client | undefined>(undefined);
  const [stompClient, setStompClient] = useState<any>();
  // const editorRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const pathname = usePathname();
  const roomId = pathname?.split("/").pop();
  const { currentUser } = useUserStore();
  const { room } = useRoomStore();
  const isRemoteUpdate = useRef(false); // 서버로부터의 업데이트를 감지하기 위한 플래그
  const latestContent = useRef<string>(""); // 최근의 에디터 내용을 저장

  // WebSocket 객체를 useRef로 관리
  const socketRef = useRef<any>(null);

  useEffect(() => {
    // if (editorRef.current) {
    const socket = new SockJS("https://" + "i11a807.p.ssafy.io" + "/rabbitmq/ws");
    socketRef.current = socket;

    // STOMP 클라이언트를 활성화하여 WebSocket 연결을 시작
    client.activate();

    return () => {};
    // }
  }, []);

  const getWebSocketReadyState = () => {
    return socketRef.current?.readyState;
  };

  const sendCode = (content: string) => {
    if (client?.connected && currentUser?.id === room.tester?.memberId) {
      // if (stompClient?.connected && getWebSocketReadyState() === WebSocket.OPEN) {
      const readyState = getWebSocketReadyState();
      const messageBody = JSON.stringify({
        content: content,
        roomId: roomId,
        // sender: currentUser?.id,
        sender: room.tester?.memberId,
      });
      // console.log("룸아이디도 잘 받아오냐?", roomId);
      // console.log("Sending message:", messageBody);
      // console.log("stompClient 상태는?", stompClient?.connected);

      // console.log(`현재 웹소켓 상태:  ${readyState}`);
      // if (currentUser?.id === room.tester?.memberId) {
      try {
        client?.publish({
          destination: "/app/code/edit",
          body: messageBody,
        });
      } catch (error) {
        console.error("메시지 publish 실패!!!:", error);
      }
      // }
    } else {
      console.error("에러");
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (isRemoteUpdate.current) {
      // 서버로부터 온 업데이트라면, 다시 전송하지 않도록 함
      isRemoteUpdate.current = false; // 플래그 초기화
    } else if (value && latestContent.current !== value) {
      // 로컬에서의 업데이트일 때만 메시지 전송
      latestContent.current = value;
      sendCode(value);
    }
  };

  // 제출하기
  const saveEditorCode = async () => {
    if (editorRef.current) {
      const content = editorRef.current.getValue();
      const data = {
        code: content,
        language: room.tester?.roomLanguage.toUpperCase(),
      };
      console.log("data는: ", data);
      console.log(JSON.stringify(data));

      try {
        // 첫 번째 POST 요청 (코드 실행)
        const response = await api.post(
          `/editor/build/${roomId}`,
          JSON.stringify(data),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response);
        if (response.status === 200) {
          const result = await response.data;
          console.log("코드 실행 결과:", result);
          if (setResults) {
            setResults(result);
            console.log("제가 넘길것은?:", result);
          }

          // 두 번째 POST 요청 (/code)
          const codeData = {
            roomId: roomId,
            content: content, // 코드 내용을 그대로 전송
          };

          const codeResponse = await api.post(
            `/code`,
            JSON.stringify(codeData),
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log("코드 제출 결과:", codeResponse);
          if (codeResponse.status === 200) {
            console.log("코드가 성공적으로 제출되었습니다.");
          } else {
            console.error("코드 제출에 실패했습니다.");
          }
        } else {
          console.error("코드 실행에 실패했습니다.");
        }
      } catch (error) {
        console.error("서버 요청 중 오류가 발생했습니다:", error);
      }
    }
  };

  // 실행하기
  const executeEditorCode = async () => {
    if (editorRef.current) {
      const content = editorRef.current.getValue();
      const data = {
        code: content,
        language: room.tester?.roomLanguage.toUpperCase(),
      };
      console.log("data는: ", data);
      console.log(JSON.stringify(data));
      try {
        const response = await api.post(
          `/editor/example/${roomId}`,
          JSON.stringify(data),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response);
        if (response.status === 200) {
          const execute_result = await response.data;
          console.log("코드 실행 결과:", execute_result);
          if (setResults) {
            setResults(execute_result);
            console.log("제가 넘길것은?:", execute_result);
          }
        } else {
          console.error("코드 실행에 실패했습니다.");
        }
      } catch (error) {
        console.error("서버 요청 중 오류가 발생했습니다:", error);
      }
    }
  };
  return (
    <>
      <Wrapper>
        <RunCode>
          <h1>코드 작성란</h1>
          <Grading>
            <BorderButton
              text={"실행하기"}
              $borderColor="var(--light-color)"
              $bgColor="var(--light-color)"
              $hoverColor="var(--light-color)"
              onClick={executeEditorCode}
            />
            <BorderButton
              text={"제출하기"}
              $borderColor="var(--yellow-color)"
              $bgColor="var(--yellow-color)"
              $hoverColor="var(--yellow-color)"
              onClick={saveEditorCode}
            />
          </Grading>
        </RunCode>
        <Monaco>
          {/* <div id="editor" ref={editorRef} contentEditable="true"></div> */}
          <Editor
            width="50vw"
            height="24rem" // 에디터의 높이 설정
            defaultLanguage={room.roomLanguage.toLowerCase()} // 기본 언어 설정
            defaultValue={
              room.roomLanguage.toLowerCase() === "java"
                ? "// 코드를 작성하세요. 클래스명은 UserCode로 작성하세요."
                : room.roomLanguage.toLowerCase() === "python"
                ? "# 코드를 작성하세요."
                : room.roomLanguage.toLowerCase() === "cpp"
                ? "// 코드를 작성하세요."
                : "// 코드를 작성하세요."
            } // 초기 코드\
            theme="vs-dark"
            onMount={(editor, monaco) => {
              console.log("editorRef 연결완료!!");
              console.log(editor);
              console.log(editorRef);
              editorRef.current = editor;
              monaco.editor.defineTheme("custom", {
                base: "vs-dark",
                inherit: true,
                rules: [],
                colors: {
                  "editor.background": "#27374D", // 에디터 배경색 설정
                  "editor.lineHighlightBackground": "#27374D", // 현재 라인 배경색
                  "scrollbarSlider.background": "#27374D",
                  "scrollbarSlider.hoverBackground": "#526D82",
                  "scrollbarSlider.activeBackground": "#526D82",
                },
              });
              monaco.editor.setTheme("custom");
              console.log(editorRef);
            }}
            onChange={(value) => handleEditorChange(value)}
          />
        </Monaco>
      </Wrapper>
    </>
  );
};

export default EditorComponent;
