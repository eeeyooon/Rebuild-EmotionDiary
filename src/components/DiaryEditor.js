import { useNavigate } from "react-router-dom";
import { useState, useRef, useContext, useEffect, useCallback } from "react";
import { DiaryDispatchContext } from "./../App.js";
import { getStringDate } from "../utils/date.js";
import { emotionList } from "../utils/emotion.js";

import MyButton from "./MyButton";
import MyHeader from "./MyHeader";
import EmotionItem from "./EmotionItem";
import Modal from "./Modal";

const DiaryEditor = ({ isEdit, originData }) => {
  const contentRef = useRef();
  const [content, setContent] = useState("");
  const [emotion, setEmotion] = useState(3);
  const [date, setDate] = useState(getStringDate(new Date()));
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [modalStatus, setModalStatus] = useState("");
  const [modalCheck, setModalCheck] = useState(false);

  const { handleCreate, handleEdit, handleRemove } =
    useContext(DiaryDispatchContext);
  const handleClickEmote = useCallback((emotion) => {
    setEmotion(emotion);
  }, []);

  const handleModal = (modalState) => {
    setOpenModal(modalState);
  };

  const handleSubmit = () => {
    if (content.legth < 1) {
      contentRef.current.focus();
      return;
    }

    if (modalCheck) {
      if (!isEdit) {
        handleCreate(date, content, emotion);
        setModalCheck(false);
      } else {
        handleEdit(originData.diaryId, date, content, emotion);
        setModalCheck(false);
      }
    }
    navigate("/home", { replace: true });
  };

  useEffect(() => {
    if (modalCheck) {
      if (modalStatus === "수정" || modalStatus === "작성") {
        handleSubmit();
      } else if (modalStatus === "삭제") {
        handleDiaryRemove();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalCheck, modalStatus]);

  const handleDiaryRemove = () => {
    if (modalCheck) {
      handleRemove(originData.diaryId, () => {
        navigate("/home", { replace: true });
      });
      setModalCheck(false);
    }
  };

  useEffect(() => {
    if (isEdit) {
      setDate(getStringDate(new Date(parseInt(originData.date))));
      setEmotion(originData.emotion);
      setContent(originData.content);
    }
  }, [isEdit, originData]);

  return (
    <>
      {openModal && (
        <div className="Modal_Background" onClick={() => setOpenModal(false)} />
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
                  setOpenModal(true);
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
                setOpenModal(true);
                setModalStatus(isEdit ? "수정" : "작성");
              }}
            />
          </div>
        </section>
        {openModal && (
          <div className="Modal_Box">
            <Modal
              handleModal={handleModal}
              modalStatus={modalStatus}
              setModalCheck={setModalCheck}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default DiaryEditor;
