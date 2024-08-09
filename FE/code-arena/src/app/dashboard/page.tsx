"use client";

import styled from "styled-components";
import RoomList from "@/components/dashboard/RoomList";
import GroupList from "@/components/dashboard/GroupList";
import { Suspense } from "react";
export default function dashboard() {
  return (
    <Suspense>
      <Wrapper>
        <RoomList />
        <GroupList />
      </Wrapper>
    </Suspense>
  );
}

const Wrapper = styled.div`
  width: 1200px;
  margin: 5px auto;
`;
