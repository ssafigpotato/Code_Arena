import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import BorderButton from "@/components/common/button/BorderButton";
import { usePathname } from "next/navigation";
import ItemsCarousel from "react-items-carousel";
import ProgramLang from "../programlang/ProgramLang";
import ProgramLangImg from "../programlang/ProgramLangImg/ProgramLangImg";
import { useRouter } from "next/navigation";
import useUserStore from "@/store/userstore";
import useGroupStore from "@/store/groupstore";

const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  height: 24rem;
  width: 30rem;
  background-color: #ffffff;
  border-radius: 1rem;
  margin: 0.9rem 0 0 0;
  font-family: "Pretendard";
  font-size: 1.5rem;
  font-weight: 700;

  * {
    // border: 1px solid orange;
  }
`;

const Infos = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-template-rows: 3fr 1fr 1fr;
  margin: 0.6rem;
  // padding: 1rem;
  font-size: 1rem;

  div {
    padding: 0.3rem;
    display: flex;
    justify-content: center;
  }

  .textinfo {
    font-weight: 500;
    span {
      color: var(--red-color);
    }
  }
`;
const Name = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  p:nth-child(1) {
    font-size: 1.2rem;
    margin: 0.2rem;
  }
  p:nth-child(2) {
    font-weight: 400;
    margin: 0.2rem;
  }

  button {
    margin: 0.2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 7.3rem;
    height: 1.8rem;
    padding: 0;
    border-radius: 1rem;
  }
`;

const ImageContainer = styled.div`
  div {
    width: 4.6rem;
    height: 4.6rem;
    border-radius: 0.5rem;
    background-color: var(--light-color);
  }
`;

const Groups = styled.div`
  // display: flex;
  // justify-content: center;
  margin-top: 1rem;
`;

const GroupsContainer = styled.div`
  overflow: hidden; /* Carousel의 overflow 처리 */
  height: 8rem; /* Carousel의 높이 조정 */

  padding: 0 4.3rem; /* Carousel의 패딩 조정 */
  button {
    border: none;
    background-color: #ffffff;
    display: flex;
    justify-content: center;
  }
`;

const GroupItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 3fr 1fr;
  grid-template-rows: 1fr 2fr;
  grid-template-areas:
    "area1 area1 area1 area1 area2"
    "area3 area4 area5 area6 area7";
  width: 18rem;
  height: 7rem;
  border: 2px solid #000000;
  border-radius: 0.8rem;
  cursor: pointer;

  div {
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .area1 {
    display: flex;
    justify-content: start;
    padding: 0 0.5rem;
    grid-area: area1;
    font-size: 1.2rem;
    // 텍스트가 한 줄로 표시되도록 설정
    white-space: nowrap;
    // 넘치는 부분을 숨기도록 설정
    overflow: hidden;
    // 넘치는 부분에 ...을 표시하도록 설정
    text-overflow: ellipsis;
  }
  .area2 {
    grid-area: area2;
  }
  .area3 {
    grid-area: area3;
    padding: 0 0.5rem;
  }
  .area4 {
    grid-area: area4;
    font-size: 0.9rem;
    // 텍스트가 한 줄로 표시되도록 설정
    white-space: nowrap;
    // 넘치는 부분을 숨기도록 설정
    overflow: hidden;
    // 넘치는 부분에 ...을 표시하도록 설정
    text-overflow: ellipsis;
  }
  .area5 {
    grid-area: area5;
    color: green;
  }
  .area6 {
    grid-area: area6;
    font-size: 0.9rem;
    div {
      img {
        height: 1.5rem;
        widht: 1.5rem;
      }
      span {
        font-size: 1.2rem;
      }
    }
  }
  .area7 {
    grid-area: area7;
    padding: 0 0.5rem;
    font-size: 0.9rem;
  }
`;

