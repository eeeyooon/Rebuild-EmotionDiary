import React, { useReducer, useEffect, useState } from "react";
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

export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

function App() {
  const [data, dispatch] = useReducer(diaryReducer, initialState);
  const { user, updateUser } = useAuth();
  const [dataId, setDataId] = useState(0);

  useEffect(() => {
    if (user) {
      onInitialize(dispatch, user, setDataId);
    }
  }, [user, dispatch]);

  const handleCreate = async (date, content, emotion) => {
    await onCreate(dispatch, user, dataId, date, content, emotion, setDataId);
  };

  const handleRemove = async (targetId) => {
    await onRemove(dispatch, user, data, targetId);
  };

  const handleEdit = async (targetId, date, content, emotion) => {
    await onEdit(dispatch, data, targetId, date, content, emotion);
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
