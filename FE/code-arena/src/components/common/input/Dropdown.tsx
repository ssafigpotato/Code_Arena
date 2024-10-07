import React, { useState } from "react";
import styled from "styled-components";

interface DropdownProps {
  list: string[];
  onChange: (value: string) => void;
  style?: React.CSSProperties;
}

interface StyledOptionListProps {
  $active: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({ list, onChange, style }) => {
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState(list[0]);

  const handleSelect = (element: string) => {
    setSelected(element);
    setActive(false);
    onChange(element);
  };

  return (
    <StyledSelectbox style={style}>
      <StyledSelectedLabel onClick={() => setActive(!active)}>
        {selected}
        <span className="material-icons">expand_more</span>
      </StyledSelectedLabel>
      <StyledOptionList $active={active}>
        {list
          .filter((element) => element !== selected)
          .map((element) => (
            <StyledOptionItem
              key={element}
              onClick={() => handleSelect(element)}
            >
              {element}
            </StyledOptionItem>
          ))}
      </StyledOptionList>
    </StyledSelectbox>
  );
};

export const StyledOptionItem = styled.li`
  box-sizing: border-box;
  padding: 0.8rem 1rem 0.8rem 1rem;
  transition: 0.3s;
  &:hover {
    background-color: white;
  }
`;

const activeExist = ({ $active }: StyledOptionListProps) => {
  return `max-height: ${$active ? "300px" : "0"}`;
};

export const StyledOptionList = styled.ul<StyledOptionListProps>`
  box-sizing: border-box;
  position: absolute;
  top: 2.6rem;
  list-style-type: none;
  width: 100%;
  border-radius: 8px;
  background: #ffffff;
  ${activeExist};
  transition: 0.2s ease-in-out;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 1rem;
    background: darken(0.1, "transparent");
  }
  &::-webkit-scrollbar-button {
    width: 0;
    height: 0;
  }
`;

export const StyledSelectedLabel = styled.button`
  font-family: Pretendard;
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem 0.8rem 1rem;
  border: none;
  box-sizing: border-box;
  width: inherit;
  height: inherit;
  border-radius: 8px;
  justify-content: space-between;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;

  .material-icons {
    font-size: 2rem;
  }
`;

export const StyledSelectbox = styled.div`
  position: relative;
  width: 8rem;
  height: 2.6rem;
  border-radius: 8px;
  background: white;
  cursor: pointer;
`;

export default Dropdown;
