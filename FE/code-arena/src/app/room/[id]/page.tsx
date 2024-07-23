"use client";
import React from "react";
import styled from "styled-components";
import RoomInfo from "@/components/room/RoomInfo";

const Wrapper = styled.div`
  width: 100vw;
  // padding: 0.5rem;
  color: #ffffff;
  * {
    border: 1px solid lime;
  }
`;

export default function Room() {
  return (
    <Wrapper>
      <RoomInfo />
    </Wrapper>
  );
}
