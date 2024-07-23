import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import BorderButton from "@/components/common/button/BorderButton";
import Link from "next/link";

const Wrapper = styled.div`
  display: flex;
  background-color: #ffffff;
  height: 100%;
  border-radius: 1rem;
  margin: 0 0 0 0.9rem;
`;

const Test = () => {
  return (
    <>
      <Wrapper>
        <h1>테스트상새이빈당</h1>
      </Wrapper>
    </>
  );
};

export default Test;
