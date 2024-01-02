import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DiaryStateContext } from "./../App";
import DiaryEditor from "./../components/DiaryEditor";

const Edit = () => {
  const navigate = useNavigate();
  const { diaryId } = useParams();
  const [originData, setOrigindata] = useState();
  const diaryList = useContext(DiaryStateContext);

  useEffect(() => {
    const titleElement = document.getElementsByTagName("title")[0];
    titleElement.innerHTML = `감정 일기장 - ${diaryId}번 일기 수정`;
  }, []);

  useEffect(() => {
    if (diaryList.length >= 1) {
      const targetDiary = diaryList.find(
        (it) => parseInt(it.diaryId) === parseInt(diaryId)
      );

      if (targetDiary) {
        setOrigindata(targetDiary);
      } else {
        navigate("/home", { replace: true });
      }
    }
  }, [diaryId, diaryList]);

  return (
    <div>
      {originData && <DiaryEditor isEdit={true} originData={originData} />}
    </div>
  );
};

export default Edit;
