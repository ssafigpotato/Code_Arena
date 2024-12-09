"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import styled from "styled-components";
import useBoardStore, { SearchData } from "@/store/boardstore";

export default function Search() {
  return (
    <Suspense>
      <BeforeWrapped></BeforeWrapped>
    </Suspense>
  );
}

function BeforeWrapped() {
  const searchParams = useSearchParams();
  const keyword = searchParams ? searchParams.get("keyword") : null;
  const router = useRouter();
  const { searchBoard, searchResults, isLoading, error } = useBoardStore();

  const [groupPosts, setGroupPosts] = useState<SearchData[]>([]);
  const [questionPosts, setQuestionPosts] = useState<SearchData[]>([]);
  const [feedbackPosts, setFeedbackPosts] = useState<SearchData[]>([]);

  useEffect(() => {
    if (keyword) {
      searchBoard("WHOLE", keyword);
    }
  }, [keyword]);

  useEffect(() => {
    setGroupPosts(searchResults.filter((post) => post.boardType === "GROUPS"));
    setQuestionPosts(
      searchResults.filter((post) => post.boardType === "QUESTIONS")
    );
    setFeedbackPosts(
      searchResults.filter((post) => post.boardType === "FEEDBACKS")
    );
  }, [searchResults]);

  // 각 더보기 버튼
  const handleMoreClick = (type: string) => {
    const keywordParam = keyword ? `&keyword=${keyword}` : ``;
    const searchTypeParam = `?searchType=WHOLE`;
    router.push(`/community/${type}${searchTypeParam}${keywordParam}`);
  };

  // 날짜 포매팅
  const formatDate = (dateString: string) => {
    // 마이크로초 부분 제거
    const sanitizedDateString = dateString.split(".")[0];
    const date = new Date(sanitizedDateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}초 전`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}분 전`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}시간 전`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}일 전`;
    } else {
      // 7일이 넘으면 원래 날짜 형식으로 표시
      return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      }).format(date);
    }
  };

  // 각 검색결과에 대한 링크
  const handlePostClick = (post: SearchData) => {
    router.push(`/community/${post.boardType.toLowerCase()}/${post.boardId}`);
  };

  return (
    <Wrapper>
      {keyword && (
        <ResultTitle>
          "{keyword}"에 대한 전체 검색 결과: 총{" "}
          {groupPosts.length + questionPosts.length + feedbackPosts.length}건
        </ResultTitle>
      )}

      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      {!isLoading && !error && (
        <>
          <TitleWrapper>
            <Title>그룹 모집 게시판 (총 {groupPosts.length}건)</Title>
            <MoreButton onClick={() => handleMoreClick("groups")}>
              <span>더보기</span>
              <span className="material-icons">arrow_forward</span>
            </MoreButton>
          </TitleWrapper>
          <PostTable>
            <tbody>
              {groupPosts.slice(0, 5).map((post, index) => (
                <PostTableRow key={index} onClick={() => handlePostClick(post)}>
                  <PostTableCell width="40%">{post.title}</PostTableCell>
                  <PostTableCell width="20%">
                    <PostTableWrapper>
                      <ProfileImage
                        src={"/default-profile.jpeg"}
                        alt="Profile"
                      />
                      {post.nickname}
                    </PostTableWrapper>
                  </PostTableCell>
                  <PostTableCell width="15%">
                    {formatDate(post.createdAt)}
                  </PostTableCell>
                  <PostTableCell width="10%">
                    <PostTableWrapper>
                      <span className="material-icons">thumb_up</span>{" "}
                      {post.likes}
                    </PostTableWrapper>
                  </PostTableCell>
                  <PostTableCell width="10%">
                    <PostTableWrapper>
                      <span className="material-icons">chat_bubble</span>{" "}
                      {post.comments}
                    </PostTableWrapper>
                  </PostTableCell>
                </PostTableRow>
              ))}
            </tbody>
          </PostTable>

          <TitleWrapper>
            <Title>질문 게시판 (총 {questionPosts.length}건)</Title>
            <MoreButton onClick={() => handleMoreClick("questions")}>
              <span>더보기</span>
              <span className="material-icons">arrow_forward</span>
            </MoreButton>
          </TitleWrapper>
          <PostTable>
            <tbody>
              {questionPosts.slice(0, 5).map((post, index) => (
                <PostTableRow key={index} onClick={() => handlePostClick(post)}>
                  <PostTableCell width="40%">{post.title}</PostTableCell>
                  <PostTableCell width="20%">
                    <PostTableWrapper>
                      <ProfileImage
                        src={"/default-profile.jpeg"}
                        alt="Profile"
                      />
                      {post.nickname}
                    </PostTableWrapper>
                  </PostTableCell>
                  <PostTableCell width="15%">
                    {formatDate(post.createdAt)}
                  </PostTableCell>
                  <PostTableCell width="10%">
                    <PostTableWrapper>
                      <span className="material-icons">thumb_up</span>{" "}
                      {post.likes}
                    </PostTableWrapper>
                  </PostTableCell>
                  <PostTableCell width="10%">
                    <PostTableWrapper>
                      <span className="material-icons">chat_bubble</span>{" "}
                      {post.comments}
                    </PostTableWrapper>
                  </PostTableCell>
                </PostTableRow>
              ))}
            </tbody>
          </PostTable>

          <TitleWrapper>
            <Title>피드백 게시판 (총 {feedbackPosts.length}건)</Title>
            <MoreButton onClick={() => handleMoreClick("feedbacks")}>
              <span>더보기</span>
              <span className="material-icons">arrow_forward</span>
            </MoreButton>
          </TitleWrapper>
          <PostTable>
            <tbody>
              {feedbackPosts.slice(0, 5).map((post, index) => (
                <PostTableRow key={index} onClick={() => handlePostClick(post)}>
                  <PostTableCell width="40%">{post.title}</PostTableCell>
                  <PostTableCell width="20%">
                    <PostTableWrapper>
                      <ProfileImage
                        src={"/default-profile.jpeg"}
                        alt="Profile"
                      />
                      {post.nickname}
                    </PostTableWrapper>
                  </PostTableCell>
                  <PostTableCell width="15%">
                    {formatDate(post.createdAt)}
                  </PostTableCell>
                  <PostTableCell width="10%">
                    <PostTableWrapper>
                      <span className="material-icons">thumb_up</span>{" "}
                      {post.likes}
                    </PostTableWrapper>
                  </PostTableCell>
                  <PostTableCell width="10%">
                    <PostTableWrapper>
                      <span className="material-icons">chat_bubble</span>{" "}
                      {post.comments}
                    </PostTableWrapper>
                  </PostTableCell>
                </PostTableRow>
              ))}
            </tbody>
          </PostTable>
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 1200px;
  font-family: Pretendard;
  color: white;
  display: flex;
  flex-direction: column;
  margin: 20px auto;
`;

const ResultTitle = styled.div`
  font-size: 32px;
  font-weight: 700;
  margin-top: 20px;
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 25px;
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: 700;
`;

const MoreButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 500;
  border-radius: 20px;
  padding: 8px 12px;
  margin-left: 10px;
  background-color: var(--yellow-color);
  cursor: pointer;
  transition: background-color 0.3s ease;
  color: black;

  &:hover {
    background-color: #ffe066;
  }

  .material-icons {
    margin-left: 4px;
  }
`;

const PostTable = styled.table`
  color: black;
  width: 100%;
  font-family: Pretendard;
  border-collapse: collapse;
  margin-top: 20px;
  font-size: 18px;
  text-align: left;
  border-collapse: separate;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 40px;
`;

const PostTableRow = styled.tr`
  background-color: white;
  &:hover {
    cursor: pointer;
    background-color: var(--light-color);
  }
`;

const PostTableCell = styled.td<{ width?: string }>`
  padding: 8px 15px;
  border-bottom: 1px solid #ddd;
  width: ${(props) => props.width || "auto"};
  vertical-align: middle;
`;

const PostTableWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ProfileImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 15px;
  object-fit: cover;
`;
