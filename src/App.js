import React, { useReducer, useRef, useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import New from "./pages/New";
import Diary from "./pages/Diary";
import Edit from "./pages/Edit";
import Login from "./pages/Login";
import {
  createDiary,
  deleteDiary,
  getDiaries,
  updateDiary,
} from "./firebase/diaryManager";

const reducer = (state, action) => {
  let newState = [];
  switch (action.type) {
    case "INIT": {
      return action.data;
    }
    case "CREATE": {
      newState = [action.data, ...state];
      break;
    }
    case "REMOVE": {
      newState = state.filter((it) => it.diaryId !== action.targetId);
      break;
    }
    case "EDIT": {
      newState = state.map((it) =>
        it.diaryId === action.data.diaryId ? { ...action.data } : it
      );
      break;
    }
    default:
      return state;
  }
  return newState;
};

export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

function App() {
  const [data, dispatch] = useReducer(reducer, []);
  const [diaryList, setDiaryList] = useState([]);
  const [user, setUser] = useState("");

  useEffect(() => {
    const loginedUser = localStorage.getItem("kakao_email");

    if (loginedUser) {
      setUser(loginedUser);
    }
  }, []);

  const getDiaryList = async () => {
    const dataArray = await getDiaries(user);
    setDiaryList(dataArray);
  };

  useEffect(() => {
    getDiaryList();
  }, [user]);

  useEffect(() => {
    if (diaryList) {
      const sortedDiaryList = diaryList.sort(
        (a, b) => parseInt(b.diaryId) - parseInt(a.diaryId)
      );

      if (sortedDiaryList.length >= 1) {
        dataId.current = parseInt(sortedDiaryList[0].diaryId) + 1;
        dispatch({ type: "INIT", data: sortedDiaryList });
      }
    }
  }, [diaryList]);

  const dataId = useRef(0);

  // CREATE
  const onCreate = async (date, content, emotion) => {
    try {
      const newData = {
        diaryId: dataId.current,
        emotion,
        content,
        date: new Date(date).getTime(),
      };

      await createDiary(newData);
      dispatch({ type: "CREATE", data: newData });
      dataId.current += 1;

      getDiaryList();
    } catch (error) {
      console.error(error);
    }
  };

  // REMOVE
  const onRemove = async (targetId) => {
    try {
      const targetData = data.find((item) => item.diaryId === targetId);
      if (!targetData) {
        console.error("해당 데이터를 찾을 수 없습니다.");
        return;
      }

      await deleteDiary(targetData.id);

      dispatch({ type: "REMOVE", targetId });
      getDiaryList();
    } catch (error) {
      console.error(error);
    }
  };

  // EDIT
  const onEdit = async (targetId, date, content, emotion) => {
    try {
      const targetData = data.find((item) => item.diaryId === targetId);

      if (!targetData) {
        console.error("해당 데이터를 찾을 수 없습니다.");
        return;
      }

      const updatedData = {
        emotion,
        content,
        date: new Date(date).getTime(),
      };

      await updateDiary(targetData.id, updatedData);

      dispatch({
        type: "EDIT",
        data: { ...updatedData, diaryId: targetId, id: targetData.id },
      });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={{ onCreate, onRemove, onEdit }}>
        <BrowserRouter>
          <div className="App">
            <Routes>
              <Route path="/" element={<Navigate replace to="/login" />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/new" element={<New />} />
              <Route path="/diary/:diaryId" element={<Diary />} />
              <Route path="/edit/:diaryId" element={<Edit />} />
            </Routes>
          </div>
        </BrowserRouter>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;
