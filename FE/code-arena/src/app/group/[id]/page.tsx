"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { notFound } from "next/navigation";
import styled from "styled-components";
import BorderButton from "@/components/common/button/BorderButton";
import GroupMember from "@/components/carousel/GroupMember";
import ProgramLang from "@/components/programlang/ProgramLang";
import LeaderInput from "@/components/groupdetail/LeaderInput";
import useGroupStore from "@/store/groupstore";
import useUserStore from "@/store/userstore";

interface Client {
  type: string;
  buttonText: string;
  bgColor?: string;
  buttonDisabled?: boolean;
}

export default function GroupDetail() {
  const {
    fetchGroupById,
    groupDetail,
    isLoading,
    fetchGroupInvites,
    inviteList,
    deleteGroupById,
    applyToGroup,
    acceptGroupRequest,
    rejectGroupRequest,
    updateGroup,
    changeGroupLeader,
  } = useGroupStore();
  const router = useRouter();
  const params = useParams();
  const handleGoHome = () => {
    router.push("/");
  };

  const id = Array.isArray(params?.id) ? params.id[0] : params?.id; // id 값을 추출하고 배열일 경우 첫 번째 값을 사용

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [introduceText, setIntroduceText] = useState("");
  const [isLangInputOpen, setIsLangInputOpen] = useState(false);
  const [groupLang, setGroupLang] = useState<string[]>([]);
  const [totalMeetingTime, setTotalMeetingTime] = useState(0); // 누적 미팅 시간 상태 추가
  const [editing, setEditing] = useState(false); // 수정 상태를 위한 상태 추가
  const [newIntroduceText, setNewIntroduceText] = useState("");
  const [newGroupLang, setNewGroupLang] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      fetchGroupById(id);
      fetchGroupInvites(id);
    }
  }, [id, fetchGroupById, fetchGroupInvites]);

  useEffect(() => {
    if (inviteList) {
      console.log("inviteList: ", inviteList);
    }
  }, [inviteList]);

  useEffect(() => {
    if (groupDetail) {
      setIntroduceText(groupDetail.groupResponse.information);
      setGroupLang(groupDetail.groupResponse.language.split(", "));
      setNewIntroduceText(groupDetail.groupResponse.information);
      setNewGroupLang(groupDetail.groupResponse.language.split(", "));
      console.log("groupDetail: ", groupDetail);

      const totalTime = groupDetail.groupMembers
        .filter((member) => member.inviteCode === "ACCEPT")
        .reduce((acc, member) => acc + (member.meetingTime || 0), 0);
      setTotalMeetingTime(totalTime);
    }
  }, [groupDetail]);

  const handleInputOpen = () => {
    setIsInputOpen(true);
  };
  const handleInputClose = () => {
    setIsInputOpen(false);
  };

  const writeInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIntroduceText(event.target.value);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const handleLangInputOpen = () => {
    setIsLangInputOpen(true);
  };
  const handleLangInputClose = () => {
    setIsLangInputOpen(false);
  };

  const {
    searchResult: user,
    currentUser,
    isAuthed,
  } = useUserStore((state) => ({
    searchResult: state.searchResult,
    isAuthed: state.isAuthed,
    currentUser: state.currentUser,
  }));

  const [usertype, setUsertype] = useState<Client>({
    type: "",
    buttonText: "",
    bgColor: "",
    buttonDisabled: false,
  });

  useEffect(() => {
    if (currentUser) {
      if (currentUser.id === groupDetail?.groupResponse.leader.id) {
        setUsertype({
          type: "leader",
          buttonText: "그룹삭제",
          bgColor: "var(--red-color)",
          buttonDisabled: false,
        });
        console.log("리더입니다");
      } else if (
        groupDetail?.groupMembers.some(
          (member) => member.memberResponse.id === currentUser.id
        )
      ) {
        const member = groupDetail.groupMembers.find(
          (member) => member.memberResponse.id === currentUser.id
        );

        if (member?.inviteCode === "APPLY") {
          setUsertype({
            type: "waiting",
            buttonText: "가입 대기중",
            bgColor: "var(--yellow-color)",
            buttonDisabled: true,
          });
          console.log("가입대기자입니다");
        } else {
          setUsertype({
            type: "member",
            buttonText: "그룹탈퇴",
            bgColor: "var(--red-color)",
            buttonDisabled: false,
          });
          console.log("멤버입니다");
        }
      } else {
        setUsertype({
          type: "guest",
          buttonText: "가입신청",
          bgColor:
            groupDetail?.groupResponse.curNum ===
            groupDetail?.groupResponse.maxNum
              ? "var(--secondary-color)"
              : "",
          buttonDisabled:
            groupDetail?.groupResponse.curNum ===
            groupDetail?.groupResponse.maxNum,
        });
        console.log("게스트입니다");
      }
    } else {
      setUsertype({
        type: "guest",
        buttonText: "가입신청",
        bgColor:
          groupDetail?.groupResponse.curNum ===
          groupDetail?.groupResponse.maxNum
            ? "var(--secondary-color)"
            : "",
        buttonDisabled:
          groupDetail?.groupResponse.curNum ===
          groupDetail?.groupResponse.maxNum,
      });
      console.log("로그인 되지 않은 게스트입니다");
      console.log("user is null or undefined");
    }
  }, [currentUser, groupDetail]);

  // 그룹 삭제
  const handleDeleteGroup = async () => {
    if (id) {
      const confirmation = confirm("정말 그룹을 삭제하시겠습니까?");
      if (confirmation) {
        await deleteGroupById(id);
        router.push("/dashboard"); // 삭제 후 dashboard 페이지로 이동
      }
    }
  };

  // 그룹 탈퇴
  const handleLeaveGroup = async () => {
    if (id) {
      const confirmation = confirm("정말 그룹을 탈퇴하시겠습니까?");
      if (confirmation) {
        try {
          const response = await rejectGroupRequest(id, currentUser!.id);
          console.log("Reject group request response:", response);
          window.location.reload();
        } catch (error) {
          console.error("Failed to reject group request:", error);
        }
      }
    }
  };

  // 그룹 수정
  const handleUpdateGroup = async () => {
    if (id) {
      try {
        const response = await updateGroup({
          groupId: id,
          information: newIntroduceText,
          language: newGroupLang.join(", "),
        });
        console.log("Update group response:", response);
        setIntroduceText(newIntroduceText);
        setGroupLang(newGroupLang);
        setEditing(false);
        setIsLangInputOpen(false);
      } catch (error) {
        console.error("Failed to update group:", error);
      }
    }
  };

  // 가입신청
  const handleApplyGroup = async () => {
    if (id) {
      if (currentUser) {
        // 로그인 된 사용자만 가입신청 가능
        const confirmation = confirm("가입신청 하시겠습니까?");
        if (confirmation) {
          try {
            const response = await applyToGroup(id, currentUser.id);
            console.log("Apply to group response:", response); // 응답 데이터 콘솔 출력
            window.location.reload();
          } catch (error) {
            console.error("Failed to apply to group:", error); // 에러 처리
          }
        }
      } else {
        alert("로그인이 필요합니다");
      }
    }
  };

  // 버튼 컨트롤
  const handleButtonClick = () => {
    if (usertype.buttonText === "그룹삭제") {
      handleDeleteGroup();
    } else if (usertype.buttonText === "그룹탈퇴") {
      handleLeaveGroup();
    } else if (usertype.buttonText === "가입신청") {
      handleApplyGroup();
    }
  };

  // 가입 수락 버튼
  const handleAccept = async (memberId: string, memberNickname: string) => {
    if (id) {
      const confirmation = confirm(
        `${memberNickname} 유저를 가입 수락하시겠습니까?`
      );
      if (confirmation) {
        try {
          const response = await acceptGroupRequest(id, memberId);
          console.log("Accept group request response:", response);
          window.location.reload();
        } catch (error) {
          console.error("Failed to accept group request:", error);
        }
      }
    }
  };

  // 가입 거절 버튼
  const handleWithdraw = async (memberId: string, memberNickname: string) => {
    if (id) {
      const confirmation = confirm(
        `${memberNickname} 유저를 가입 거절하시겠습니까?`
      );
      if (confirmation) {
        try {
          const response = await rejectGroupRequest(id, memberId);
          console.log("Reject group request response:", response);
          window.location.reload();
        } catch (error) {
          console.error("Failed to reject group request:", error);
        }
      }
    }
  };

  // 강퇴 버튼 (props)
  const handleForceWithdraw = async (
    memberId: string,
    memberNickname: string
  ) => {
    if (id) {
      const confirmation = confirm(
        `${memberNickname} 유저를 강퇴하시겠습니까?`
      );
      if (confirmation) {
        try {
          const response = await rejectGroupRequest(id, memberId);
          console.log("Reject group request response:", response);
          window.location.reload();
        } catch (error) {
          console.error("Failed to reject group request:", error);
        }
      }
    }
  };

  // 그룹장 위임
  const [newLeaderId, setNewLeaderId] = useState<string>("");
  const handleLeaderChange = async () => {
    console.log(newLeaderId);
    if (id && newLeaderId) {
      const confirmation = confirm(
        `${
          groupDetail?.groupMembers.find(
            (member) => member.memberResponse.id === newLeaderId
          )?.memberResponse.nickname
        } 유저에게 그룹장을 위임하시겠습니까?`
      );
      if (confirmation) {
        try {
          await changeGroupLeader(id, newLeaderId);
          handleModalClose();
          window.location.reload();
        } catch (error) {
          console.error("Failed to change group leader:", error);
        }
      }
    }
  };

  // 로딩 시 컴포넌트 주석처리
  if (isLoading) {
    return <Wrapper>Loading...</Wrapper>;
  }

  // 존재하지 않는 그룹일 경우 에러처리
  if (!isLoading && !groupDetail) {
    return (
      <ErrorWrapper>
        <h1>404 - Page Not Found</h1>
        <h1>존재하지 않는 페이지입니다.</h1>
        <BorderButton
          text="홈으로"
          onClick={handleGoHome}
          $bgColor="#ffffff"
          $hoverColor="var(--primary-color)"
          $borderColor="#ffffff"
        />
      </ErrorWrapper>
    );
  }

  return (
    <Wrapper>
      {/* <h1>그룹 정보</h1> */}

      <Main>
        <TitleContainer>
          <h1>{groupDetail!.groupResponse.groupName}</h1>
          <BorderButton
            text={usertype.buttonText}
            $bgColor={usertype.bgColor}
            $disabled={usertype.buttonDisabled}
            onClick={handleButtonClick}
          ></BorderButton>
        </TitleContainer>
        <ContentContainer>
          <div className="introducecontainer">
            <h1>| 소개글</h1>
            {usertype.type == "leader" && !editing ? (
              <button onClick={() => setEditing(true)}>
                <span className="material-icons">edit</span>
              </button>
            ) : (
              []
            )}
          </div>
          {editing ? (
            <form className="introduceform">
              <textarea
                placeholder={"그룹 소개를 입력하세요."}
                value={newIntroduceText}
                onChange={(e) => setNewIntroduceText(e.target.value)}
              />
              <div className="inputsubmitbtn">
                <BorderButton
                  text="취소"
                  $bgColor="white"
                  onClick={() => {
                    setEditing(false);
                    setNewIntroduceText(introduceText);
                    setNewGroupLang(groupLang);
                  }}
                ></BorderButton>
                <BorderButton
                  text="수정"
                  $bgColor="white"
                  onClick={handleUpdateGroup}
                ></BorderButton>
              </div>
            </form>
          ) : (
            <div className="content">
              <p>{introduceText}</p>
            </div>
          )}
        </ContentContainer>
        <ContentContainer>
          <h1>| 그룹 정보</h1>
          <div className="content">
            <div className="groupinfo">
              <div className="groupinfoitem">
                <span className="th">그룹장</span>
                <span className="td">
                  {groupDetail!.groupResponse.leader.nickname}
                </span>
                {/* 위임 버튼은 리더에게만 보이고, 인원이 2명 이상일 때만 보임 */}
                {usertype.type == "leader" &&
                groupDetail!.groupResponse.curNum > 1 ? (
                  <BorderButton
                    text="위임"
                    $bgColor="white"
                    $hoverColor="var(--light-color)"
                    onClick={handleModalOpen}
                  ></BorderButton>
                ) : (
                  []
                )}
              </div>
              <div className="groupinfoitem">
                <span className="th">인원</span>
                <span className="td">
                  {groupDetail!.groupResponse.curNum} /{" "}
                  {groupDetail!.groupResponse.maxNum}
                </span>
              </div>
              <div className="groupinfoitem">
                <span className="th">생성 날짜</span>
                <span className="td">
                  {new Date(
                    groupDetail!.groupResponse.createdAt
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </ContentContainer>
        <ContentContainer>
          <h1>| 그룹 멤버</h1>
          <div className="content" id="groupmember">
            {/* inviteCode가 ACCEPT인 멤버만 렌더링 */}
            <GroupMember
              memberList={groupDetail!.groupMembers
                .filter((gm) => gm.inviteCode === "ACCEPT")
                .map((gm) => ({
                  ...gm.memberResponse,
                  type: gm.type,
                }))}
              userType={usertype.type}
              handleForceWithdraw={handleForceWithdraw}
            />
          </div>
        </ContentContainer>
        {usertype.type == "leader" ? (
          <ContentContainer>
            <h1>| 가입 신청</h1>
            <div className="tablecontainer">
              <table>
                <thead>
                  <tr>
                    <th>별명</th>
                    <th>거절</th>
                    <th>수락</th>
                  </tr>
                </thead>
                <tbody>
                  {inviteList
                    .filter((invite) => invite.inviteCode === "APPLY") // APPLY 상태인 사람들만 필터링
                    .map((invite, index) => (
                      <tr key={index}>
                        <td>{invite.memberNickname}</td>
                        <td>
                          <BorderButton
                            text="거절"
                            $bgColor="var(--red-color)"
                            onClick={() =>
                              handleWithdraw(
                                invite.memberId,
                                invite.memberNickname
                              )
                            }
                          ></BorderButton>
                        </td>
                        <td>
                          <BorderButton
                            text="수락"
                            $bgColor="var(--yellow-color)"
                            onClick={() =>
                              handleAccept(
                                invite.memberId,
                                invite.memberNickname
                              )
                            }
                          ></BorderButton>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </ContentContainer>
        ) : (
          []
        )}
        <SplitContentContainer>
          <ContentContainer>
            <div className="langcontainer">
              <h1>| 사용 언어 </h1>
              {usertype.type == "leader" && !isLangInputOpen ? (
                <button onClick={handleLangInputOpen} className="editbtn">
                  <span className="material-icons">edit</span>
                </button>
              ) : (
                <>
                  {usertype.type == "leader" && isLangInputOpen ? (
                    <div className="borderbtncontainer">
                      <BorderButton
                        text="취소"
                        $bgColor="white"
                        onClick={handleLangInputClose}
                      ></BorderButton>
                      <BorderButton
                        text="수정"
                        $bgColor="white"
                        onClick={handleUpdateGroup}
                      ></BorderButton>
                    </div>
                  ) : (
                    []
                  )}
                </>
              )}
            </div>
            <div className="programlangcontainer">
              {isLangInputOpen ? (
                <form className="langform">
                  <label>
                    <input
                      type="checkbox"
                      name="language"
                      value="java"
                      checked={newGroupLang.includes("java")}
                      onChange={(e) =>
                        setNewGroupLang((prev) =>
                          e.target.checked
                            ? [...prev, e.target.value]
                            : prev.filter((lang) => lang !== e.target.value)
                        )
                      }
                    />
                    <ProgramLang imgName="java" text="JAVA" />
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="language"
                      value="Python"
                      checked={newGroupLang.includes("Python")}
                      onChange={(e) =>
                        setNewGroupLang((prev) =>
                          e.target.checked
                            ? [...prev, e.target.value]
                            : prev.filter((lang) => lang !== e.target.value)
                        )
                      }
                    />
                    <ProgramLang imgName="Python" text="PYTHON" />
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="language"
                      value="cpp"
                      checked={newGroupLang.includes("cpp")}
                      onChange={(e) =>
                        setNewGroupLang((prev) =>
                          e.target.checked
                            ? [...prev, e.target.value]
                            : prev.filter((lang) => lang !== e.target.value)
                        )
                      }
                    />
                    <ProgramLang imgName="cpp" text="C++" />
                  </label>
                </form>
              ) : (
                <>
                  {groupLang.map((lang, index) => (
                    <ProgramLang key={index} imgName={lang}></ProgramLang>
                  ))}
                </>
              )}
            </div>
          </ContentContainer>

          <ContentContainer>
            <h1>| 누적 미팅 시간</h1>
            <div className="timeContainer">
              <span> {totalMeetingTime} 시간</span>
            </div>
          </ContentContainer>
        </SplitContentContainer>
      </Main>

      {isModalOpen && (
        <ModalOverlay onClick={handleModalClose}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <form>
              <ModalHeader>
                <h2>그룹장 위임하기</h2>
                <CloseButton onClick={handleModalClose}>&times;</CloseButton>
              </ModalHeader>
              <ModalBody>
                <FormContent>
                  <LeaderInput
                    memberList={groupDetail!.groupMembers
                      .filter((gm) => gm.inviteCode === "ACCEPT")
                      .map((gm) => ({
                        ...gm.memberResponse,
                        type: gm.type,
                      }))}
                    setNewLeaderId={setNewLeaderId}
                  />
                </FormContent>

                <ButtonContainer>
                  <BorderButton
                    text="취소"
                    $bgColor="var(--red-color)"
                    onClick={handleModalClose}
                  />
                  <BorderButton text="위임" onClick={handleLeaderChange} />
                </ButtonContainer>
              </ModalBody>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 1200px;
  min-height: 80vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  > h1 {
    display: flex;
    width: 95%;
    margin: 3rem 0 0 0;
    color: white;
    min-width: 40rem;
    margin-bottom: 0.2rem;
    font-weight: bold;
    font-size: 3rem;
    box-sizing: border-box;
    padding-left: 1rem;
    margin-bottom: 2rem;
  }
  @media (max-width: 768px) {
  }

  * {
    // border: 1px solid lime;
  }
`;

const Main = styled.div`
  // main전체 속성
  width: 95%;
  display: flex;
  flex-direction: column;
  margin: 3rem auto;
  border-radius: 8px;
  // 추후 수정 가능
  min-width: 40rem;
  //
  background-color: white;
  box-sizing: border-box;
  padding: 2.5rem;
  min-height: 80vh;
  font-weight: 600;
`;

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  h1 {
    font-size: 3rem;
  }
  button {
    padding: 0;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    font-size: 1rem;
    height: 2rem;
    padding: 1rem;
    border: 2px solid black;
    margin-right: 1.5rem;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 1rem 0 4rem 1rem;
  box-sizing: border-box;
  h1 {
    font-size: 1.8rem;
    font-weight: bold;
  }
  p {
    display: flex;
    padding-right: 20px;
    white-space: pre-wrap;
    line-height: 1.4rem;
    font-size: 1rem;
  }
  .introducecontainer {
    display: flex;
    button {
      border: none;
      background-color: transparent;
      display: flex;
      align-items: center;
      span {
        font-weight: bold;
        font-size: 1.5rem;
      }
    }
    button :hover {
      color: gray;
    }
  }
  .langcontainer {
    display: flex;
    button {
      margin: 0;
    }
    .editbtn {
      border: none;
      background-color: transparent;
      display: flex;
      align-items: center;
      span {
        font-weight: bold;
        font-size: 1.5rem;
      }
    }
    .borderbtncontainer {
      display: flex;
      padding: 0 0 0 1rem;
      gap: 10px;
      button {
        width: 3.5rem;
        height: 2rem;
        padding: 0;
        margin: auto;
      }
    }
  }
  .content {
    // display: flex;
    box-sizing: border-box;
    padding: 0 3rem 0 3rem;
    margin-top: 1rem;
    * {
      // border: 1px solid lime;
    }
  }

  .groupinfo {
    display: flex;
    flex-direction: column;
    width: 20rem;
  }
  .groupinfoitem {
    display: flex;
    margin: 0.3rem 0 0.3rem 0;
    span {
      align-items: center;
      display: flex;
    }
    button {
      width: 3rem;
      height: 1.5rem;
      padding: 0;
      margin-left: 1rem;
      font-size: 1rem;
    }
  }
  .th {
    font-weight: 800;
    width: 10rem;
  }
  .programlangcontainer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    .langform {
      display: flex;
      width: 100%;
      justify-content: center;
      label {
        display: flex;
        align-items: center;
        width: 100%;
        input {
          width: 1rem;
          height: 1rem;
        }
      }
    }
  }

  .timeContainer {
    display: flex;
    width: 100%;
    height: 100%;

    justify-content: center;
    align-items: center;
    span {
      font-weight: bold;
      font-size: 3rem;
      box-sizing: border-box;
      padding-right: 40%;
    }
  }
  .tablecontainer {
    box-sizing: border-box;
    display: flex;
    padding: 0 3rem 0 3rem;
    margin-top: 20px;
    justify-content: center;
    table {
      width: 80%;
      tbody tr {
        border-bottom: 1px solid black;
        height: 2rem;
      }
      td {
        text-align: center;
        vertical-align: middle;
      }
      td button {
        width: 3rem;
        height: 1.5rem;
        padding: 0;
        margin: 0;
      }
      tr th:nth-child(1) {
        width: 50%;
      }
      trth: nth-child(2) {
        width: 15%;
      }
      tr th:nth-child(3) {
        width: 15%;
      }

      thead {
        border-bottom: 2px solid black;
        th {
          padding-bottom: 10px;
        }
      }
    }
  }
  .introduceform {
    display: flex;
    align-items: center;
    margin-top: 2rem;
    flex-direction: column;
    textarea {
      font-family: Pretendard;
      display: flex;
      width: 90%;
      font-size: 1.5rem;
      height: 10rem;
      border-radius: 15px;
      background-color: var(--light-color);
      resize: none;
    }
    textarea::-webkit-scrollbar {
      width: 2rem;
      border-radius: 15px;
    }

    textarea::-webkit-scrollbar-track {
      border-radius: 15px;
      background-color: transparent;
    }

    textarea::-webkit-scrollbar-thumb {
      background-color: var(--bg-color);
      border: 0.75rem solid transparent;
      border-radius: 15px;
      background-clip: padding-box;
    }
    .inputsubmitbtn {
      gap: 10px;
      display: flex;
      width: 90%;
      justify-content: end;
      margin-top: 1rem;
    }
  }
`;

const SplitContentContainer = styled.div`
  display: flex;
  flex-basis: 50%;
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
  margin-bottom: 4rem;
  align-items: center;
  justify-content: space-around;
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 20px;
`;

const CloseButton = styled.button`
  background: none;
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

const ErrorWrapper = styled.div`
  width: 1200px;
  min-height: 75vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: Pretendard;
  font-size: 40px;
  font-weight: 700;
  color: #ffffff;
  gap: 30px;
`;
