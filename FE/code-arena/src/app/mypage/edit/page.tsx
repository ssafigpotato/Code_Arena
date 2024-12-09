"use client";
import { useState, useEffect } from "react";
import styled from "styled-components";
import BorderButton from "@/components/common/button/BorderButton";
import useUserStore from "@/store/userstore";

// 정규식 모음 객체
const inputRegexs = {
  nicknameRegex: /^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]{2,10}$/,
};

const Wrapper = styled.div`
  width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
  }

  main {
    color: black;
  }
`;

const Main = styled.div`
  font-family: Pretendard;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-width: 30rem;
  font-weight: 600;
  box-sizing: border-box;
  padding: 1rem;
  margin-top: 3rem;
  margin-bottom: 3rem;

  > h1 {
    box-sizing: border-box;
    padding-left: 1rem;
    margin-bottom: 2rem;
    font-weight: bold;
    font-size: 3rem;
    color: white;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;

  > h1 {
    box-sizing: border-box;
    padding-left: 1rem;
    margin-bottom: 2rem;
    font-weight: bold;
    font-size: 3rem;
    color: white;
  }
`;

const BodyContainer = styled.div`
  display: flex;
  box-sizing: border-box;
  flex-direction: row;
  width: 100%;
  height: 100%;
  padding: 1rem;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 27%;
  padding-top: 2.5rem;
  border-right: white solid 2px;

  > div {
    display: flex;
    width: 10rem;
    height: 10rem;
    border-radius: 15px;
    background-color: var(--secondary-color);
  }
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  width: 73%;
  box-sizing: border-box;
  padding: 0.5rem;
  padding-left: 3rem;
  color: white;
  font-weight: bold;

  .submitbuttoncontainer {
    display: flex;
    justify-content: end;
    box-sizing: border-box;
    padding-right: 1rem;
    margin-top: 2rem;
  }

  .submitbuttoncontainer button {
    display: flex;
    border: none;
    width: 7rem;
    justify-content: center;
  }
`;

const FormContents = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;

  input,
  select,
  button {
    border-radius: 10px;
    border: none;
    width: 100%;
    height: 3rem;
  }

  input,
  select {
    font-size: 1.2rem;
    font-weight: bold;
    box-sizing: border-box;
    padding-left: 1rem;
  }

  select option {
    border-radius: 10px;
    border: 1px solid red;
  }

  span {
    display: flex;
    align-items: center;
    font-size: 24px;
    font-weight: 400;
  }

  .email {
    width: 50%;
  }

  .mailselect {
    width: 40%;
  }

  .inputcontainer {
    width: 80%;
    display: flex;
    justify-content: space-between;
  }

  .dayselect {
    width: 30%;
  }

  .dayselect select {
    padding-left: 5rem;
  }

  .dot {
    font-size: 3rem;
    text-align: bottom;
  }

  button {
    width: 5rem;
    height: 2.5rem;
    color: white;
    font-size: 0.8rem;
    padding: 0;
    border: 1px solid white;
    margin-left: 1.5rem;
  }

  div {
    display: flex;
    height: 4rem;
    align-items: center;
  }

  h1 {
    font-size: 27px;
    font-weight: 700;
    margin-bottom: 5px;
  }
