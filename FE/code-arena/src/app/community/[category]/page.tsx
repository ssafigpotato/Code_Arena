"use client";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";
import BoardButtons from "@/components/board/BoardButtons";
import BoardTitle from "@/components/board/BoardTitle";
import Sidebar from "@/components/board/Sidebar";
import styled from "styled-components";
import BoardList from "@/components/board/BoardList";
import Pagination from "@mui/material/Pagination";
import { styled as muiStyled } from "@mui/material/styles";
import Dropdown from "@/components/common/input/Dropdown";
import SearchBar from "@/components/common/input/SearchBar";
import useBoardStore, { BoardData, SearchData } from "@/store/boardstore";

export default function BoardPage({
  params,
}: {
  params: { category: string };
}) {
  const { category } = params;
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

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const { boardList, fetchBoardList, searchBoard, searchResults, isLoading } =
    useBoardStore();

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  // 정렬 상태 관리
  const [sortOrder, setSortOrder] = useState("최신순");

  const sortedBoardList = useMemo(() => {
    let sortedList = [...boardList];
    switch (sortOrder) {
      case "최신순":
        sortedList.sort(
          (a, b) =>
            new Date(b.board.createdAt).getTime() -
            new Date(a.board.createdAt).getTime()
        );
        break;
      // case "추천순":
      //   sortedList.sort((a, b) => b.board.likes - a.board.likes);
      //   break;
      // 추천순 로직 작성 필요로 우선 주석처리
      case "좋아요순":
        sortedList.sort((a, b) => b.board.likes - a.board.likes);
        break;
      case "댓글많은순":
        sortedList.sort((a, b) => b.comments - a.comments);
        break;
      default:
        break;
    }
    return sortedList;
  }, [boardList, sortOrder]);

  const sortedSearchBoardList = useMemo(() => {
    let sortedList = [...searchResults];
    switch (sortOrder) {
      case "최신순":
        sortedList.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      // case "추천순":
      //   sortedList.sort((a, b) => b.likes - a.likes);
      //   break;
      // 추천순 로직 작성 필요로 우선 주석처리
      case "좋아요순":
        sortedList.sort((a, b) => b.likes - a.likes);
        break;
      case "댓글많은순":
        sortedList.sort((a, b) => b.comments - a.comments);
        break;
      default:
        break;
    }
    return sortedList;
  }, [searchResults, sortOrder]);

  const currentPosts = sortedBoardList.slice(indexOfFirstPost, indexOfLastPost);
  const currentSearchPosts = sortedSearchBoardList
    .filter((post) => post.boardType.toLowerCase() === category)
    .slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(
    (searchResults.length > 0 ? searchResults.length : boardList.length) /
      postsPerPage
  );

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(
    searchParams ? searchParams.get("keyword") || "" : ""
  );
  const [searchType, setSearchType] = useState(
    searchParams ? searchParams.get("searchType") || "WHOLE" : "WHOLE"
  );

  useEffect(() => {
    fetchBoardList(category); // 게시글 가져오기
  }, [category, fetchBoardList]);

  // 검색 인풋 처리
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  // 검색 엔터 처리
  const router = useRouter();
  const handleSearch = () => {
    router.push(
      `/community/${category}?searchType=${searchType}&keyword=${keyword}`
    );
    searchBoard(searchType, keyword);
  };

  // 검색 필터 처리
  const dropdownList = ["전체", "제목 + 내용", "제목만", "내용만", "작성자명"];
  const handleDropdownChange = (value: string) => {
    switch (value) {
      case "제목 + 내용":
        setSearchType("BOTH");
        break;
      case "제목만":
        setSearchType("TITLE");
        break;
      case "내용만":
        setSearchType("CONTENT");
        break;
      case "작성자명":
        setSearchType("WRITER");
        break;
      default:
        setSearchType("WHOLE");
    }
  };

  // 검색 중인지 조건
  const isSearching =
    searchParams?.has("keyword") && searchParams?.has("searchType");

  return (
    <Wrapper>
      <Sidebar />
      <BoardWrapper>
        <BoardTitle />
        <BoardButtons setSortOrder={setSortOrder} />
        {isLoading ? (
          <p>로딩 중...</p>
        ) : isSearching ? (
          currentSearchPosts.map((post: SearchData, index) => (
            <BoardList
              key={index}
              board={{
                board: {
                  id: post.boardId,
                  boardType: post.boardType,
                  content: post.content,
                  createdAt: post.createdAt,
                  deleted: false,
                  deletedAt: null,
                  likes: post.likes,
                  title: post.title,
                  updatedAt: post.createdAt,
                  views: post.views,
                },
                comments: post.comments,
                memberNickname: post.nickname,
                memberId: "", // 멤버 ID는 필요 시 추가
              }}
            />
          ))
        ) : (
          currentPosts.map((board: BoardData) => (
            <BoardList key={board.board.id} board={board} />
          ))
        )}
        <PaginationWrapper>
          <StyledPagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            showFirstButton
            showLastButton
            shape="rounded"
          />
        </PaginationWrapper>
        <SearchWrapper>
          <Dropdown
            list={dropdownList}
            onChange={handleDropdownChange}
            style={{ width: "170px" }}
          />
          <SearchBar
            value={keyword}
            onChange={handleSearchChange}
            onSearch={handleSearch}
          />
        </SearchWrapper>
      </BoardWrapper>
    </Wrapper>
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

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const StyledPagination = muiStyled(Pagination)(({ theme }) => ({
  "& .MuiPaginationItem-root": {
    color: "white",
    borderRadius: "0px",
    "&.Mui-selected": {
      borderTop: "2px solid var(--yellow-color)", // 선택된 페이지 색상
      color: "var(--yellow-color)",
    },
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.08)", // 호버 시 배경색
    },
  },
}));

const SearchWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  align-items: center;
  margin-bottom: 60px;
`;
