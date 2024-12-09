"use client";
import { useEffect } from "react";
import { styled } from "styled-components";
import BorderButton from "@/components/common/button/BorderButton";
import ProgramLang from "@/components/programlang/ProgramLang";
// npm install validate-date
import { CodeBlock, dracula, monokai, tomorrowNight } from "react-code-blocks";
import UserCard from "@/components/report/UserCard";
import ReviewCard from "@/components/report/ReviewCard";
import { useState } from "react";
import MixedChart from "@/components/report/MixedChart";
import { Member } from "@/store/roomstore";
import { useParams } from "next/navigation";
import useReportStore from "@/store/reportstore";
import NotFound from "@/app/not-found";

interface User {
  img: string;
  type: string;
  nickname: string;
  name: string;
  email: string;
}
interface Review {
  interviewer: User;
  score: number;
  commentTitle: string;
  commentContent: string;
}
// interface ReportData {
//   title: string;
//   programlang: string;
//   date: string;
//   startTime: string;
//   endTime: string;
//   problem: {
//     text: string;
//     input: string;
//     output: string;
//     example: string;
//   };
//   interviewee: User;
//   excecutionNum: number;
//   finalAnswer: string;
//   AICode: string;
//   codeGraphData: number[];
//   reviewList: Review[];
//   script: string;
// }

// const loremIpsum =
//   "Lorem ipsum dolor sit amet consectetur. Aenean sit pretium facilisis malesuada enim ipsum. Porttitor dui ultrices mattis lectus. Vulputate et id nulla potenti quam amet diam. Tellus nec nunc dolor fringilla parturient quis adipiscing habitasse aliquam. Magna neque nec nunc et sed habitant bibendum in.\nInteger vestibulum pellentesque libero sapien suspendisse adipiscing feugiat viverra viverra. Faucibus tellus nam fringilla nisi. Et eget a ut amet turpis varius. Magna ac turpis nullam at. Sit scelerisque elit euismod nibh.\nOrci in sed est bibendum consequat purus nulla. Sociis magna malesuada aliquam diam tincidunt tempor quam quam mauris. Gravida ridiculus sed nunc auctor vitae sit a praesent. Donec eu sagittis faucibus cras venenatis habitant convallis. Amet volutpat amet tristique et volutpat libero viverra in.";
// const loremShort = "Lorem ipsum dolor ist amnet consectetur";
// const dummyData: ReportData = {
//   title: "네이버 면접 대비 라이브 3회차",
//   programlang: "java",
//   date: "2024. 07. 11",
//   startTime: "12:00",
//   endTime: "15:00",
//   problem: {
//     text: loremIpsum,
//     input: loremShort,
//     output: loremShort,
//     example: loremShort,
//   },
//   interviewee: {
//     img: "",
//     type: "",
//     nickname: "Teacher",
//     name: "문선정",
//     email: "inception010203@gmail.com",
//   },
//   excecutionNum: 7,
//   finalAnswer: `// Type some code ->

// public class Example {
//     public static void main (String[] args){

//         // Output generated number
//         System.out.println(“Generated number: “ + random + “\n”);

//         // Loop between 1 and the number we just generated.
//         for (int i = 1; i <=random; i++){
//             // If i is divisible by both 3 and 5, output “FizzBuzz”
//             if (i % 3 == 0 && i % 5 == 0){
//                 System.out.println(“FizzBuzz”);
//             }
//             // If i is divisible by 3, output “Fizz”
//             else if ( i % 3 == 0){
//                 System.out.println(“Fizz”);
//             }
//             // If i is divisible by 5, output “Buzz”
//             else if ( i % 5 == 0){
//                 System.out.println(“Buzz”);
//             }
//             // If i is not divisible by either 3 or 5, output the number
//             else {
//                 System.out.println(i);
//             }
//         }
//     }
// }`,
//   AICode: `// Type some code ->

// public class Example {
//     public static void main (String[] args){

//         // Output generated number
//         System.out.println(“Generated number: “ + random + “\n”);

