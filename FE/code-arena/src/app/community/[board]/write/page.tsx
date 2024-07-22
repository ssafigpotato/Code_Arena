"use client";

import WriteContainer from "@/components/board/write/WriteContainer";
import WriteTab from "@/components/board/write/WriteTab";
import styled from "styled-components";

export default function write() {
  return (
    <>
      <Wrapper>
        <WriteTab />
        <WriteContainer />
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  font-family: Pretendard;
  display: flex;
  flex-direction: column;

  width: 1000px;
  margin: 0px auto;
`;
