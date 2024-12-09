"use client";
import { styled } from "styled-components";
import api from "@/utils/api";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import useUserStore from "@/store/userstore";

const Screen = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1200px;
  height: 77.5vh;
  margin: 0 auto;
`;
const Container = styled.div`
  display: flex;
  justify-content: center;
  background-color: white;
  width: 28%;
  height: 80%;
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-radius: 15px;
  box-shadow: 20px 20px #1d293a;
`;
const ContentsContainer = styled.div`
  width: 85%;
  flex-direction: column;
`;
const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 15%;
  width: 100%;
  h3 {
    margin-top: 1rem;
  }
  margin-bottom: 1.5rem;
`;
const Title = styled.h1`
  display: flex;
  background: linear-gradient(90deg, #9db2bf 0%, #495359 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  justify-content: center;
  font-size: 2.3rem;
  font-weight: bold;
  width: 100%;
`;
const SubTitle = styled.h3`
  display: flex;
  justify-content: center;
  font-size: 1.7rem;
  font-weight: bold;
  width: 100%;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgb(221, 230, 237);
  background: linear-gradient(
    318deg,
    rgba(221, 230, 237, 1) 58%,
    rgba(251, 253, 255, 1) 77%
  );
  height: 67%;

  div {
    margin-top: 0.5rem;
  }
`;
const InputContainer = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  * {
    margin-top: 0.5rem;
  }
  input {
    letter-spacing: 1px;
    &:not(:placeholder-shown) {
      text-align: center;
      font-weight: bold;
    }
    &::placeholder {
      letter-spacing: 0px;
    }
  }
  .password {
    letter-spacing: 5px;
    &::placeholder {
      letter-spacing: 0px;
    }
  }

  height: 82%;
`;
const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
`;
const Input = styled.input`
  display: flex;
  width: 100%;
  padding: 0;
  height: 14%;
  border: none;
  box-sizing: border-box;
  font-size: 0.8rem;
`;
const CheckInput = styled.input`
  display: flex;
  margin: 0;
  margin-right: 0.3rem;
  background-color: red;
`;
const Label = styled.label`
  margin: 0;
  display: flex;
  text-align: center;
  font-size: 0.8rem;
`;
const Button = styled.button`
  border: none;
  display: flex;
  width: 100%;
  height: 14%;
  background-color: var(--primary-color);
  text-align: center;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  font-weight: bold;
`;
const TailContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 0.7rem;
  a {
    text-decoration: none;
    color: black;
    display: flex;
    font-size: 0.8rem;
    font-weight: bold;
  }
`;
const TailText = styled.a`
  display: flex;
  font-size: 0.8rem;
  font-weight: bold;
`;
const FindContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 45%;
`;

interface Inputs {
  email: string;
  password: string;
}
export default function login() {
  // 토큰, 로그인한 유저, 로그인 여부 상태 관리
  const setToken = useUserStore((state) => state.setToken);
  const setIsAuthed = useUserStore((state) => state.setIsAuthed);
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);
  //
  const Router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    logInRequest(data);
  };
  const logInRequest = async (data: Inputs) => {
    axios.defaults.withCredentials = true;
    console.log(data);
    try {
      const logInResponse = await api.post("/login", data);
      if (logInResponse.status == 200) {
        alert("로그인에 성공했습니다.");
        // console.log(logInResponse);
        console.log(logInResponse.headers.access);
        console.log(logInResponse.headers.refresh);
        console.log(logInResponse.headers.check);
        console.log(logInResponse.data);
        if (typeof logInResponse.headers.access !== "undefined") {
          window.localStorage.setItem("access", logInResponse.headers.access);
          window.localStorage.setItem("refresh", logInResponse.headers.refresh);
          setToken(logInResponse.headers.access);
          // 로그인 상태 true로 바꿈.
          setIsAuthed(true);
          // 현재 로그인한 사용자 정보 저장
          setCurrentUser(logInResponse.data.memberDto);
          console.log("유저 정보~!!!", logInResponse.data.memberDto);
          // 토큰 상태 저장하고 searchUsers.
          // setToken(logInResponse.headers.access);

          // console.log("searchUsers 호출해볼게");
          // await searchUsers();
          // const searchResult = useUserStore.getState().searchResult;
          // console.log("뭐가 출력됨?", searchResult);
          // console.log(typeof searchResult);
          // setTimeout(() => {
          //   const searchResult = useUserStore.getState().searchResult;
          //   console.log("searchResult:", searchResult);
          // }, 100); // 100ms 정도의 짧은 지연 추가
          //
        } else {
          console.log("토큰을 찾지 못했습니다.");
        }
        Router.push("/dashboard");

        // window.location.href = "/dashboard";
        // } else {
        //   alert("로그인에 실패했습니다.");
      }
    } catch (error: any) {
      if (error.response.status === 401) {
        alert("아이디 혹은 비밀번호가 잘못 입력되었습니다.");
      }
    }
  };
  return (
    <Screen>
      <Container>
        <ContentsContainer>
          <TitleContainer>
            <Title>CODE ARENA</Title>
            <SubTitle>Log in</SubTitle>
          </TitleContainer>
          <Form>
            <InputContainer>
              <Input
                type="text"
                placeholder="   your email"
                autoComplete="on"
                value={email}
                {...register("email")}
                onChange={onChangeEmail}
              />
              <Input
                id="password"
                className="password"
                type="password"
                placeholder="   password"
                autoComplete="on"
                value={password}
                {...register("password")}
                onChange={onChangePassword}
              />
              <Button onClick={handleSubmit(onSubmit)}>로그인</Button>
              <CheckboxContainer>
                <CheckInput id="loginPersist" type="checkbox" />
                <Label htmlFor="loginPersist">로그인 유지</Label>
              </CheckboxContainer>
            </InputContainer>
          </Form>
          <TailContainer>
            <Link className="tosinguplink" href="/signup">
              회원가입
            </Link>
            <FindContainer>
              <TailText>계정 찾기</TailText>
              <TailText>비밀번호 찾기</TailText>
            </FindContainer>
          </TailContainer>
        </ContentsContainer>
      </Container>
    </Screen>
  );
}