//         // Loop between 1 and the number we just generated.
//         for (int i = 1; i <=random; i++){
//             // If i is divisible by both 3 and 5, output “FizzBuzz”
//             if (i % 3 == 0 && i % 5 == 0){
//                 System.out.println(“FizzBuzz”);
//             }
//             // If i is divisible by 3, output “Fizz”
//             else if ( i % 3 == 0){
//                 System.out.println(“Fizz”);
//             }
//             // If i is divisible by 5, output “Buzz”
//             else if ( i % 5 == 0){
//                 System.out.println(“Buzz”);
//             }
//             // If i is not divisible by either 3 or 5, output the number
//             else {
//                 System.out.println(i);
//             }
//         }
//     }
// }
// `,
//   codeGraphData: [0, 30, 20, 2, 12, 32, 4],
//   reviewList: [
//     {
//       interviewer: {
//         img: "",
//         type: "",
//         nickname: "heyhey",
//         name: "유서현",
//         email: "inception010203@gmail.com",
//       },
//       score: 85,
//       commentTitle: "코드치면서 말하는 연습을 중점적으로 하세요",
//       commentContent: loremIpsum,
//     },
//     {
//       interviewer: {
//         img: "",
//         type: "",
//         nickname: "bley",
//         name: "한도형",
//         email: "bley1217@gmail.com",
//       },
//       score: 70,
//       commentTitle: "코드치면서 말하는 연습을 중점적으로 하세요",
//       commentContent: loremIpsum,
//     },
//     {
//       interviewer: {
//         img: "",
//         type: "",
//         nickname: "master",
//         name: "문선정",
//         email: "inception010203@gmail.com",
//       },
//       score: 95,
//       commentTitle: "코드치면서 말하는 연습을 중점적으로 하세요",
//       commentContent: loremIpsum,
//     },
//   ],
//   script: loremIpsum + loremIpsum + loremIpsum,
// };

