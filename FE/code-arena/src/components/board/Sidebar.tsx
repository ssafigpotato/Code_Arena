import styled from "styled-components";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname() || "";

  return (
    <SidebarContainer>
      <StyledLink
        href="/community/groups"
        $isActive={pathname.startsWith("/community/groups")}
      >
        그룹 모집 게시판
      </StyledLink>
      <StyledLink
        href="/community/questions"
        $isActive={pathname.startsWith("/community/questions")}
      >
        질문 게시판
      </StyledLink>
      <StyledLink
        href="/community/feedbacks"
        $isActive={pathname.startsWith("/community/feedbacks")}
      >
        피드백 게시판
      </StyledLink>
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div`
  width: 200px;
  display: flex;
  flex-direction: column;
`;

const StyledLink = styled(Link).withConfig({
  shouldForwardProp: (prop) => !["$isActive"].includes(prop),
})<{ $isActive: boolean }>`
  padding: 20px;
  text-decoration: none;
  font-size: 24px;
  font-weight: 700;
  color: ${({ $isActive }) => ($isActive ? "var(--yellow-color)" : "white")};
  cursor: pointer;

  &:hover {
    text-decoration: none;
  }

  &:focus {
    text-decoration: none;
  }
`;

export default Sidebar;
