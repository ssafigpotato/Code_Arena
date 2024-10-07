import styled from "styled-components";

interface RoundButtonProps {
  text: string;
  onClick?: () => void;
}

const RoundButton: React.FC<RoundButtonProps> = ({ text, onClick }) => {
  return <Button onClick={onClick}>{text}</Button>;
};

const Button = styled.button`
  font-family: Pretendard;
  font-size: 20px;
  font-weight: 500;
  border-radius: 20px;
  border: none;
  padding: 8px 12px;
  background-color: var(--yellow-color);
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ffe066; /* 밝은 노란색으로 변경 */
  }
`;

export default RoundButton;