export default function signUp() {
  const [isScriptOpen, setIsScriptOpen] = useState(false);

  const { report, isLoading, error, fetchReportById } = useReportStore();
  const params = useParams();

  // 레포트 상세 가져오기
  useEffect(() => {
    const reportId = params?.id;
    if (reportId) {
      const id = Array.isArray(reportId) ? reportId[0] : reportId; // typescript 오류 해결용도 (배열인지 아닌지 체크)
      fetchReportById(id);
    }
  }, [params]);

  if (!report && !isLoading) return <NotFound></NotFound>;

  return (
    <Wrapper>
      <h1>
        {report!.roomName}'s <span>report</span>
      </h1>
      <div className="subtitle">
        <div className="programlangcontainer">
          <ProgramLang imgName="java" />
        </div>
        <div className="datecontainer">
          <span>{report!.testDate}</span>
          {/* <span>
            {report!.startTime} ~ {report!.endTime}
          </span> */}
        </div>
      </div>
      <Main>
        <WhiteContainer>
          <ContentContainer>
            <h1>| 문제</h1>
            <div className="content">
              <Problem>
                <div className="problem">
                  <p>{report!.problem.description}</p>
                </div>
                <div className="example">
                  <p className="header">입력</p>
                  <p>{report!.problem.inputCondition}</p>
                </div>
                <div className="example">
                  <p className="header">출력</p>
                  <p>{report!.problem.outputCondition}</p>
                </div>
                <div className="example">
                  <p className="header">예제</p>
                  {report!.problem.examples.map((example, index) => (
                    <>
                      <div className="example">
                        <p className="header">입력</p>
                        <p>{example.in}</p>
                      </div>
                      <div className="example">
                        <p className="header">출력</p>
                        <p>{example.out}</p>
                      </div>
                    </>
                  ))}
                </div>
              </Problem>
            </div>
          </ContentContainer>
          <ContentContainer>
            <h1>| 응시자</h1>
            <div className="content">
              <UserCard
                img={report!.image}
                nickname={report!.nickname}
                name={report!.interviewerName}
              />
            </div>
          </ContentContainer>
          <ContentContainer>
            <h1>| 최종 답안</h1>
            <div className="content">
              <CodeBlock
                text={report!.codeContent}
                language="java"
                showLineNumbers={false}
                theme={tomorrowNight}
              ></CodeBlock>
            </div>
          </ContentContainer>
          {/* <ContentContainer>
              <h1>
                | <span>AI 코드 첨삭</span>
              </h1>
              <div className="content">
                <CodeBlock
                  text={report!.AICode}
                  language="java"
                  showLineNumbers={false}
                  theme={tomorrowNight}
                ></CodeBlock>
              </div>
            </ContentContainer> */}
          {/* <ContentContainer>
            <h1>| 시간당 작성량</h1>
            <MixedChart data={dummyData.codeGraphData}></MixedChart>
          </ContentContainer> */}
          <ContentContainer>
            <h1>| 면접관</h1>
            <div className="interviewercontainer">
              {report!.interviewees.map((interviewee, index) => (
                <UserCard
                  key={index}
                  img={interviewee.image}
                  nickname={interviewee.nickname}
                  name={interviewee.name}
                />
              ))}
            </div>
          </ContentContainer>

          <ContentContainer>
            {report!.interviewees.map((interviewee, index) => (
              <ReviewCard
                key={index}
                review={{
                  interviewer: {
                    img: interviewee.image, // 면접관 이미지
                    nickname: interviewee.nickname, // 면접관 닉네임
                    name: interviewee.name, // 면접관 이름
                  },
                  score: interviewee.score, // 면접관 점수
                  commentTitle: interviewee.title, // 리뷰 제목
                  commentContent: interviewee.content, // 리뷰 내용
                }}
              />
            ))}

            {/* <div className="scriptcontainer">
              <details className="scriptdetails">
                <summary>
                  <span className="scriptsummary">
                    회의 발언 기록 보기
                    <span className="material-icons">expand_circle_down</span>
                  </span>
                  <div>※ AI가 생성한 Script입니다.</div>
                </summary>
                <div className="scriptcontent">
                  <p>{dummyData.script}</p>
                </div>
              </details>
            </div> */}
          </ContentContainer>
        </WhiteContainer>
      </Main>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  flex-direction: column;
  box-sizing: border-box;
  padding: 3rem 0 0 0;
  @media (max-width: 768px) {
  }

  * {
    line-height: 1.4;
  }
  main {
    color: black;
  }
  > h1 {
    color: white;
    font-size: 3rem;
    width: 100%;
    display: flex;
    justify-content: center;
    font-weight: bold;
    margin-bottom: 30px;
    span {
      margin-left: 1rem;
      color: var(--yellow-color);
    }
  }
  .datecontainer {
    align-items: center;
    display: flex;
    justify-content: space-between;
    width: 50%;
    span {
      display: flex;
      font-size: 1.5rem;
      font-weight: bold;
    }
    span:first-child {
      color: var(--yellow-color);
    }
  }
  .subtitle {
    display: flex;
    width: 50%;
    margin: 0 auto;
    justify-content: space-between;
    span {
      color: white;
    }
    .programlangcontainer {
      display: flex;
      width: 10rem;
    }
  }
`;

// Main 스타일 컴포넌트
const Main = styled.div`
  // main전체 속성
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  // 추후 수정 가능
  min-width: 30rem;
  //

  font-weight: 600;
  box-sizing: border-box;
  padding: 1rem;
  margin-top: 2rem;
  margin-bottom: 3rem;

  > h1 {
    box-sizing: border-box;
    padding-left: 1rem;
    margin-bottom: 3rem;

    font-weight: bold;
    font-size: 3rem;
    color: white;
  }
`;
const WhiteContainer = styled.div`
  background-color: white;
  width: 90%;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 2rem;
  border-radius: 10px;
`;
const ContentContainer = styled.div`
  display: flex;
  width: 95%;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    display: flex;
    width: 100%;
    font-size: 2.5rem;
    font-weight: bold;
    span {
      box-shadow: inset 0 -15px #ffd84b;
    }
  }
  .content {
    display: flex;
    box-sizing: border-box;
    width: 70%;
    flex-direction: column;
    padding-top: 2rem;
  }
  hr {
    border: 0;
    clear: both;
    display: block;
    width: 85%;
    background-color: var(--primary-color);
    height: 1px;
  }
  .interviewercontainer {
    display: flex;
    flex-direction: row;
    width: 100%;
    margin-top: 3rem;
  }
  .problem {
    box-sizing: border-box;
    padding: 0 0 2rem 0;
    font-size: 1.2rem;
    font-weight: bold;
  }
  .example {
    box-sizing: border-box;
    padding: 1rem 0 1rem 0;
    .header {
      font-size: 1.5rem;
      box-sizing: border-box;
      padding: 0.3rem 0 0.3rem 0;
      margin-bottom: 10px;
    }
  }
  .scriptcontainer {
    display: flex;
    justify-content: center;
    .scriptdetails {
      display: flex;
      justify-content: center;
    }
    summary {
      width: 100%;
      display: flex;
      flex-direction: column;

      align-items: center;
      div {
        font-size: 1.4rem;
        box-shadow: inset 0 -6px #ffd84b;
        margin: 1rem 0 0 0;
      }
    }
    .scriptsummary {
      display: flex;
      align-items: center;
      font-size: 2rem;
      color: var(--bg-color);
      font-weight: bold;
      .material-icons {
        font-size: 1.7rem;
        margin-left: 0.5rem;
      }
    }
    .scriptcontent {
      width: 100%;
      box-sizing: border-box;
      display: flex;
      padding: 4rem 10rem 4rem 10rem;
      justify-content: center;
    }
  }
`;

const Problem = styled.div`
  .header {
    background-color: var(--bg-color);
    color: white;
  }
`;
