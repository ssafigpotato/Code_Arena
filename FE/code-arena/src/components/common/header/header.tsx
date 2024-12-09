import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import BorderButton from "@/components/common/button/BorderButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import api from "@/utils/api";
import useUserStore from "@/store/userstore";
// 스타일드 컴포넌트
const Wrapper = styled.div`
  width: 1200px;
  min-height: 10vh;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  color: #ffffff;
  border-bottom: 1px solid var(--light-color);
  position: sticky;
  top: 0;
  z-index: 999;
  background-color: var(--bg-color);
  * {
    // border: 1px solid lime;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 1200px;
  // padding: 0.7rem;
  background-color: var(--bg-color);

  #line {
    height: 2rem;
    border: 1px solid #ffffff;
    margin: 0 1rem;
  }
`;

const Logo = styled.div`
  width: 4rem;
  img {
    width: 3.5rem;
    height: 3.5rem;
  }
  margin: 0 2rem;
`;

const InputContainer = styled.div`
  // min-width: 25rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 2rem;

  input {
    width: 20rem;
    height: 2rem;
    padding: 0;
    outline: none;
    border: none;
  }

  // 랜더링 될 때는 button으로 인식하는듯
  button {
    display: flex;
    align-items: center;
    justify-content: end;
    height: 2rem;
    width: 7rem;
    padding: 0 0.7rem;
    border-radius: 0 1rem 1rem 0;
    font-family: "Pretendard", sans-serif;
    font-size: 0.9rem;
  }

  span {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    color: #000000;
    height: 2rem;
    border-radius: 1rem 0 0 1rem;
    padding: 0 0 0 0.5rem;
  }
`;

const Tab = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 0 2rem;

  #dash {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 5rem;
    height: 2rem;
    color: #ffffff;
    text-decoration-line: none;
    font-size: 0.9rem;
    font-weight: 700;
  }

  button {
    border: none;
    width: 5rem;
    color: #ffffff;
    background-color: var(--bg-color);
    font-size: 0.9rem;
    font-weight: 700;
    padding: 0;
    font-family: "Pretendard", sans-serif;
  }
`;

const User = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 0 0 1rem;
  width: 13rem;
  margin: 0 2rem;
`;
const Logout = styled.div`
  display: flex;
  button {
    height: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  button:nth-child(2) {
    font-size: 0.9rem;
    border: none;
    width: 5rem;
    padding: 0;
  }
`;
const UserNickName = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.3rem;
  font-weight: 800;
  width: 10rem;
  height: 3rem;
  background-color: var(--secondary-color);
  border: 2px solid #ffffff;
  border-radius: 0.5rem;
  color: #ffffff;
  cursor: pointer;
`;
const LinkStyle = styled.div`
  display: flex;
  button {
    padding: 0.3rem;
    width: 6rem;
    margin: 0 0.2rem;
    border-width: 1px;
    font-size: 0.9rem;
    font-family: "Pretendard", sans-serif;
  }
`;

// 드롭다운 관련
const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }: { $isOpen: boolean }) =>
    $isOpen ? "block" : "none"};
  position: absolute;
  top: 4rem;
  left: 6.1rem;
  background-color: var(--primary-color);
  color: #ffffff;
  width: 10rem;
  z-index: 1;
`;

const DropdownItem = styled.a`
  display: block;
  text-align: center;
  padding: 2rem 1.5rem;
  color: #ffffff;
  text-decoration: none;
  font-size: 0.9rem;

  &:hover {
    background-color: var(--yellow-color);
    color: #000000;
`;

