import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styled from "styled-components";
import Link from "next/link";
import SearchBar from "../common/input/SearchBar";
import RoundButton from "../common/button/RoundButton";
import Checkbox from "../common/input/Checkbox";
import BorderButton from "../common/button/BorderButton";
import GroupInput from "./GroupInput";
import useGroupStore from "@/store/groupstore";
import useUserStore from "@/store/userstore";

// 그룹 데이터 타입 정의
interface Group {
  groupId: string;
  groupName: string;
  language: string;
  maxNum: number;
  curNum: number;
  groupType: "PUBLIC" | "PRIVATE";
  leader: {
    id: string;
    email: string;
    name: string;
    nickname: string;
    birth: string;
    role: string;
    image: string;
  };
}

const GroupList: React.FC = () => {
  const { groups, fetchAllGroups, createGroup, isLoading } = useGroupStore();
  const { currentUser } = useUserStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showAvailableGroups, setShowAvailableGroups] = useState(false);
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const groupsPerPage = 6;

  // 검색어 변경 핸들러
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  };

  // 필터링 변경 핸들러
  const handleAvailableGroupsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShowAvailableGroups(event.target.checked);
  };

  const searchParams = useSearchParams();
  useEffect(() => {
    const keyword = searchParams ? searchParams.get("keyword") : "";
    const type = searchParams ? searchParams.get("type") : "";
    if (type === "groups") {
      setSearchKeyword(keyword || "");
    }
  }, [searchParams]);

  useEffect(() => {
    fetchAllGroups();
    console.log(groups);
  }, [fetchAllGroups]);

  useEffect(() => {
    let filtered = groups;

    // 검색어 필터링
    if (searchKeyword) {
      filtered = filtered.filter((group) =>
        group.groupName.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    // 모집중인 그룹 필터링
    if (showAvailableGroups) {
      filtered = filtered.filter((group) => group.curNum < group.maxNum);
    }

    setFilteredGroups(filtered);
  }, [groups, searchKeyword, showAvailableGroups]);

  // 현재 페이지에 표시할 그룹 목록을 계산
  const indexOfLastGroup = currentPage * groupsPerPage;
  const indexOfFirstGroup = indexOfLastGroup - groupsPerPage;
  const currentGroups = filteredGroups.slice(
    indexOfFirstGroup,
    indexOfLastGroup
  );

  // 페이지 변경 함수
  const nextPage = () =>
    setCurrentPage((prev) =>
      Math.min(prev + 1, Math.ceil(filteredGroups.length / groupsPerPage))
    );
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // 그룹 생성하기 모달 관련
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModalOpen = () => {
    if (currentUser) {
      setIsModalOpen(true); // 로그인 된 유저만 모달 오픈
    } else {
      alert("로그인이 필요합니다");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // 그룹 개설
  const [maxNum, setMaxNum] = useState<number>(1);
  const [groupName, setGroupName] = useState<string>("");
  const [groupType, setGroupType] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
  const [information, setInformation] = useState<string>("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [leaderId, setLeaderId] = useState<string>("");

  const handleCreateGroup = async () => {
    if (currentUser) {
      setLeaderId(currentUser.id);
      const languageString = selectedLanguages.join(", ");
      await createGroup({
        groupName,
        groupType,
        maxNum,
        information,
        language: languageString,
        leaderId,
      });
      handleModalClose();
    } else {
      alert("로그인이 필요합니다");
    }
    console.log(localStorage.getItem("access"));
  };

  return (
    <>
      <GroupTitle>그룹 목록</GroupTitle>
      <RoomBar>
        <SearchBox>
          <SearchBar value={searchKeyword} onChange={handleSearchChange} />
          <Checkbox
            text="모집중인 그룹"
            onChange={handleAvailableGroupsChange}
          />
        </SearchBox>
        <RoundButton text="그룹 생성하기" onClick={handleModalOpen} />
      </RoomBar>
      <GroupContainer>
        {currentGroups.map((group, index) => (
          <StyledLink href={`/group/${group.groupId}`} passHref key={index}>
            <GroupCard key={index}>
              <GroupHeader>
                <GroupTitleText>{group.groupName}</GroupTitleText>
                {/* <span className="material-icons">
                  {group.groupType === "PUBLIC" ? "lock_open" : "lock"}
                </span> */}
              </GroupHeader>
              <GroupDetails>
                <DetailsDivider>
                  <img
                    src={group.leader.image || "/default-profile.jpeg"}
                    alt={group.leader.nickname}
                    width="40"
                    height="40"
                    style={{ borderRadius: "15px" }}
                  />
                  {group.leader.nickname}
                </DetailsDivider>
                <DetailsDivider>
                  <div>{group.language}</div>
                  <div>
                    {group.curNum}/{group.maxNum}
                  </div>
                </DetailsDivider>
              </GroupDetails>
            </GroupCard>
          </StyledLink>
        ))}
      </GroupContainer>
      <Pagination>
        <PageIndicator>
          {indexOfFirstGroup + 1} -{" "}
          {Math.min(indexOfLastGroup, filteredGroups.length)}
        </PageIndicator>
        <PageButton onClick={prevPage} disabled={currentPage === 1}>
          &lt;
        </PageButton>
        <PageButton
          onClick={nextPage}
          disabled={
            filteredGroups.length === 0 ||
            currentPage === Math.ceil(filteredGroups.length / groupsPerPage)
          }
        >
          &gt;
        </PageButton>
      </Pagination>
      {isModalOpen && (
        <ModalOverlay onClick={handleModalClose}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <form>
              <ModalHeader>
                <h2>그룹 생성하기</h2>
                <CloseButton onClick={handleModalClose}>&times;</CloseButton>
              </ModalHeader>
              <ModalBody>
                <FormContent>
                  <FormLabel>그룹명</FormLabel>
                  <ModalInput
                    type="text"
                    name="groupName"
                    placeholder="그룹 이름을 입력해주세요."
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                </FormContent>
                <SmallText>
                  * 그룹명은 그룹을 개설한 이후 변경이 불가능합니다.
                </SmallText>
                {/* <FormContent>
                  <FormLabel>공개 여부</FormLabel>
                  <fieldset>
                    <RadioLabel>
                      <RadioInput
                        type="radio"
                        name="groupType"
                        value="PUBLIC"
                        checked={groupType === "PUBLIC"}
                        onChange={() => setGroupType("PUBLIC")}
                      />
                      공개 그룹
                    </RadioLabel>
                    <RadioLabel>
                      <RadioInput
                        type="radio"
                        name="groupType"
                        value="PRIVATE"
                        checked={groupType === "PRIVATE"}
                        onChange={() => setGroupType("PRIVATE")}
                      />
                      비공개 그룹
                    </RadioLabel>
                  </fieldset>
                </FormContent>
                <SmallText>
                  * 공개 여부는 그룹을 개설한 이후 변경이 불가능합니다.
                </SmallText> */}
                <FormContent>
                  <FormLabel>그룹 소개</FormLabel>
                  <ModalInput2
                    name="information"
                    placeholder="그룹 소개를 입력해주세요."
                    value={information}
                    onChange={(e) => setInformation(e.target.value)}
                  />
                </FormContent>
                <FormContent>
                  <FormLabel>사용 언어</FormLabel>
                  <fieldset>
                    <RadioLabel>
                      <RadioInput
                        type="checkbox"
                        name="language"
                        value="Java"
                        checked={selectedLanguages.includes("Java")}
                        onChange={(e) =>
                          setSelectedLanguages((prev) =>
                            e.target.checked
                              ? [...prev, "Java"]
                              : prev.filter((lang) => lang !== "Java")
                          )
                        }
                      />
                      Java
                    </RadioLabel>
                    <RadioLabel>
                      <RadioInput
                        type="checkbox"
                        name="language"
                        value="Python"
                        checked={selectedLanguages.includes("Python")}
                        onChange={(e) =>
                          setSelectedLanguages((prev) =>
                            e.target.checked
                              ? [...prev, "Python"]
                              : prev.filter((lang) => lang !== "Python")
                          )
                        }
                      />
                      Python
                    </RadioLabel>
                    <RadioLabel>
                      <RadioInput
                        type="checkbox"
                        name="language"
                        value="C++"
                        checked={selectedLanguages.includes("C++")}
                        onChange={(e) =>
                          setSelectedLanguages((prev) =>
                            e.target.checked
                              ? [...prev, "C++"]
                              : prev.filter((lang) => lang !== "C++")
                          )
                        }
                      />
                      C++
                    </RadioLabel>
                  </fieldset>
                </FormContent>

                <GroupInput maxNum={maxNum} onChange={setMaxNum} />
                <SmallText>
                  * 그룹 정원은 그룹을 개설한 이후 변경이 불가능합니다.
                </SmallText>

                <ButtonContainer>
                  <BorderButton
                    text="취소"
                    $bgColor="var(--red-color)"
                    onClick={handleModalClose}
                  />
                  <BorderButton text="개설" onClick={handleCreateGroup} />
                </ButtonContainer>
              </ModalBody>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

const GroupTitle = styled.div`
  font-size: 24px;
  font-weight: 700;
  padding: 20px 0px;
  margin-top: 38px;
  color: white;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
  width: calc(33.333% - 20px);
`;

const RoomBar = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SearchBox = styled.div`
  display: flex;
  gap: 10px;
`;

const GroupContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 20px;
  margin-top: 20px;
`;

const GroupCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-sizing: border-box;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  cursor: pointer;

  &:hover {
    background-color: var(--light-color);
  }
`;

const GroupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 0 10px 0;
  font-size: 20px;
  font-weight: 500;
`;

const GroupTitleText = styled.p`
  flex: 1;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const GroupDetails = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  margin-top: 20px;
`;

const DetailsDivider = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 10px 0;
`;

const PageButton = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  color: white;
  padding: 10px 20px;
  margin: 0 5px;
  cursor: pointer;
  outline: none;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const PageIndicator = styled.div`
  color: white;
  padding: 0 10px;
  font-size: 16px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background-color: var(--bg-color);
  padding: 25px 50px;
  border-radius: 8px;
  width: 950px;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  color: white;
  justify-content: space-between;
  align-items: center;
`;

const ModalBody = styled.div`
  padding: 10px 0;
`;

const FormContent = styled.div`
  display: flex;
  margin-top: 40px;
  margin-bottom: 10px;
  align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 20px;
`;

const FormLabel = styled.div`
  color: white;
  width: 150px;
  font-size: 24px;
  font-weight: 700;
`;

const SmallText = styled.div`
  color: #d4d4d4;
  font-size: 16px;
  margin-left: 155px;
`;

const RadioLabel = styled.label`
  color: white;
  font-size: 20px;
  font-weight: 500;
  padding-right: 40px;
`;

const RadioInput = styled.input`
  margin-right: 10px;
`;

const ModalInput = styled.input<{ width?: string }>`
  font-family: Pretendard;
  padding: 12px;
  font-size: 16px;
  width: ${(props) => props.width || "736px"};
  border-radius: 20px;
  border: 1px solid white;
  background-color: #202e41;
  color: white;
`;

const ModalInput2 = styled.textarea<{ width?: string }>`
  font-family: Pretendard;
  padding: 12px;
  font-size: 16px;
  width: ${(props) => props.width || "736px"};
  height: 80px;
  border-radius: 20px;
  border: 1px solid white;
  background-color: #202e41;
  color: white;
  resize: none; /* 사용자가 크기를 조정하지 못하게 설정 */
  overflow: auto;

  ::placeholder {
    text-align: start;
  }
  /* 웹킷 기반 브라우저 스크롤바 커스터마이징 */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #202e41;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  /* 파이어폭스 스크롤바 커스터마이징 */
  scrollbar-width: thin;
  scrollbar-color: #888 #202e41;
`;

const ModalText = styled.div`
  color: white;
  font-size: 20px;
  font-weight: 500;
  margin-left: 10px;
`;

const CloseButton = styled.button`
  background: none;
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

export default GroupList;
