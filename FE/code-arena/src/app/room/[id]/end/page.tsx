function Interviewer() {
  return <h1>면접관 화면입니다.</h1>;
}

function Interviewee() {
  return <h1>응시자 화면입니다.</h1>;
}

export default function Index() {
  var type = 1;

  if (type === 0) {
    return <Interviewer />;
  } else {
    return <Interviewee />;
  }

  return <main></main>;
}