// 헤더
const Header = () => {
  // 1. 네비게이션 드롭다운
  // isOpen: 드롭다운메뉴 열려있는지 여부 상태변수
  // setOpen: isOpen 상태 업데이트 함수
  const [isOpen, setOpen] = useState(false);
  // Dom 요소에 접근하기 위해 useRef 사용
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 토글하면 드롭다운메뉴 현재 오픈 상태 바꾸기
  const toggleDropdown = () => {
    setOpen((prev) => !prev);
  };

  // 드롭다운 메뉴 외부 클릭 감지
  const ClickOutside = (event: MouseEvent) => {
    if (
      // dropdownRef 존재 && 클릭 한 곳이 드롭다운 메뉴 내부가 아니면서
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      // buttonRef가 존재 && 클릭 한 곳이 버튼 내부도 아니면
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      // 드롭메뉴 닫기
      setOpen(false);
    }
  };

  // 드롭다운메뉴 바깥을 클릭했을 때 메뉴가 사라지도록
  // useEffect(마운트, 언마운트 실행 코드 정의) 사용
  useEffect(() => {
    document.addEventListener("mousedown", ClickOutside);
    return () => {
      document.removeEventListener("mousedown", ClickOutside);
    };
  }, []);

  // 2. 검색 로직
  const router = useRouter();
  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    if (keyword) {
      console.log(`Navigating to /search?keyword=${keyword}`);
      router.push(`/search?keyword=${keyword}`);
    } else {
      console.log("Keyword is empty");
    }
  };

  // 3. 로그인, 회원가입, 마이페이지 링크연결
  const goLogin = () => {
    router.push("/login");
  };

  const goSignUp = () => {
    router.push("/signup");
  };

  const goMyPage = () => {
    router.push("/mypage");
  };

  // 4. 로그인한 유저 정보 불러오기 관련
  const [token, setToken] = useState<string | null>(null);
  // const { searchResult: user, searchUsers } = useUserStore((state) => ({
  //   searchResult: state.searchResult,
  //   searchUsers: state.searchUsers,
  // }));
  const { currentUser, isAuthed } = useUserStore((state) => ({
    isAuthed: state.isAuthed,
    currentUser: state.currentUser,
  }));

  useEffect(() => {
    if (isAuthed) {
      console.log("로그인되긴한거임??");
      console.log("user정보: ", currentUser);
    }
  }, [isAuthed, currentUser]);

  // 5. 로그아웃
  const logOut = () => {
    if (confirm("정말 로그아웃 하시겠습니까?")) {
      alert("로그아웃 되었습니다.");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user-storage");
      useUserStore.persist.clearStorage();

      useUserStore.setState({
        isAuthed: false,
        currentUser: null,
        accessToken: null,
      });

      window.location.replace;
      router.push("/");
    }
  };

  return (
    <Wrapper>
      <HeaderContainer>
        <Logo>
          {/* 로고 클릭시 랜딩페이지로 연결 */}
          <Link href={"/"}>
            <img src="../images/logo.png"></img>
          </Link>
        </Logo>
        <InputContainer>
          <span className="material-icons">search</span>
          {/* label과 input 연결 필오 */}
          <label htmlFor="/"></label>
          <input
            type="text"
            id="/"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          ></input>
          <BorderButton
            text="통합검색"
            $bgColor="#ffffff"
            $borderColor="#ffffff"
            $hoverColor="#ffffff"
            onClick={handleSearch}
          />
        </InputContainer>
        <Tab>
          <Link id="dash" href={"/dashboard"}>
            대시보드
          </Link>
          <div id="line"></div>
          <div ref={dropdownRef}>
            <button ref={buttonRef} onClick={toggleDropdown}>
              커뮤니티
            </button>
            <DropdownMenu $isOpen={isOpen}>
              <DropdownItem href={"/community/groups"}>
                그룹 모집 게시판
              </DropdownItem>
              <DropdownItem href={"/community/questions"}>
                질문 게시판
              </DropdownItem>
              <DropdownItem href={"/community/feedbacks"}>
                피드백 게시판
              </DropdownItem>
            </DropdownMenu>
          </div>
        </Tab>

        <User>
          {isAuthed && currentUser ? (
            <Logout>
              <UserNickName onClick={goMyPage}>
                {currentUser.nickname}
              </UserNickName>
              <BorderButton
                text={"로그아웃"}
                $bgColor="var(--bg-color)"
                $hoverColor="var(--bg-color)"
                $textColor="#ffffff"
                onClick={logOut}
              />
            </Logout>
          ) : (
            <LinkStyle>
              <BorderButton
                text="로그인"
                $bgColor="var(--bg-color)"
                $borderColor="#ffffff"
                $textColor="#ffffff"
                $hoverColor="var(--bg-color)"
                onClick={goLogin}
              />
              {/* </LinkStyle>
          <LinkStyle> */}
              <BorderButton
                text="회원가입"
                $bgColor="#ffffff"
                $borderColor="#ffffff"
                $hoverColor="#ffffff"
                onClick={goSignUp}
              />
            </LinkStyle>
          )}
        </User>
      </HeaderContainer>
    </Wrapper>
  );
};

export default Header;