const MyInfos = () => {
  const router = useRouter();
  // const pathname = usePathname();
  // const nickname = pathname?.substring(1);
  // const user = dummyData.find((user) => user.nickname === nickname);
  // const userGroups =
  //   user?.groups.map((groupTitle) =>
  //     dummyGroups.find((group) => group.title === groupTitle)
  //   ) || [];

  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
  // 그룹 상세페이지로 이동
  const goGroupDetail = (groupId: string) => {
    router.push(`/group/${groupId}`);
  };

  // 아래부터 연결 시작
  const { currentUser } = useUserStore();
  const { mygroup, myGroups, isLoading } = useGroupStore(); // 스토어에서 상태 및 함수 가져오기

  useEffect(() => {
    mygroup(); // 그룹 데이터를 가져옴
  }, []);

  // 회원 정보 수정 클릭시 해당 페이지로
  const goUserInfoModify = () => {
    router.push("/mypage/edit");
  };
  if (!currentUser) {
    return (
      <Wrapper>
        <div>사용자를 찾을 수 없습니다.</div>
      </Wrapper>
    );
  }

  return (
    <>
      <Wrapper>
        <div>| 내 정보</div>
        <Infos>
          <ImageContainer>
            <div>이미지</div>
          </ImageContainer>
          <Name>
            <p>{currentUser?.name}</p>
            <p>{currentUser?.nickname}</p>
            <BorderButton
              text={"회원정보수정"}
              $bgColor="var(--yellow-color)"
              // onClick={}
              $hoverColor="var(--yellow-color)"
              $borderColor="var(--yellow-color)"
              onClick={goUserInfoModify}
            />
          </Name>
          <div>이메일</div>
          <div className="textinfo">{currentUser?.email}</div>
          <div>내그룹</div>
          <div className="textinfo">
            <span>{myGroups.length}</span> 개
          </div>
        </Infos>
        <Groups>
          <GroupsContainer>
            <ItemsCarousel
              numberOfCards={1} // 한 번에 보이는 카드의 수
              gutter={40} // 카드 사이의 간격
              activeItemIndex={activeItemIndex}
              requestToChangeActive={(index: number) =>
                setActiveItemIndex(index)
              }
              leftChevron={
                <button>
                  <span className="material-icons">arrow_back_ios</span>
                </button>
              }
              rightChevron={
                <button>
                  <span className="material-icons">arrow_forward_ios</span>
                </button>
              }
              infiniteLoop
              chevronWidth={40}
              outsideChevron
            >
              {myGroups.map((group, index) => (
                <GroupItem
                  key={index}
                  onClick={() => goGroupDetail(group.groupResponse.groupId)}
                >
                  <div className="area1">
                    {group?.groupResponse.groupName || "No Title"}
                  </div>
                  <div className="area2">
                    {/* <span className="material-icons">
                      {group?.isPublic ? "lock_open" : "lock"}
                      {group?.groupResponse.groupType === "PUBLIC"
                        ? "lock_open"
                        : "lock"}
                    </span> */}
                  </div>
                  <div className="area3">
                    <img
                      src={
                        group?.groupResponse.leader.image ||
                        "/default-profile.jpeg"
                      }
                      alt={group?.groupResponse.leader.name}
                      width="40"
                      height="40"
                      style={{ borderRadius: "15px" }}
                    />
                  </div>
                  <div className="area4">
                    {group?.groupResponse.leader.name}
                  </div>
                  <div className="area5">
                    <span className="material-icons">check_circle</span>
                  </div>
                  <div className="area6">
                    {/* 실제 데이터 연결 후 수정 필요  */}
                    {/* <ProgramLangImg name="{group?.language}"></ProgramLangImg>
                    {group?.language} */}
                    <ProgramLang
                      imgName={group?.groupResponse.language}
                      text={group?.groupResponse.language}
                    ></ProgramLang>
                  </div>
                  <div className="area7">
                    {group?.groupResponse.curNum}/{group?.groupResponse.maxNum}
                  </div>
                </GroupItem>
              ))}
            </ItemsCarousel>
          </GroupsContainer>
        </Groups>
      </Wrapper>
    </>
  );
};

export default MyInfos;
