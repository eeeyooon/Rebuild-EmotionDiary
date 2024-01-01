import React, { useReducer, useRef, useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import New from "./pages/New";
import Diary from "./pages/Diary";
import Edit from "./pages/Edit";
import Login from "./pages/Login";
import { getDiaries } from "./firebase/diaryManager";

import {
  diaryReducer,
  initialState,
  onCreate,
  onRemove,
  onEdit,
} from "./reducer/diaryReducer";

export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

function App() {
  const [data, dispatch] = useReducer(diaryReducer, initialState);
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

  const handleCreate = async (date, content, emotion) => {
    await onCreate(dispatch, dataId, getDiaryList, date, content, emotion);
  };

  const handleRemove = async (targetId) => {
    await onRemove(dispatch, data, getDiaryList, targetId);
  };

  const handleEdit = async (targetId, date, content, emotion) => {
    await onEdit(dispatch, data, targetId, date, content, emotion);
  };

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

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider
        value={{ handleCreate, handleRemove, handleEdit }}
      >
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
