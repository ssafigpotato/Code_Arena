"use client";
import React from "react";
import styled from "styled-components";
import { usePathname } from "next/navigation";

const BoardTitle = () => {
  const pathname = usePathname();

  const getTitle = () => {
    switch (pathname) {
      case "/community/groups":
        return "그룹 모집 게시판";
      case "/community/questions":
        return "질문 게시판";
      case "/community/feedbacks":
        return "피드백 게시판";
      default:
        return "게시판";
    }
  };

  const getDescription = () => {
    switch (pathname) {
      case "/community/groups":
        return "그룹원들과 더 큰 성장을 이뤄보세요.";
      case "/community/questions":
        return "질문이 답을 만나는 곳, 함께 해결해요!";
      case "/community/feedbacks":
        return "미래를 위한 성찰과 발전의 공간";
      default:
        return "";
    }
  };

  return (
    <StyledDiv>
      <Title>{getTitle()}</Title>
      <Description>{getDescription()}</Description>
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  background-color: var(--primary-color);
  padding: 20px;
`;

const Title = styled.div`
  font-family: Pretendard;
  font-size: 32px;
  font-weight: 800;
  color: white;
  margin-bottom: 20px;
`;

const Description = styled.div`
  font-family: Pretendard;
  font-size: 24px;
  font-weight: 600;
  color: white;
  text-align: right;
`;

export default BoardTitle;
