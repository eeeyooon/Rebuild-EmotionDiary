import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setUser }) {
  const navigate = useNavigate();
  const kakaoJs = process.env.REACT_APP_KAKAO_JS;

  useEffect(() => {
    localStorage.removeItem("kakao_email");
    localStorage.removeItem("kakao_name");
  }, []);

  // 카카오 로그인
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.Kakao.init(kakaoJs);

      // 카카오 로그인 이벤트 핸들러
      const kakaoLogin = () => {
        window.Kakao.Auth.login({
          scope: "profile_nickname, account_email",
          success: function (authObj) {
            window.Kakao.API.request({
              url: "/v2/user/me",
              success: (res) => {
                const kakao_account = res.kakao_account;
                localStorage.setItem("kakao_email", kakao_account.email);
                localStorage.setItem(
                  "kakao_name",
                  kakao_account.profile.nickname
                );
                setUser(kakao_account.email);
                navigate("/home");
              },
            });
          },
        });
      };

      const kakaoLoginButton = document.getElementById("kakao-login-button");
      if (kakaoLoginButton) {
        kakaoLoginButton.addEventListener("click", kakaoLogin);
      }

      return () => {
        if (kakaoLoginButton) {
          kakaoLoginButton.removeEventListener("click", kakaoLogin);
        }
      };
    };
  }, []);

  const handleTestLogin = () => {
    setUser("test");
    localStorage.setItem("kakao_email", "test");
    navigate("/home");
  };

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
      <button className="test_login" onClick={handleTestLogin}>
        비회원으로 체험하기
      </button>
    </div>
  );
}

export default Login;
