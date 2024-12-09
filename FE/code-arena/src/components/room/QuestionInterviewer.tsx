import React, { useState, useRef, useEffect, ReactEventHandler } from "react";
import styled from "styled-components";
import BorderButton from "@/components/common/button/BorderButton";
import Link from "next/link";
import useAiStore from "@/store/aistore";
import { useParams } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import SockJS from "sockjs-client";
import { createRef } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import { Problem } from "@/store/aistore";
import { domain } from "@/utils/api";

const QuestionInterviewer = () => {
  const {
    problem,
    chatRequest,
    chatResponse,
    model,
    sendAiRequest,
    sendTestcaseRequest,
    sendExampleRequest,
    setProblem,
    isLoading,
    sendSetProblemRequest,
    sendGetProblemRequest,
  } = useAiStore();

  const params = useParams<{ id: string }>();

  const { register, handleSubmit } = useForm<{ input: string }>();
  const onSubmit: SubmitHandler<{ input: string }> = async (data, event) => {
    console.log(data);
    event?.preventDefault();
    const response: Problem | null | undefined = await sendAiRequest(
      data.input
    );
    console.log(response);
    if (response) {
      console.log("정보들을 db로 보냅니다.");
      sendSetProblemRequest({ ...response, roomId: params?.id });
      sendTestcaseRequest(params?.id, response.testcases);
      sendExampleRequest(params?.id, response.examples);
      sendProblem(response);
    }
  };
  const socketRef = useRef<any>(null);
  const [client, setClient] = useState(
    new Client({
      brokerURL: "wss://" + domain + "/rabbitmq/ws",
      webSocketFactory: () => socketRef.current,
      connectHeaders: {},
      reconnectDelay: 1000,
      heartbeatIncoming: 1000,
      heartbeatOutgoing: 1000,
      onConnect: () => {
        client.subscribe(
          `/queue/arena.queue.${params?.id}` + ".problem",
          (message: IMessage) => {
            const msgContent = JSON.parse(message.body);
            console.log("메시지를 받았습니다.");
            console.log(msgContent);
            // if (

            // )
            setProblem({
              description: msgContent.description,
              inputCondition: msgContent.inputCondition,
              outputCondition: msgContent.outputCondition,
              examples: msgContent.examples,
            });
          }
        );
      },
    })
  );
  const sendProblem = (problem: Problem | null | undefined) => {
    if (!problem) {
      console.log("problem이 비었는데요?");
      return;
    }
    const messageBody = JSON.stringify({
      roomId: params?.id,
      description: problem.description,
      inputCondition: problem.inputCondition,
      outputCondition: problem.outputCondition,
      examples: problem.examples,
    });
    console.log("문제를 publish 합니다.");
    console.log(messageBody);
    client.publish({
      destination: "/app/problem",
      body: messageBody,
    });
  };

  useEffect(() => {
    socketRef.current = new SockJS("https://" + domain + "/rabbitmq/ws");
    client.activate();
    // 있으면 다른 면접관 화면에 안뜸
    // sendGetProblemRequest(params?.id);
    return () => {};
  }, []);
  return (
    <Container>
      <h2 className="title">문제 설명</h2>
      <div className="wrapper">
        <Item>
          <Content>
            <p>
              {problem?.description === undefined
                ? isLoading
                  ? `로딩중..`
                  : `생성 버튼을 눌러 문제를 생성하세요.`
                : problem?.description}
            </p>
          </Content>
        </Item>

        <Item>
          <Title>
            <h2>입력</h2>
          </Title>
          <Content>
            <p>
              {problem?.inputCondition === undefined
                ? isLoading
                  ? `로딩중..`
                  : `생성 버튼을 눌러 문제를 생성하세요.`
                : problem.inputCondition}
            </p>
          </Content>
        </Item>

        <Item>
          <Title>
            <h2>출력</h2>
          </Title>
          <Content>
            <p>
              {problem?.outputCondition === undefined
                ? isLoading
                  ? `로딩중..`
                  : `생성 버튼을 눌러 문제를 생성하세요.`
                : problem?.outputCondition}
            </p>
          </Content>
        </Item>

        <Item>
          <Title>
            <h2>예제</h2>
          </Title>
          <Content>
            {problem?.examples === undefined ? (
              <p>
                {isLoading ? `로딩중..` : `생성 버튼을 눌러 문제를 생성하세요.`}
              </p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>입력</th>
                    <th>출력</th>
                  </tr>
                </thead>
                <tbody>
                  {problem?.examples.map((example, idx) => (
                    <tr key={idx}>
                      <td>{example.id + 1}</td>
                      <td>{example.in}</td>
                      <td>{example.out}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Content>
        </Item>
        {problem === null ? (
          []
        ) : (
          <ResetContainer>
            <BorderButton
              $form="generationform"
              text="재생성하기"
              onClick={handleSubmit(onSubmit)}
            ></BorderButton>
          </ResetContainer>
        )}
        <FormContainer>
          <h2>문제 생성</h2>
          <h4>
            * 생성하고 싶은 문제에 대한 설명을 기입하고, "생성" 버튼을 누르세요.
          </h4>
          <Form
            id="generationform"
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <div className="inputcontainer">
              <input type="text" {...register("input")} />
            </div>
            <div className="buttoncontainer">
              <BorderButton
                text="생성"
                onClick={handleSubmit(onSubmit)}
              ></BorderButton>
            </div>
          </Form>
        </FormContainer>
      </div>
    </Container>
  );
};

export default QuestionInterviewer;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 41rem;
  width: 100%;
  // box-sizing: border-box;

  > * {
    padding-left: 0.8rem;
  }
  .title {
    width: 100%;
    box-sizing: border-box;
    border-bottom: 1px solid var(--primary-color);
    display: flex;
    align-items: center;
    height: 4rem;
  }

  .wrapper {
    display: flex;
    height: 100%;
    width: 100%;
    box-sizing: border-box;

    flex-direction: column;
    overflow-y: scroll;
    border-right: 1px solid var(--primary-color);
    padding: 1rem;
    &::-webkit-scrollbar {
      width: 2rem;
      border-radius: 15px;
    }

    &::-webkit-scrollbar-track {
      border-radius: 15px;
      background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--primary-color);
      border: 0.75rem solid transparent;
      border-radius: 15px;
      background-clip: padding-box;
    }
  }
`;
const Item = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem 0 1rem 0;
`;
const Title = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 2rem;
  background-color: var(--bg-color);

  h2 {
    font-family: "Pretendard";
    font-size: 1rem;
    width: 100%;
    border-bottom: 1px var(--primary-color) solid;
    box-sizing: border-box;
    padding: 0 0 0.4rem 0;
  }
`;
const Content = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  p {
    display: flex;
    width: 100%;
    word-break: break-word;
    line-height: 1.5rem;
  }
  table {
    margin: 1rem;
    width: 80%;
  }
  tr {
    border-bottom: 1px solid var(--primary-color);
    &:first-child {
      height: 2rem;
    }
  }
  td {
    text-align: center;
    vertical-align: middle;
    height: 2rem;

    &:first-child {
      color: var(--primary-color);
      font-weight: bold;
    }
  }
`;
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 2rem 0 0 0;
  border: 1px solid var(--primary-color);
  box-sizing: border-box;
  padding: 1rem;
  border-radius: 15px;
  h2 {
    width: 100%;
    font-size: 1.3rem;
    font-weight: bold;
    margin: 0 0 1rem 0;
  }
  h4 {
    margin: 0.6rem 0;
    color: white;
    font-weight: 300;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  .inputcontainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    input {
      height: 2rem;
      width: 100%;
      border: none;
      border-radius: 5px;
      background-color: var(--primary-color);
      box-sizing: border-box;
      padding: 1rem;
      color: black;
      font-weight: 600;
    }
    label {
      display: flex;
      width: 100%;
    }
  }
  .buttoncontainer {
    display: flex;
    width: 100%;
    justify-content: end;
    margin: 1rem 0 0 0;
  }
`;
const ResetContainer = styled.div`
  display: flex;
  justify-content: end;
  button {
    margin: 0 2rem 0 0;
  }
`;
