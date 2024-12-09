import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styled from "styled-components";
import BorderButton from "../common/button/BorderButton";
import RoundButton from "../common/button/RoundButton";
import SearchBar from "../common/input/SearchBar";
import Checkbox from "../common/input/Checkbox";
import Dropdown from "../common/input/Dropdown";
import RoomInput from "./RoomInput";
import { useForm, SubmitHandler } from "react-hook-form";
import api from "@/utils/api";
import { useRoomStore } from "@/store/roomstore";
import Link from "next/link";
import ProgramLang from "../programlang/ProgramLang";
import useUserStore from "@/store/userstore";
import { RoomResponse } from "@/store/roomstore";
import useAiStore from "@/store/aistore";

// 방 생성 form의 input들
interface Inputs {
  roomName: string;
  roomStatus: string;
  testTime: number;
  roomLanguage: "Java" | "Python" | "CPP";
  password?: string;
  maxNum: number;
}

const getTransformedTime = (time: number) => {
  const hour = Math.floor(time / 60);
  const minute = time % 60;
  if (hour >= 1) {
    return hour + "시간" + minute + "분";
  } else {
    return minute + "분";
  }
};

const RoomList: React.FC = () => {
  const [checked, setChecked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("모든 상태");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPwModalOpen, setIsPwModalOpen] = useState(false);
  const [enteringRoom, setEnteringRoom] = useState<RoomResponse>({
    roomId: "",
    roomMemberId: "",
    password: "",
    roomLanguage: "Java",
    testTime: 0,
    startStatus: "OFF",
    tester: null,
    startTime: null,
    maxNum: 1,
  });
  const [submittingPassword, setSubmittingPassword] = useState("");
  const [isPwInputOpen, setIsPwInputOpen] = useState(false);
  const {
    roomList,
    fetchAllRooms,
    inputMaxNum,
    isStarted,
    setIsStarted,
    fetchRoomById,
    enterRoom,
  } = useRoomStore();
  const { sendGetProblemRequest } = useAiStore();
  const { currentUser } = useUserStore();
  const [filteredRooms, setFilteredRooms] = useState<RoomResponse[]>(roomList);

  const roomsPerPage = 6;

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleDropdownChange = (value: string) => {
    setFilter(value);
  };

  const handleModalOpen = () => {
    if (currentUser?.id) {
      setIsModalOpen(true);
    } else {
      alert("로그인이 필요합니다.");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const dropdownList = ["모든 상태", "시작 전", "진행중", "종료"];

  // 검색
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchKeyword, setSearchKeyword] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(event.target.value);
  };

  useEffect(() => {
    const keyword = searchParams ? searchParams.get("keyword") : "";
    const type = searchParams ? searchParams.get("type") : "";
    if (keyword && type === "rooms") {
      setSearchKeyword(keyword);
    }
  }, [searchParams]);

  useEffect(() => {
    // 상태 및 검색어에 따라 필터링된 방 목록
    let updatedRooms = roomList;
    updatedRooms = roomList.filter((room) => {
      if (filter === "모든 상태") {
        return (
          room.startStatus === "ON" ||
          room.startStatus === "OFF" ||
          room.startStatus === "END"
        );
      }
      if (filter === "시작 전") {
        return room.startStatus === "OFF";
      }
      if (filter === "진행중") {
        return room.startStatus === "ON";
      }
      return false;
    });

    if (searchKeyword) {
      updatedRooms = updatedRooms.filter((room) =>
        room.name?.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    if (checked) {
      console.log("체크!");
      console.log(updatedRooms);
      updatedRooms = updatedRooms.filter((room) => isMyRoom(room));
      console.log(updatedRooms);
    }

    setFilteredRooms(updatedRooms);
  }, [filter, searchKeyword, roomList, checked]);

  const isMyRoom = (room: RoomResponse) => {
    if (room.tester?.memberId === currentUser?.id) {
      return true;
    }
    room.members?.map((member) => {
      if (member.memberId == currentUser?.id) return true;
    });
    return false;
  };

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
  useEffect(() => {
    fetchAllRooms();
  }, [fetchAllRooms]);
  const nextPage = () =>
    setCurrentPage((prev) =>
      Math.min(prev + 1, Math.ceil(filteredRooms.length / roomsPerPage))
    );
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  //방 생성 요청 API 및 라우팅
  const { register, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
    data.maxNum = inputMaxNum;
    const makeRoomResponse = await api.post("/room", data);
    const routerPush = async () => {
      const foo = await fetchRoomById(makeRoomResponse.data.roomId);
      router.push("/froom/" + makeRoomResponse.data.roomId);
    };
    routerPush();
  };

  const handlePwSubmit = async () => {
    var myType = "";
    if (enteringRoom.tester?.memberId == currentUser?.id) myType = "TESTER";
    else myType = "INTERVIEWER";
    const entrance = {
      roomId: enteringRoom.roomId,
      password: "",
      type: myType,
    };
    if (myType == "TESTER") {
      enterRoom(entrance);
      router.push("/froom/" + enteringRoom.roomId);
    } else {
      if (submittingPassword == enteringRoom.password) {
        enterRoom(entrance);
        router.push("/froom/" + enteringRoom.roomId);
      } else {
        alert("비밀번호가 틀렸습니다!");
      }
    }
  };
  return (
    <>
      <RoomTitle>방 목록</RoomTitle>
      <RoomBar>
        <SearchBox>
          <SearchBar value={searchKeyword} onChange={handleSearchChange} />
          <Checkbox
            text="내가 주최한 방만 보기"
            onChange={handleCheckboxChange}
          />
          <Dropdown list={dropdownList} onChange={handleDropdownChange} />
        </SearchBox>
        <RoundButton text="방 생성하기" onClick={handleModalOpen} />
      </RoomBar>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader width="22%">제목</TableHeader>
            <TableHeader width="10%">공개여부</TableHeader>
            <TableHeader width="10%">상태</TableHeader>
            <TableHeader width="10%">주최자</TableHeader>
            <TableHeader width="10%">면접관 수</TableHeader>
            <TableHeader width="13%">테스트 시간</TableHeader>
            <TableHeader width="12%">사용 언어</TableHeader>
            <TableHeader width="18%"></TableHeader>
          </TableRow>
        </TableHead>
        <tbody>
          {currentRooms.map((room, index) => (
            <TableRow key={index}>
              <TableCell width="22%">{room.name}</TableCell>
              <TableCell width="10%">
                {room.status == "PRIVATE" ? "비공개" : "공개"}
              </TableCell>
              <TableCell
                width="10%"
                style={room.startStatus == "ON" ? { color: "red" } : {}}
              >
                {room.startStatus == "ON"
                  ? "진행중"
                  : room.startStatus == "END"
                  ? "종료"
                  : "시작 전"}
              </TableCell>
              <TableCell width="10%">{room.tester?.nickName}</TableCell>
              <TableCell width="10%">
                {room.curNum && room.curNum - 1} / {room.maxNum}
              </TableCell>
              <TableCell width="13%">
                {getTransformedTime(room.testTime)}
              </TableCell>
              <TableCell width="12%">
                <ProgramLang imgName={room.roomLanguage} />
              </TableCell>
              <TableCell width="18%">
                <BorderButton
                  text="입장하기"
                  $bgColor={
                    room.startStatus === "OFF" ? "var(--yellow-color)" : "white"
                  }
                  $hoverColor={
                    room.startStatus === "OFF" ? "var(--yellow-color)" : "white"
                  }
                  onClick={async () => {
                    setEnteringRoom(room);
                    fetchRoomById(room.roomId);
                    sendGetProblemRequest(room.roomId);
                    if (room.startStatus == "ON") {
                      setIsStarted(true);
                    } else {
                      setIsStarted(false);
                    }
                    var myType = "";
                    if (room.tester?.memberId == currentUser?.id)
                      myType = "TESTER";
                    else myType = "INTERVIEWER";
                    if (myType == "TESTER") {
                      router.push("/froom/" + room.roomId);
                    }
                    if (room.status == "PUBLIC") {
                      enterRoom({
                        roomId: room.roomId,
                        password: "",
                        type: myType,
                      });
                      const roomEntranceAxios = await api.post("/room/enter", {
                        roomId: room.roomId,
                        password: "",
                        type: myType,
                      });
                      if (roomEntranceAxios.status == 200) {
                        router.push("/froom/" + room.roomId);
                      }
                    } else if (room.status == "PRIVATE") {
                      setEnteringRoom(room);
                      setIsPwModalOpen(true);
                    }
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
      <Pagination>
        <PageIndicator>
          {indexOfFirstRoom + 1} -{" "}
          {Math.min(indexOfLastRoom, filteredRooms.length)}
        </PageIndicator>
        <PageButton onClick={prevPage} disabled={currentPage === 1}>
          &lt;
        </PageButton>

        <PageButton
          onClick={nextPage}
          disabled={
            filteredRooms.length === 0 ||
            currentPage === Math.ceil(filteredRooms.length / roomsPerPage)
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
                <h2>방 생성하기</h2>
                <CloseButton onClick={handleModalClose}>&times;</CloseButton>
              </ModalHeader>
              <ModalBody>
                <FormContent>
                  <FormLabel>방 제목</FormLabel>
                  <ModalInput
                    type="text"
                    placeholder="방 제목을 입력해주세요."
                    {...register("roomName")}
                  />
                </FormContent>
                <FormContent>
                  <FormLabel>공개 여부</FormLabel>
                  <fieldset>
                    <RadioLabel>
                      <RadioInput
                        type="radio"
                        value="PUBLIC"
                        defaultChecked={true}
                        onClick={() => {
                          setIsPwInputOpen(false);
                        }}
                        {...register("roomStatus")}
                      />
                      공개 방
                    </RadioLabel>
                    <RadioLabel>
                      <RadioInput
                        type="radio"
                        value="PRIVATE"
                        onClick={() => {
                          setIsPwInputOpen(true);
                        }}
                        {...register("roomStatus")}
                      />
                      비공개 방
                    </RadioLabel>
                  </fieldset>
                </FormContent>
                <SmallText>
                  * 공개 여부는 방을 개설한 이후 변경이 불가능합니다.
                </SmallText>
                <FormContent>
                  <FormLabel>테스트 시간</FormLabel>
                  <ModalInput
                    type="number"
                    placeholder=""
                    width="80px"
                    min="0"
                    {...register("testTime")}
                  />
                  <ModalText>분</ModalText>
                </FormContent>
                <FormContent>
                  <FormLabel>사용 언어</FormLabel>
                  <fieldset>
                    <RadioLabel>
                      <RadioInput
                        type="radio"
                        value="Java"
                        defaultChecked={true}
                        {...register("roomLanguage")}
                      />
                      Java
                    </RadioLabel>
                    <RadioLabel>
                      <RadioInput
                        type="radio"
                        value="Python"
                        {...register("roomLanguage")}
                      />
                      Python
                    </RadioLabel>
                    <RadioLabel>
                      <RadioInput
                        type="radio"
                        value="CPP"
                        {...register("roomLanguage")}
                      />
                      C++
                    </RadioLabel>
                  </fieldset>
                </FormContent>
                {isPwInputOpen && (
                  <FormContent>
                    <FormLabel>비밀번호</FormLabel>
                    <ModalInput
                      type="text"
                      placeholder=""
                      width="80px"
                      min="0"
                      {...register("password")}
                    />
                  </FormContent>
                )}
                <RoomInput />
                <ButtonContainer>
                  <BorderButton
                    text="취소"
                    $bgColor="var(--red-color)"
                    onClick={handleModalClose}
                  />
                  <BorderButton text="개설" onClick={handleSubmit(onSubmit)} />
                </ButtonContainer>
              </ModalBody>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
      {isPwModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <form>
              <ModalHeader>
                <h2>비밀번호</h2>
                <CloseButton
                  onClick={() => {
                    setIsPwModalOpen(false);
                  }}
                >
                  &times;
                </CloseButton>
              </ModalHeader>
              <ModalBody>
                <FormContent>
                  <FormLabel>비밀번호 입력</FormLabel>
                  <ModalInput
                    type="text"
                    placeholder="비밀번호를 입력해주세요."
                    onChange={(event) => {
                      setSubmittingPassword(event.target.value);
                    }}
                  />
                  <ButtonContainer>
                    <BorderButton
                      text="취소"
                      $bgColor="var(--red-color)"
                      onClick={() => {
                        setIsPwModalOpen(false);
                      }}
                    />
                    <BorderButton text="제출" onClick={handlePwSubmit} />
                  </ButtonContainer>
                </FormContent>
              </ModalBody>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

const RoomTitle = styled.div`
  font-size: 24px;
  font-weight: 700;
  padding: 20px 0px;
  color: white;
`;

const RoomBar = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SearchBox = styled.div`
  display: flex;
  gap: 10px;
`;

const Table = styled.table`
  width: 100%;
  font-family: Pretendard;
  border-collapse: collapse;
  margin-top: 20px;
  font-size: 20px;
  text-align: left;
  border-collapse: separate;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
`;

const TableHead = styled.thead`
  background-color: white;
  pointer-events: none; /* 호버 효과 비활성화 */
  height: 60px;
`;

const TableRow = styled.tr`
  background-color: white;

  &:hover {
    background-color: var(--light-color);
  }
`;

const TableHeader = styled.th<{ width?: string }>`
  padding: 12px 15px;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  vertical-align: middle;
  width: ${(props) => props.width || "auto"};
  font-weight: 600;
`;

const TableCell = styled.td<{ width?: string }>`
  padding: 4px 15px;
  border-bottom: 1px solid #ddd;
  vertical-align: middle;
  width: ${(props) => props.width || "auto"};
`;

const Pagination = styled.div`
  display: flex;
  background-color: white;
  border-radius: 0 0 8px 8px;
  justify-content: flex-end;
  align-items: center;
  padding: 10px 0;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  background-color: ${(props) =>
    props.$active ? "var(--light-color)" : "white"};
  border: none;
  padding: 10px 20px;
  margin: 0 5px;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const PageIndicator = styled.div`
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
  padding: 12px;
  font-size: 16px;
  width: ${(props) => props.width || "736px"};
  border-radius: 20px;
  border: 1px solid white;
  background-color: #202e41;
  color: white;
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

export default RoomList;
