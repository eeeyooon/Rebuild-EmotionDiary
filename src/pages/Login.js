import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loginedUser = localStorage.getItem("user");

    if (loginedUser) {
      setUser(loginedUser);
    }
  }, []);

  return (
    <div className="login_wrapper">
      <img
        src={process.env.PUBLIC_URL + "/assets/emotion_thumbnail.png"}
        alt="감정일기장 썸네일"
      />
      <p className="thumbnail_text">
        하루의 일상과 그 날 느낀 감정을 함께 기록하는 감정 일기장
        <span>지난 일상을 어떤 감정들로 채웠는지 돌아볼 수 있어요.</span>
      </p>
      <button className="kakao_btn" id="kakao-login-button">
        <img
          className="kakao_logo"
          alt="카카오 로고"
          src={process.env.PUBLIC_URL + "/assets/kakao_logo.svg"}
        />
        카카오 로그인
      </button>
      <button className="test_login" onClick={() => navigate("/home")}>
        비회원으로 체험하기
      </button>
    </div>
  );
}

export default Login;
