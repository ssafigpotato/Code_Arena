import { useState } from "react";
import styled from "styled-components";

const FormContent = styled.div`
  display: flex;
  margin-top: 40px;
  margin-bottom: 10px;
  align-items: center;
`;

const FormLabel = styled.div`
  color: white;
  width: 150px;
  font-size: 24px;
  font-weight: 700;
`;

const ModalText = styled.div`
  color: white;
  font-size: 20px;
  font-weight: 500;
  margin-left: 10px;
`;

const Dropdown = styled.select<{ width?: string }>`
  font-family: Pretendard;
  padding: 12px;
  font-size: 16px;
  width: ${(props) => props.width || "80px"};
  border-radius: 20px;
  border: 1px solid white;
  background-color: #202e41;
  color: white;
`;

interface GroupInputProps {
  maxNum: number;
  onChange: (value: number) => void;
}

const GroupInput: React.FC<GroupInputProps> = ({ maxNum, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <FormContent>
      <FormLabel>그룹 정원</FormLabel>
      <Dropdown value={maxNum} onChange={handleChange} width="80px">
        {Array.from({ length: 8 }, (_, i) => (
          <option key={i + 1} value={i + 1}>
            {i + 1}
          </option>
        ))}
      </Dropdown>
      <ModalText>명</ModalText>
    </FormContent>
  );
};

export default GroupInput;
