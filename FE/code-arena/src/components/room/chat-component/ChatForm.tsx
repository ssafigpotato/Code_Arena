import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  height: 14rem;
  padding: 0.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  width: 17rem;
  border-radius: 0.5rem;
`;

const ChatForm = () => {
  return (
    <>
      <Wrapper>
        <h1> 모달이에용</h1>
      </Wrapper>
    </>
  );
};

export default ChatForm;
