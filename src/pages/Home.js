import { useContext, useEffect, useState } from "react";
import { DiaryStateContext } from "./../App";

import MyHeader from "./../components/MyHeader";
import MyButton from "./../components/MyButton";
import DiaryList from "../components/DiaryList";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const diaryList = useContext(DiaryStateContext);

  const [data, setData] = useState([]);
  const [curDate, setCurdate] = useState(new Date());
  const headText = `${curDate.getFullYear()}년 ${curDate.getMonth() + 1}월`;
  const navigate = useNavigate();
  // const loginedUser = localStorage.getItem("kakao_email");
  const [loginedUser, setLoginedUser] = useState(
    localStorage.getItem("kakao_email")
  );

  const loginedUserName =
    localStorage.getItem("kakao_email") === "test"
      ? "비회원"
      : localStorage.getItem("kakao_name");

  useEffect(() => {
    if (!loginedUser) navigate("/login");
  }, [loginedUser]);

  useEffect(() => {
    const titleElement = document.getElementsByTagName("title")[0];
    titleElement.innerHTML = `감정 일기장`;
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("kakao_email");
    localStorage.removeItem("kakao_name");
    setLoginedUser("");
  };

  // curDate가 변하는 순간에만 그 날짜에 해당하는 연도와 달의 일기를 가져옴
  useEffect(() => {
    //일기 데이터가 없을 땐 날짜 체크할 필요 x
    if (diaryList.length >= 1) {
      //그 달의 첫 날
      const firstDay = new Date(
        curDate.getFullYear(),
        curDate.getMonth(),
        1
      ).getTime();

      //그 달의 마지막 날
      const lastDay = new Date(
        curDate.getFullYear(),
        curDate.getMonth() + 1,
        0,
        23,
        59,
        59
      ).getTime();

      //그 날짜에 해당하는 달의 일기만 가져오기
      //날짜가 달의 첫날과 마지막날 사이인 일기만 가져오기
      setData(
        diaryList.filter((it) => firstDay <= it.date && it.date <= lastDay)
      );
    }
  }, [diaryList, curDate, loginedUser]);

  const increaseMonth = () => {
    setCurdate(
      new Date(curDate.getFullYear(), curDate.getMonth() + 1, curDate.getDate())
    );
  };

  const decreaseMonth = () => {
    setCurdate(
      new Date(curDate.getFullYear(), curDate.getMonth() - 1, curDate.getDate())
    );
  };

  return (
    <div>
      <MyHeader
        headText={headText}
        leftChild={<MyButton text={"<"} onClick={decreaseMonth} />}
        rightChild={<MyButton text={">"} onClick={increaseMonth} />}
      />
      <DiaryList diaryList={data} />
      <footer className="myfooter">
        <div>
          <img
            src={process.env.PUBLIC_URL + "/assets/logo.png"}
            alt="로고 아이콘"
          />
          <span>{loginedUserName}님의 감정 일기장</span>
        </div>
        <button className="logout_btn" onClick={handleLogout}>
          로그아웃
        </button>
      </footer>
    </div>
  );
};

export default Home;
