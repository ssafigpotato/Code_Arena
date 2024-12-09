import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import BorderButton from "@/components/common/button/BorderButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useReportStore from "@/store/reportstore";
import useUserStore from "@/store/userstore";

const Wrapper = styled.div`
  box-sizing: border-box;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  height: 100%;
  border-radius: 1rem;
  margin: 0 0 0 0.9rem;
  font-family: "Pretendard";
  font-size: 1.5rem;
  font-weight: 700;
`;

const Title = styled.div`
  display: flex;
`;
const TableContainer = styled.div`
  box-sizing: border-box;
  padding: 0.8rem;
  font-size: 1.3rem;

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 0.5rem;

    th {
      border-bottom: 2px solid var(--bg-color);
      padding: 0.4rem;
    }

    td {
      border-bottom: 1px solid var(--bg-color);
      padding: 0.4rem;
      font-size: 0.9rem;
      font-weight: 300;
      text-align: center;
    }

    .title {
      cursor: pointer;
      &:hover {
        color: var(--light-color);
      }
    }
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: end;
  margin: 0 0 0.5rem 0;

  button {
    display: flex;
    align-items: center;
    margin: 0 5px;
    background-color: #ffffff;
    cursor: pointer;
    height: 1.5rem;
    font-size: 0.8rem;
    border: none;
    font-weight: 700;
    &:hover {
      color: var(--yellow-color);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    span {
      font-size: 0.8rem;
      font-weight: 700;
    }
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-template-rows: auto auto auto auto;
  grid-template-areas:
    "label1 value1"
    "label2 value2"
    "label3 value3"
    "button1 button1"
    "button2 button2";
  padding: 0.8rem;

  div {
    font-size: 1.3rem;
    padding: 0.5rem;
    display: flex;
    align-items: center;
  }

  div:nth-child(2n) {
    font-size: 1.2rem;
    font-weight: 400;
  }

  .label1 {
    grid-area: label1;
  }
  .value1 {
    grid-area: value1;
  }
  .label2 {
    grid-area: label2;
  }
  .value2 {
    grid-area: value2;
  }
  .label3 {
    grid-area: label3;
  }
  .value3 {
    grid-area: value3;
  }
  .button1 {
    display: flex;
    justify-content: center;
    grid-area: button1;
    grid-column: span 2;
    padding: 0.1rem;
  }
  .button2 {
    display: flex;
    justify-content: center;
    grid-area: button2;
    grid-column: span 2;
    padding: 0.1rem;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2rem;
    width: 12rem;
  }
`;
const PerPage = 4;

const Test = () => {
  const { reportList, isLoading, error, fetchReportsByUserId } =
    useReportStore();
  const { currentUser } = useUserStore();
  const router = useRouter();

  // 레포트 목록 불러오기
  useEffect(() => {
    if (currentUser) {
      fetchReportsByUserId(currentUser.id);
      // console.log(reportList);
    }
  }, [currentUser?.id, fetchReportsByUserId]);

  // 추후 수정 필요
  const goReport = (id: string) => {
    router.push(`/report/${id}`);
  };

  // 페이지네이션을 위한 상태 관리
  const [currentPage, setCurrentPage] = useState(1);
  // 참여테스트 제목 클릭시 상세 조회를 위한 상태 관리
  const [selectedTest, setSelectedTest] = useState<any>(null);

  // 총 페이지 수
  const totalPages = Math.ceil(reportList.length / PerPage);

  const currentData = reportList.slice(
    (currentPage - 1) * PerPage,
    currentPage * PerPage
  );

  // 제목 클릭시
  const handleClick = (test: any) => {
    setSelectedTest(test);
  };

  return (
    <>
      <Wrapper>
        <Title>| 참여 테스트</Title>
        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>제목</th>
                <th>시작 시간</th>
                <th>사용 언어</th>
                <th>PASS</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((test, index) => (
                <tr key={index}>
                  <td className="title" onClick={() => handleClick(test)}>
                    {test.title}
                  </td>
                  <td>{test.startTime}</td>
                  <td>{test.language}</td>
                  <td>{test.corrects} / 10</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>

        <Pagination>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              disabled={currentPage === index + 1}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <span className="material-icons">arrow_back_ios</span>
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={totalPages === 0 || currentPage === totalPages}
          >
            <span className="material-icons">arrow_forward_ios</span>
          </button>
        </Pagination>
        <Title>| 테스트 상세</Title>
        {selectedTest && (
          <Grid>
            <div className="label1">시작 시간</div>
            <div className="value1"> {selectedTest.startTime}</div>
            <div className="label2">참여테스트</div>
            <div className="value2"> {selectedTest.title}</div>
            {/* <div className="label3">테스트 시간 </div>
            <div className="value3">
              {selectedTest.endtime} min / {selectedTest.totaltime}
              min
            </div> */}
            {/* <div className="button1">
              <BorderButton
                text={"녹화본 시청하기"}
                $bgColor="var(--bg-color)"
                $textColor="#ffffff"
                $hoverColor="var(--bg-color)"
              />
            </div> */}
            <div className="button2">
              <BorderButton
                text={"리포트 보러가기"}
                $bgColor="var(--bg-color)"
                $textColor="#ffffff"
                $hoverColor="var(--bg-color)"
                onClick={() => {
                  goReport(selectedTest.id);
                }}
              />
            </div>
          </Grid>
        )}
      </Wrapper>
    </>
  );
};

export default Test;
