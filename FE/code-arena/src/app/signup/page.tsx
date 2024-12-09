"use client";
import { useEffect } from "react";
import { styled } from "styled-components";
import BorderButton from "@/components/common/button/BorderButton";
import api from "@/utils/api";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";

const possibleMailList = ["gmail.com", "naver.com", "daum.net", "hanmail.net"];
const year = new Date().getFullYear();
const years = Array.from(new Array(100), (val, index) => year - index);
const days = Array.from(new Array(31), (val, index) => 31 - index);
const months = Array.from(new Array(12), (val, index) => 12 - index);

// 정규식 모음 객체
const inputRegexs = {
  // 이메일 : @ 전 부분, 문자로 시작하여, 영문자, 숫자, 하이픈(-), 언더바(_)를 사용하여 3~20자 이내
  emailRegex: /^[a-zA-Z][a-zA-Z0-9_-]{2,19}$/,
  // 비밀번호 : 최소 8자 이상, 최소한 하나의 대문자, 하나의 소문자, 하나의 숫자, 하나의 특수문자를 포함, 공백 허용하지 않음
  pwRegex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/,
  // 별명 : 영어 대/소문자, 숫자, 한글 자모음 조합, 2~10자 이내
  nicknameRegex: /^[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]{2,10}$/,
  // 이름 : 한글 2~5자 이내
  nameRegex: /^[가-힣]{2,5}$/,
};

interface Inputs {
  emailName: string;
  emailSite: string;
  name: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  image: string;
}
interface signUpRequestForm {
  email: string;
  name: string;
  password: string;
  nickname: string;
  birth: Date;
  image: string;
}

const inputsToSignUpRequestForm = (data: Inputs): signUpRequestForm => {
  const email: string = data.emailName + "@" + data.emailSite;
  const birth: Date = new Date(
    data.birthYear,
    data.birthMonth - 1,
    data.birthDay
  ); // 월은 0부터 시작하므로 -1
  return {
    email: email,
    name: data.name,
    password: data.password,
    nickname: data.nickname,
    birth: birth,
    image: data.image,
  };
};

export default function SignUp() {
  const Router = useRouter();
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    signUpRequest(data);
  };

  const signUpRequest = async (data: Inputs) => {
    const signUpResponse = await api.post(
      "/member/signup",
      inputsToSignUpRequestForm(data)
    );
    if (signUpResponse.status == 200) {
      alert("회원가입에 성공했습니다.");
      Router.push("/login");
    } else {
      alert("회원가입에 실패했습니다.");
    }
  };

  // 각 필드가 변경될 때마다 유효성 검사를 트리거
  useEffect(() => {
    trigger("emailName");
  }, [watch("emailName")]);

  useEffect(() => {
    trigger("name");
  }, [watch("name")]);

  useEffect(() => {
    trigger("nickname");
  }, [watch("nickname")]);

  useEffect(() => {
    trigger("password");
  }, [watch("password")]);

  useEffect(() => {
    trigger("confirmPassword");
  }, [watch("confirmPassword"), watch("password")]);

  return (
    <Wrapper>
      <Main>
        <h1>회원가입</h1>
        <BodyContainer>
          <ImageContainer>
            <div></div>
          </ImageContainer>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormContents>
              <h1>| 이메일</h1>
              <div>
                <div className="inputcontainer">
                  <input
                    type="text"
                    className="email"
                    {...register("emailName", {
                      required: "· 이메일을 입력하세요.",
                      pattern: {
                        value: inputRegexs.emailRegex,
                        message: "· 이메일 형식이 올바르지 않습니다.",
                      },
                    })}
                  ></input>

                  <span>@</span>
                  <select className="mailselect" {...register("emailSite")}>
                    {possibleMailList.map((mail, index) => (
                      <option key={index}>{mail}</option>
                    ))}
                  </select>
                </div>
                <BorderButton
                  text="인증하기"
                  $bgColor="var(--bg-color)"
                ></BorderButton>
              </div>
              {errors.emailName && <p>{errors.emailName.message}</p>}
            </FormContents>

            <FormContents>
              <h1>| 이름</h1>
              <div>
                <div className="inputcontainer">
                  <input
                    type="text"
                    {...register("name", {
                      required: "· 이름을 입력하세요.",
                      pattern: {
                        value: inputRegexs.nameRegex,
                        message: "· 이름은 한글 2~5자 이내로 입력하세요.",
                      },
                    })}
                  ></input>
                </div>
              </div>
              {errors.name && <p>{errors.name.message}</p>}
            </FormContents>

            <FormContents>
              <h1>| 비밀번호</h1>
              <div>
                <div className="inputcontainer">
                  <input
                    type="password"
                    {...register("password", {
                      required: "· 비밀번호를 입력하세요.",
                      pattern: {
                        value: inputRegexs.pwRegex,
                        message:
                          "· 최소 8자 이상, 하나의 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.",
                      },
                    })}
                  />
                </div>
              </div>
              {errors.password && <p>{errors.password.message}</p>}
            </FormContents>
            <FormContents>
              <h1>| 비밀번호 확인</h1>
              <div>
                <div className="inputcontainer">
                  <input
                    type="password"
                    {...register("confirmPassword", {
                      required: "· 비밀번호를 다시 입력하세요.",
                      validate: (value) =>
                        value === watch("password") ||
                        "· 비밀번호가 일치하지 않습니다.",
                    })}
                  />
                </div>
              </div>
              {errors.confirmPassword && (
                <p>{errors.confirmPassword.message}</p>
              )}
            </FormContents>

            <FormContents>
              <h1>| 별명</h1>
              <div>
                <div className="inputcontainer">
                  <input
                    type="text"
                    className="nickname"
                    {...register("nickname", {
                      required: "· 별명을 입력하세요.",
                      pattern: {
                        value: inputRegexs.nicknameRegex,
                        message: "· 별명은 2~10자 이내로 입력하세요.",
                      },
                    })}
                  />
                </div>

                <BorderButton
                  text="중복체크"
                  $bgColor="var(--bg-color)"
                ></BorderButton>
              </div>
              {errors.nickname && <p>{errors.nickname.message}</p>}
            </FormContents>
            <FormContents>
              <h1>| 생년월일</h1>
              <div>
                <div className="inputcontainer">
                  <select className="dayselect" {...register("birthYear")}>
                    {years.map((year, index) => (
                      <option key={index}>{year}</option>
                    ))}
                  </select>
                  <span className="dot">.</span>
                  <select className="dayselect" {...register("birthMonth")}>
                    {months.map((month, index) => (
                      <option key={index}>{month}</option>
                    ))}
                  </select>
                  <span className="dot">.</span>
                  <select className="dayselect" {...register("birthDay")}>
                    {days.map((day, index) => (
                      <option key={index}>{day}</option>
                    ))}
                  </select>
                </div>
              </div>
            </FormContents>
            <div className="submitbuttoncontainer">
              <BorderButton
                text="회원가입"
                onClick={handleSubmit(onSubmit)}
              ></BorderButton>
            </div>
          </Form>
        </BodyContainer>
      </Main>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
  }

  // * {
  //   border: 0.01px solid lime;
  // }
  main {
    color: black;
  }
`;
const Main = styled.div`
  // main전체 속성
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;

  // 추후 수정 가능
  min-width: 30rem;
  //

  font-weight: 600;
  box-sizing: border-box;
  padding: 1rem;
  margin-top: 1.5rem;
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
const Form = styled.form`
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
    margin-bottom: 0.3rem;
  }

  p {
    margin-bottom: 10px;
  }
`;
