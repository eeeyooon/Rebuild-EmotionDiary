import React, { useReducer, useRef, useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import New from "./pages/New";
import Diary from "./pages/Diary";
import Edit from "./pages/Edit";
import Login from "./pages/Login";
import { useAuth } from "./hooks/useAuth";
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

  const { user, updateUser } = useAuth();

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
              <Route
                path="/"
                element={<Navigate replace to={user ? "/home" : "/login"} />}
              />
              <Route
                path="/home"
                element={user ? <Home /> : <Navigate replace to="/login" />}
              />
              <Route path="/login" element={<Login setUser={updateUser} />} />
              <Route
                path="/new"
                element={user ? <New /> : <Navigate replace to="/login" />}
              />
              <Route
                path="/diary/:diaryId"
                element={user ? <Diary /> : <Navigate replace to="/login" />}
              />
              <Route
                path="/edit/:diaryId"
                element={user ? <Edit /> : <Navigate replace to="/login" />}
              />
            </Routes>
          </div>
        </BrowserRouter>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;