`;

const year = new Date().getFullYear();

interface CommonFormContentsProps {
  title: string;
  type: string;
  hasButton: boolean;
  buttonText: string | null;
}

const formcontents: CommonFormContentsProps[] = [
  {
    title: "비밀번호",
    type: "password",
    hasButton: false,
    buttonText: null,
  },
  {
    title: "비밀번호 확인",
    type: "password",
    hasButton: false,
    buttonText: null,
  },
];

const CommonFormContents: React.FC<CommonFormContentsProps> = ({
  title,
  type,
  hasButton,
  buttonText,
}) => (
  <FormContents>
    <h1>| {title}</h1>
    <div>
      <div className="inputcontainer">
        <input type={type} className={title} />
      </div>
      {hasButton && (
        <BorderButton text={buttonText} $bgColor="var(--bg-color)" />
      )}
    </div>
  </FormContents>
);

const NicknameFormContents: React.FC<{
  nickname: string | undefined;
  tempNickname: string | undefined;
  isEditing: boolean;
  onEditClick: () => void;
  onCancelClick: () => void;
  onNicknameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckDuplicate: () => void;
  nicknameError: string | null;
}> = ({
  nickname,
  tempNickname,
  isEditing,
  onEditClick,
  onCancelClick,
  onNicknameChange,
  onCheckDuplicate,
  nicknameError,
}) => {
  return (
    <FormContents>
      <h1>| 별명</h1>
      <div>
        {isEditing ? (
          <>
            <div className="inputcontainer">
              <input
                type="text"
                value={tempNickname}
                onChange={onNicknameChange}
                className="별명"
              />
            </div>
            <BorderButton
              text="취소"
              $bgColor="var(--bg-color)"
              onClick={onCancelClick}
            />
            <BorderButton
              text="중복체크"
              $bgColor="var(--bg-color)"
              onClick={onCheckDuplicate}
            />
          </>
        ) : (
          <>
            <div className="inputcontainer">
              <span>{nickname}</span>
            </div>
            <BorderButton
              text="변경하기"
              $bgColor="var(--bg-color)"
              onClick={onEditClick}
              type="button"
            />
          </>
        )}
      </div>
      {nicknameError && <p>{nicknameError}</p>}
    </FormContents>
  );
};

export default function SignUp() {
  const { currentUser, deleteAccount, updateUser } = useUserStore();

  const [nickname, setNickname] = useState(currentUser?.nickname);
  const [isEditing, setIsEditing] = useState(false);
  const [tempNickname, setTempNickname] = useState(nickname);
  const [tempImage, setTempImage] = useState(currentUser?.image);
  const [nicknameError, setNicknameError] = useState<string | null>(null);

  useEffect(() => {
    setNickname(currentUser?.nickname);
    setTempNickname(currentUser?.nickname);
    setTempImage(currentUser?.image);
  }, [currentUser]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setTempNickname(nickname);
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempNickname(e.target.value);
    if (!inputRegexs.nicknameRegex.test(e.target.value)) {
      setNicknameError("· 별명은 2~10자 이내로 입력하세요.");
    } else {
      setNicknameError(null);
    }
  };

  const handleCheckDuplicate = () => {
    // 중복체크 로직 추가
    console.log("중복체크");
  };

  // 저장 버튼
  const handleSaveClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (tempNickname !== nickname || tempImage) {
      if (window.confirm("회원정보를 수정하시겠습니까?")) {
        await updateUser(tempNickname ?? "", tempImage ?? "");
        setIsEditing(false);
      }
    } else {
      alert("변경할 사항이 없습니다.");
    }
  };

  // 탈퇴버튼
  const handleWithdraw = () => {
    if (window.confirm("정말 회원탈퇴를 진행하시겠습니까?")) {
      deleteAccount();
    }
  };

  if (!currentUser) {
    return (
      <Wrapper>
        <div>사용자를 찾을 수 없습니다.</div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Main>
        <HeaderContainer>
          <h1>회원 정보 수정</h1>
          <div>
            <BorderButton
              text="회원탈퇴"
              onClick={handleWithdraw}
              $bgColor="var(--red-color)"
            />
          </div>
        </HeaderContainer>
        <BodyContainer>
          <ImageContainer>
            <div></div>
          </ImageContainer>
          <FormContainer>
            <FormContents>
              <h1>| 이메일</h1>
              <div>
                <div className="inputcontainer">
                  <span>{currentUser.email}</span>
                </div>
              </div>
            </FormContents>
            <FormContents>
              <h1>| 이름</h1>
              <div>
                <div className="inputcontainer">
                  <span>{currentUser.name}</span>
                </div>
              </div>
            </FormContents>
            {formcontents.map((formcontent, index) => (
              <CommonFormContents
                title={formcontent.title}
                type={formcontent.type}
                hasButton={formcontent.hasButton}
                buttonText={formcontent.buttonText}
                key={index}
              />
            ))}
            <NicknameFormContents
              nickname={nickname}
              tempNickname={tempNickname}
              isEditing={isEditing}
              onEditClick={handleEditClick}
              onCancelClick={handleCancelClick}
              onNicknameChange={handleNicknameChange}
              onCheckDuplicate={handleCheckDuplicate}
              nicknameError={nicknameError}
            />
            <FormContents>
              <h1>| 생년월일</h1>
              <div>
                <div className="inputcontainer">
                  <span>
                    {new Date(currentUser.birth).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </FormContents>
            <div className="submitbuttoncontainer">
              <BorderButton text="저장" onClick={handleSaveClick} />
            </div>
          </FormContainer>
        </BodyContainer>
      </Main>
    </Wrapper>
  );
}
