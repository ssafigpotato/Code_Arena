import styled from "styled-components";
import Link from "next/link";
import { usePathname } from "next/navigation";

const WriteTab = () => {
  const pathname = usePathname() || "";

  return (
    <SidebarContainer>
      <StyledLink
        href="/community/groups/write"
        $isActive={pathname.startsWith("/community/groups")}
      >
        그룹 모집
      </StyledLink>
      <StyledLink
        href="/community/questions/write"
        $isActive={pathname.startsWith("/community/questions")}
      >
        질문
      </StyledLink>
      <StyledLink
        href="/community/feedbacks/write"
        $isActive={pathname.startsWith("/community/feedbacks")}
      >
        피드백
      </StyledLink>
      <Styleddiv></Styleddiv>
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div`
  display: flex;
  flex: 1;
  margin-bottom: 20px;
`;

const StyledLink = styled(Link).withConfig({
  shouldForwardProp: (prop) => !["$isActive"].includes(prop),
})<{ $isActive: boolean }>`
  padding: 20px;
  text-decoration: none;
  font-size: 24px;
  font-weight: 700;
  color: ${({ $isActive }) => ($isActive ? "var(--yellow-color)" : "white")};
  border-bottom: ${({ $isActive }) =>
    $isActive ? "2px solid var(--yellow-color)" : "2px solid #d4d4d4"};
  cursor: pointer;

  &:hover {
    text-decoration: none;
  }

  &:focus {
    text-decoration: none;
  }
`;

const Styleddiv = styled.div`
  display: flex;
  flex: 1;
  border-bottom: 2px solid #d4d4d4;
`;

export default WriteTab;
