import React, { ChangeEvent } from "react";
import styled from "styled-components";

interface CheckboxProps {
  text: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void; // onChange 속성 추가
}

const Checkbox: React.FC<CheckboxProps> = ({ text, onChange }) => {
  return (
    <StyledLabel htmlFor={text}>
      <StyledInput type="checkbox" id={text} name={text} onChange={onChange} />{" "}
      {/* onChange 전달 */}
      <StyledP>{text}</StyledP>
    </StyledLabel>
  );
};

export default Checkbox;

const StyledInput = styled.input`
  appearance: none;
  width: 1.5rem;
  height: 1.5rem;
  border: 1.5px solid gainsboro;
  border-radius: 0.35rem;
  background-color: white;

  &:checked {
    border-color: transparent;
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
    background-size: 100% 100%;
    background-position: 50%;
    background-repeat: no-repeat;
    background-color: var(--primary-color);
  }
`;

const StyledLabel = styled.label`
  font-family: Pretendard;
  display: flex;
  flex-direction: row;
  align-items: center;
  user-select: none;
  color: white;
`;

const StyledP = styled.p`
  margin-left: 0.25rem;
  white-space: nowrap;
`;
