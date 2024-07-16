import React from "react";
import styled from "styled-components";
const Wrapper = styled.div`
  max-width: 1200px;
  width: 100vw;
  min-height: 10vh;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  color: #ffffff;

  @media (max-width: 768px) {
  }
`;

const Header = () => {
  return (
    <Wrapper>
      <header>여기는 헤더 자리</header>
    </Wrapper>
  );
};

export default Header;
