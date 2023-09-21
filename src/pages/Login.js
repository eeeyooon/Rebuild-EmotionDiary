import { useEffect, useState } from "react";
import styled from "styled-components";

function Login() {
  const [user, setUser] = useState("");

  useEffect(() => {
    const loginedUser = localStorage.getItem("user");

    if (loginedUser) {
      setUser(loginedUser);
    }
  }, []);

  return (
    <div>
      <LoginHeaderText>Login</LoginHeaderText>
      {user ? <h1>user: {user}</h1> : <h1>로그인 x</h1>}
    </div>
  );
}

export default Login;

const LoginHeaderText = styled.h1`
  background-color: ${({ theme }) => theme.color.emotion_1};
  color: ${({ theme }) => theme.color.white};
  padding-left: 10px;
`;
