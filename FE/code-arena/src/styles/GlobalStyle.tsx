"use client";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import "pretendard/dist/web/static/pretendard.css";

const GlobalStyle = createGlobalStyle`
  ${reset}
   :root {
    --bg-color: #27374D;
    --primary-color: #526D82;
    --secondary-color: #9DB2Bf;
    --light-color: #DDE6ED;
    --yellow-color: #FFD91C;
    --red-color: #F38080;
  }

  body {
    font-family: 'Pretendard', sans-serif;
  }
`;

export default GlobalStyle;
