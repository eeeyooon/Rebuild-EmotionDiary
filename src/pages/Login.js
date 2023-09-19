import { useEffect, useState } from "react";

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
      <h1>Login</h1>
      {user ? <h1>user: {user}</h1> : <h1>로그인 x</h1>}
    </div>
  );
}

export default Login;
