import { getDiaries } from "../firebase/diaryManager";

export const sortDiaryList = async (user) => {
  const diaryData = await getDiaries(user);
  return diaryData.sort((a, b) => parseInt(b.diaryId) - parseInt(a.diaryId));
};
