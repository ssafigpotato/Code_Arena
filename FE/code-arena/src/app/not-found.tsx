"use client";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import BorderButton from "@/components/common/button/BorderButton";

export default function NotFound() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

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
}

const Wrapper = styled.div`
  width: 1200px;
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
