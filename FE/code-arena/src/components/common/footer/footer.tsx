import React from "react";
import styled from "styled-components";
import Link from "next/link";

const Wrapper = styled.div`
  width: 1200px;
  height: 4rem;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  color: #ffffff;

  * {
    // border: 1px solid lime;
  }
`;
const Main = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  // height: 4.2rem;
  border-top: 0.01rem solid var(--light-color);
  padding: 0.7rem;

  a {
    text-decoration-line: none;
    color: #ffffff;
    margin: 0 1rem;
    font-size: 0.9rem;
    font-weight: 700;
  }
`;

const Footer = () => {
  return (
    <Wrapper>
      <Main>
        <div>
          <Link href={"/"}>개인정보 처리방침</Link>
          <Link href={"/"}>이용약관</Link>
        </div>
        <Link href={"/"}>Copyright© CODE ARENA </Link>
      </Main>
    </Wrapper>
  );
};

export default Footer;
