import React, { useReducer, useEffect, useRef } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import New from "./pages/New";
import Diary from "./pages/Diary";
import Edit from "./pages/Edit";
import Login from "./pages/Login";
import { useAuth } from "./hooks/useAuth";
import {
  diaryReducer,
  initialState,
  onCreate,
  onRemove,
  onEdit,
  onInitialize,
} from "./reducer/diaryReducer";
import { getDiaries } from "./firebase/diaryManager";

export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

function App() {
  const [data, dispatch] = useReducer(diaryReducer, initialState);
  const { user, updateUser } = useAuth();

  const dataIdRef = useRef(0);

  useEffect(() => {
    if (user) {
      onInitialize(dispatch, user);

      getDiaries(user).then((diaries) => {
        if (diaries.length > 0) {
          const maxDataId = Math.max(...diaries.map((diary) => diary.diaryId));
          dataIdRef.current = maxDataId + 1;
        }
      });
    }
  }, [user, dispatch]);

  const handleCreate = async (date, content, emotion) => {
    await onCreate(dispatch, user, dataIdRef.current, date, content, emotion);
    dataIdRef.current += 1;
  };

  const handleRemove = async (targetId, callback) => {
    await onRemove(dispatch, user, data, targetId);
    if (callback) {
      callback();
    }
  };

  const handleEdit = async (targetId, date, content, emotion) => {
    await onEdit(dispatch, data, targetId, date, content, emotion, user);
  };

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
