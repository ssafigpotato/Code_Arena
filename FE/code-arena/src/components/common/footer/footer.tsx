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

const Footer = () => {
  return (
    <Wrapper>
      <footer>여기는 푸터 자리</footer>
    </Wrapper>
  );
};

export default Footer;
