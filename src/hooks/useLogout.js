import { useAuth } from "./useAuth";

export const useLogout = () => {
  const { updateUser } = useAuth();

  const onLogout = () => {
    try {
      updateUser(null);
    } catch (error) {
      console.error("로그아웃 중 에러 발생:", error);
      alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
    }
  };
  return { onLogout };
};
