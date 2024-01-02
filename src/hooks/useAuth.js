import { useState, useEffect, useCallback } from "react";

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loginedUser = localStorage.getItem("kakao_email");
    setUser(loginedUser);
  }, []);

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
