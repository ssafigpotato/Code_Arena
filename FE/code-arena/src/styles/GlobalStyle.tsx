import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import 'pretendard/dist/web/static/pretendard.css';

const GlobalStyle = createGlobalStyle`
  ${reset}
  body {
    font-family: 'Pretendard', sans-serif;
  }
`;

export default GlobalStyle;

