import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import BorderButton from "@/components/common/button/BorderButton";
import Link from "next/link";

const Wrapper = styled.div`
  display: flex;
  height: 20rem;
  width: 30rem;
  background-color: #ffffff;
  border-radius: 1rem;
  margin: 0.9rem 0 0 0;
`;
const MyInfos = () => {
  return (
    <>
      <Wrapper>
        <h1>내 정보이빈당</h1>
      </Wrapper>
    </>
  );
};

export default MyInfos;
