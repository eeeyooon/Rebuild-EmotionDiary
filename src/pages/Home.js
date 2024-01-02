import { useContext, useEffect, useState } from "react";
import { DiaryStateContext } from "./../App";
import MyHeader from "./../components/MyHeader";
import MyButton from "./../components/MyButton";
import DiaryList from "../components/DiaryList";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  decreaseMonth,
  filterDiariesByMonth,
  increaseMonth,
} from "../utils/date";
import { useLogout } from "../hooks/useLogout";

const Home = () => {
  const diaryList = useContext(DiaryStateContext);
  const [data, setData] = useState([]);
  const [curDate, setCurdate] = useState(new Date());
  const { user } = useAuth();
  const { onLogout } = useLogout();
  const navigate = useNavigate();
  const headText = `${curDate.getFullYear()}년 ${curDate.getMonth() + 1}월`;

  const loginedUserName =
    user === "test" ? "비회원" : localStorage.getItem("kakao_name");

  useEffect(() => {
    const titleElement = document.getElementsByTagName("title")[0];
    titleElement.innerHTML = `감정 일기장`;
  }, []);

  useEffect(() => {
    if (diaryList.length >= 1) {
      setData(filterDiariesByMonth(diaryList, curDate));
    }
  }, [diaryList, curDate]);

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const handleIncreaseMonth = () => {
    setCurdate(increaseMonth(curDate));
  };

  const handleDecreaseMonth = () => {
    setCurdate(decreaseMonth(curDate));
  };

  return (
    <div>
      <MyHeader
        headText={headText}
        leftChild={<MyButton text={"<"} onClick={handleDecreaseMonth} />}
        rightChild={<MyButton text={">"} onClick={handleIncreaseMonth} />}
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
