// export default function Index() {
//   return <main></main>;
// }

"use client";
import React from "react";
import styled from "styled-components";
import BorderButton from "@/components/common/button/BorderButton";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/userstore";

// Wrapper 스타일 컴포넌트 정의
const Wrapper = styled.div`
  width: 1200px;
  min-height: 80vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #ffffff;

  * {
    // border: 1px solid lime;
  }
`;

// Main 스타일 컴포넌트
const Main = styled.div`
  // main전체 속성
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 3rem 0;
  // 추후 수정 가능
  min-width: 40rem;
  //

  text-align: center;
  min-height: 80vh;
  font-weight: 600;
`;

// Advertisements 스타일 컴포넌트
const Advertisements = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 40px auto;
  height: 12rem;
  justify-content: space-between;

  h1 {
    font-size: 4rem;
    span {
      color: var(--yellow-color);
    }
  }

  h2 {
    font-size: 3rem;
  }

  #title {
    background: linear-gradient(
      to right,
      var(--primary-color),
      var(--light-color)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

// Button스타일 컴포넌트
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  // height: 3rem;
  // width: 12.5rem;
  margin: 1.5rem 0;

  button {
    margin: 0.5rem;
  }
`;

// Lang 스타일 컴포넌트
const Lang = styled.div`
  width: 90%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1rem 0;
  div {
    display: flex;
  }

  img {
    width: 1rem;
    heigth: 1rem;
  }
`;

const IntroContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  // height: 10rem;
`;

const Intro = styled.div`
  display: flex;
  align-items: center;
  height: 30rem;
  margin: 40px;

  img {
    width: 60%;
    max-height: 30rem;
    object-fit: scale-down;
  }
`;

const Comments = styled.div<{ $align?: "start" | "end" }>`
  display: flex;
  flex-direction: column;
  width: 40%;
  text-align: ${(props) => (props.$align ? props.$align : "end")};

  h2 {
    font-size: 1.3rem;
    span {
      color: var(--yellow-color);
    }
  }
`;
// Index 페이지 컴포넌트
const Index = () => {
  const { currentUser } = useUserStore();
  // 회원가입, 대시보드로 바로가기
  const router = useRouter();

  const goSignUp = () => {
    if (currentUser) {
      alert("회원가입을 진행하려면 로그아웃이 필요합니다.");
    } else {
      router.push("/signup");
    }
  };

  const goDashBoard = () => {
    router.push("/dashboard");
  };

  return (
    <Wrapper>
      <Main>
        <Advertisements>
          <h1>
            연습도 <span>실전</span>처럼
          </h1>
          <h2> No.1 라이브 코딩 테스트 플랫폼</h2>
          <h2 id="title"> CODE ARENA</h2>
        </Advertisements>
        <ButtonContainer>
          <BorderButton
            text="회원가입"
            $bgColor="var(--bg-color)"
            $hoverColor="var(--light-color)"
            $borderColor="#ffffff"
            $textColor="#ffffff"
            onClick={goSignUp}
          />
          <BorderButton
            text="대시보드 둘러보기"
            $bgColor="#ffffff"
            $hoverColor="var(--primary-color)"
            $borderColor="#ffffff"
            onClick={goDashBoard}
          />
        </ButtonContainer>
        {/* <button id="signup">회원가입</button>
          <button id="dash">대시보드 둘러보기</button> */}

        <Lang>
          <div>
            <img src="../images/java.png" />
            <p>JAVA</p>
          </div>
          <div>
            <img src="../images/python.png" />
            <p>PYTHON</p>
          </div>
          <div>
            <img src="../images/cpp.png" />
            <p>C++</p>
          </div>
          <div>
            <img src="../images/kotlin.png" />
            <p>KOTLIN</p>
          </div>
          <div>
            <img src="../images/js.png" />
            <p>JAVASCRIPT</p>
          </div>
        </Lang>
        <IntroContainer>
          <Intro>
            <img src="../images/intro1.png"></img>
            <Comments>
              <h2>
                원하는 <span>방 / 그룹</span>을 만들고
              </h2>
            </Comments>
          </Intro>
          <Intro>
            <Comments $align="start">
              <h2>역할을 나누어 </h2>
              <h2>
                <span>라이브 코딩테스트</span>를 준비한다!
              </h2>
            </Comments>
            <img src="../images/intro2.png"></img>
          </Intro>
          <Intro>
            <img src="../images/intro3.png"></img>
            <Comments>
              <h2>
                <span>AI리포트</span>로 역량 확인까지
              </h2>
            </Comments>
          </Intro>
          {/* <button id="dash">대시보드 둘러보기</button> */}
        </IntroContainer>
        <BorderButton
          text="대시보드 둘러보기"
          $bgColor="#ffffff"
          $hoverColor="var(--primary-color)"
          $borderColor="#ffffff"
          onClick={goDashBoard}
        />
      </Main>
    </Wrapper>
  );
};

export default Index;
