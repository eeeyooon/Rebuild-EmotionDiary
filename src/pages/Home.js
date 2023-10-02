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
  const [loginedUser, setLoginedUser] = useState(
    localStorage.getItem("kakao_email")
  );
  const loginedUserName =
    localStorage.getItem("kakao_email") === "test"
      ? "비회원"
      : localStorage.getItem("kakao_name");

  const handleLogout = () => {
    localStorage.removeItem("kakao_email");
    localStorage.removeItem("kakao_name");
    setLoginedUser("");
  };

  useEffect(() => {
    if (!loginedUser) navigate("/login");
  }, [loginedUser]);

  useEffect(() => {
    const titleElement = document.getElementsByTagName("title")[0];
    titleElement.innerHTML = `감정 일기장`;
  }, []);

  useEffect(() => {
    if (diaryList.length >= 1) {
      const firstDay = new Date(
        curDate.getFullYear(),
        curDate.getMonth(),
        1
      ).getTime();

      const lastDay = new Date(
        curDate.getFullYear(),
        curDate.getMonth() + 1,
        0,
        23,
        59,
        59
      ).getTime();

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
        {loginedUserName !== "비회원" && (
          <button className="logout_btn" onClick={handleLogout}>
            로그아웃
          </button>
        )}
      </footer>
    </div>
  );
};

export default Home;
