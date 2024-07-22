"use client";

import styled from "styled-components";
import RoomList from "@/components/dashboard/RoomList";
import GroupList from "@/components/dashboard/GroupList";

export default function dashboard() {
  return (
    <>
      <Wrapper>
        <RoomList />
        <GroupList />
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  width: 1200px;
  margin: 5px auto;
`;
