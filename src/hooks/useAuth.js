import { useState, useCallback } from "react";

export const useAuth = () => {
  const [user, setUser] = useState(() => {
    const loginedUser = localStorage.getItem("kakao_email");
    return loginedUser;
  });

  const updateUser = useCallback((email) => {
    if (email) {
      localStorage.setItem("kakao_email", email);
    } else {
      localStorage.removeItem("kakao_email");
    }
    setUser(email);
  }, []);

  return { user, updateUser };
};
