"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import Sidebar from "@/components/board/Sidebar";
import styled from "styled-components";
import BoardDetail from "@/components/board/BoardDetail";

export default function BoardPage({
  params,
}: {
  params: { category: string };
}) {
  // 경로 검사
  const { category } = params;
  const router = useRouter();
  const validBoards = ["feedbacks", "groups", "questions"];

  // 404 페이지로 리다이렉트
  useEffect(() => {
    if (!validBoards.includes(category)) {
      notFound();
    }
  }, [category]);

  if (!validBoards.includes(category as string)) {
    return null;
  }

  return (
    <>
      <Wrapper>
        <Sidebar />
        <BoardWrapper>
          <BoardDetail />
        </BoardWrapper>
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  font-family: Pretendard;
  display: flex;
  width: 1200px;
  margin: 20px auto;
  justify-content: space-between;
`;

const BoardWrapper = styled.div`
  width: 850px;
`;
