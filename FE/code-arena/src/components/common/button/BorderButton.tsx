import React from "react";
import styled from "styled-components";

interface ButtonProps {
  text: string | null;
  type?: "button" | "submit" | "reset";
  $bgColor?: string;
  $hoverColor?: string;
  $borderColor?: string;
  $textColor?: string;
  $disabled?: boolean;
  $form?: string;
  onClick?:
    | (() => void)
    | ((e: React.FormEvent<HTMLButtonElement>) => void)
    | ((e: React.MouseEvent<HTMLButtonElement>) => void);
}

const BorderButton: React.FC<ButtonProps> = ({
  text,
  type = "button",
  $bgColor,
  $hoverColor,
  $disabled,
  $borderColor,
  $textColor,
  $form,
  onClick,
}) => {
  return (
    <Button
      type={type}
      $bgColor={$bgColor}
      $hoverColor={$hoverColor}
      $borderColor={$borderColor}
      $textColor={$textColor}
      form={$form}
      onClick={onClick}
      disabled={$disabled}
    >
      {text}
    </Button>
  );
};

const Button = styled.button<{
  $bgColor?: string;
  $hoverColor?: string;
  $borderColor?: string;
  $textColor?: string;
}>`
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 700;
  border-radius: 6px;
  border: 2px solid ${(props) => props.$borderColor || "#000000"};
  padding: 12px 20px;
  background-color: ${(props) => props.$bgColor || "var(--yellow-color)"};
  cursor: pointer;
  transition: background-color 0.3s ease;
  color: ${(props) => props.$textColor || "#000000"};

  &:hover:not([disabled]) {
    background-color: ${(props) => props.$hoverColor || "var(--light-color)"};
  }
  &:disabled {
    cursor: not-allowed;
  }
`;

export default BorderButton;
