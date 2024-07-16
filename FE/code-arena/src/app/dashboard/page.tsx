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
  max-width: 75%;
  min-width: 30rem;
  width: 100vw;
  margin: 5px auto;
`;
