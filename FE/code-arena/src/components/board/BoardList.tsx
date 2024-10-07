"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { BoardData } from "@/store/boardstore";

interface BoardListProps {
  board: BoardData;
}

const BoardList: React.FC<BoardListProps> = ({ board }) => {
  const profileImage = "/default-profile.jpeg";
  const pathname = usePathname();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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
      return dateString; // 7일이 넘으면 원래 날짜 형식으로 표시
    }
  };

  const category = pathname ? pathname.split("/").pop() : "default-board";

  return (
    <StyledLink href={`/community/${category}/${board.board.id}`} passHref>
      <PostContainer>
        <PostTitle>{board.board.title}</PostTitle>
        <PostContent>{board.board.content}</PostContent>
        <PostFooter>
          <AuthorInfo>
            <ProfileImage
              src={profileImage}
              alt={`${board.memberNickname}의 프로필 사진`}
            />
            {board.memberNickname} · {formatDate(board.board.createdAt)}
          </AuthorInfo>
          <PostStats>
            <span className="material-icons">visibility</span>
            {board.board.views} <span className="material-icons">thumb_up</span>
            {board.board.likes}{" "}
            <span className="material-icons">chat_bubble</span>
            {board.comments}
          </PostStats>
        </PostFooter>
      </PostContainer>
    </StyledLink>
  );
};

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const PostContainer = styled.div`
  border-bottom: 1px solid white;
  padding: 16px;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.25);
  }
`;

const PostFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 15px;
  margin-right: 10px;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  color: white;
  font-size: 16px;
  font-weight: 500;
`;

const PostTitle = styled.h2`
  color: white;
  font-size: 20px;
  font-weight: 600;
  margin: 8px 0;
  margin-bottom: 18px;
`;

const PostContent = styled.p`
  color: white;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 16px;
  font-weight: 400;
  margin: 8px 0;
  margin-bottom: 18px;
`;

const PostStats = styled.div`
  display: flex;
  align-items: center;
  color: white;
  font-size: 16px;
  font-weight: 500;

  .material-icons {
    font-size: 16px;
    margin: 0 8px;
  }
`;

export default BoardList;
