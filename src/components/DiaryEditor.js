import { useNavigate } from "react-router-dom";
import { useState, useRef, useContext, useEffect, useCallback } from "react";
import { DiaryDispatchContext } from "./../App.js";
import { getStringDate } from "../utils/date.js";
import { emotionList } from "../utils/emotion.js";
import MyButton from "./MyButton";
import MyHeader from "./MyHeader";
import EmotionItem from "./EmotionItem";
import Modal from "./Modal";
import { useMoal } from "../hooks/useModal.js";

const DiaryEditor = ({ isEdit, originData }) => {
  const contentRef = useRef();
  const [content, setContent] = useState("");
  const [emotion, setEmotion] = useState(3);
  const [date, setDate] = useState(getStringDate(new Date()));
  const navigate = useNavigate();

  // 모달 관련 로직
  const {
    isOpen,
    toggleModal,
    status,
    setModalStatus,
    userSelected,
    setModalSelected,
  } = useMoal();

  // 일기 CUD 관련 로직
  const { handleCreate, handleEdit, handleRemove } =
    useContext(DiaryDispatchContext);
  const handleClickEmote = useCallback((emotion) => {
    setEmotion(emotion);
  }, []);

  // 일기 작성 및 수정
  const handleSubmit = () => {
    if (content.legth < 1) {
      contentRef.current.focus();
      return;
    }

    if (userSelected) {
      if (!isEdit) {
        handleCreate(date, content, emotion);
        setModalSelected(false);
      } else {
        handleEdit(originData.diaryId, date, content, emotion);
        setModalSelected(false);
      }
    }
    navigate("/home", { replace: true });
  };

  // 일기 삭제
  const handleDiaryRemove = () => {
    if (userSelected) {
      handleRemove(originData.diaryId, () => {
        navigate("/home", { replace: true });
      });
      setModalSelected(false);
    }
  };

  // 일기 수정일 때
  useEffect(() => {
    if (isEdit) {
      setDate(getStringDate(new Date(parseInt(originData.date))));
      setEmotion(originData.emotion);
      setContent(originData.content);
    }
  }, [isEdit, originData]);

  // 모달 status
  useEffect(() => {
    if (userSelected) {
      if (status === "수정" || status === "작성") {
        handleSubmit();
      } else if (status === "삭제") {
        handleDiaryRemove();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSelected, status]);

  return (
    <>
      {isOpen && (
        <div className="Modal_Background" onClick={() => toggleModal(false)} />
      )}
      <div className="DiaryEditor">
        <MyHeader
          headText={isEdit ? "일기 수정하기" : "새로운 일기쓰기"}
          leftChild={
            <MyButton text={"< 뒤로가기"} onClick={() => navigate(-1)} />
          }
          rightChild={
            isEdit && (
              <MyButton
                text={"삭제하기"}
                type={"negative"}
                onClick={() => {
                  setModalStatus("삭제");
                  toggleModal(true);
                }}
              />
            )
          }
        />
        <section>
          <h4>오늘은 언제인가요?</h4>
          <div className="input_box">
            <input
              className="input_date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type="date"
            />
          </div>
        </section>
        <section>
          <h4>오늘의 감정</h4>
          <div className="input_box emotion_list_wrapper">
            {emotionList.map((it) => (
              <EmotionItem
                key={it.emotion_id}
                {...it}
                onClick={handleClickEmote}
                isSelected={it.emotion_id === emotion}
              />
            ))}
          </div>
        </section>
        <section>
          <h4>오늘의 일기</h4>
          <div className="input_box text_wrapper">
            <textarea
              placeholder="오늘은 어땠나요?"
              ref={contentRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </section>
        <section>
          <div className="control_box">
            <MyButton text={"취소하기"} onClick={() => navigate(-1)} />
            <MyButton
              text={isEdit ? "수정완료" : "작성완료"}
              type={"positive"}
              onClick={() => {
                toggleModal(true);
                setModalStatus(isEdit ? "수정" : "작성");
              }}
            />
          </div>
        </section>
        {isOpen && (
          <div className="Modal_Box">
            <Modal
              handleModal={(modalState) => toggleModal(modalState)}
              status={status}
              setModalSelected={setModalSelected}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default DiaryEditor;
