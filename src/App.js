import React, { useReducer, useRef, useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import New from "./pages/New";
import Diary from "./pages/Diary";
import Edit from "./pages/Edit";
import Login from "./pages/Login";

// DB 관련
import { db } from "./firebase/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

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
  const [diary, setDiary] = useState([]);
  const diaryCollectionRef = collection(db, "diary");
  const [user, setUser] = useState("");

  useEffect(() => {
    const loginedUser = localStorage.getItem("kakao_email");

    if (loginedUser) {
      setUser(loginedUser);
    }
  }, []);

  const getDiary = async () => {
    const diaryData = await getDocs(
      query(diaryCollectionRef, where("user", "==", user))
    );
    const dataArray = diaryData.docs.map((doc) => ({
      id: doc.id,
      diaryId: doc.diaryId,
      user: doc.user,
      ...doc.data(),
    }));
    setDiary(dataArray);
  };

  useEffect(() => {
    getDiary();
  }, [user]);

  useEffect(() => {
    if (diary) {
      const diaryList = diary.sort(
        (a, b) => parseInt(b.diaryId) - parseInt(a.diaryId)
      );

      if (diaryList.length >= 1) {
        dataId.current = parseInt(diaryList[0].diaryId) + 1;
        dispatch({ type: "INIT", data: diaryList });
      }
    }
  }, [diary]);

  const dataId = useRef(0);

  // CREATE
  const onCreate = async (date, content, emotion) => {
    try {
      await addDoc(diaryCollectionRef, {
        diaryId: dataId.current,
        emotion,
        content,
        date: new Date(date).getTime(),
        user: localStorage.getItem("kakao_email"),
      });

      const newData = {
        diaryId: dataId.current,
        emotion,
        content,
        date: new Date(date).getTime(),
      };
      dispatch({ type: "CREATE", data: newData });
      dataId.current += 1;

      getDiary();
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
      await deleteDoc(doc(db, "diary", targetData.id));

      getDiary();
    } catch (error) {
      console.error(error);
    }
    dispatch({ type: "REMOVE", targetId });
  };

  // EDIT
  const onEdit = async (targetId, date, content, emotion) => {
    try {
      const targetData = data.find((item) => item.diaryId === targetId);

      if (!targetData) {
        console.error("해당 데이터를 찾을 수 없습니다.");
        return;
      }

      const docRef = doc(diaryCollectionRef, targetData.id);

      await updateDoc(docRef, {
        emotion,
        content,
        date: new Date(date).getTime(),
      });

      const updatedData = {
        diaryId: targetId,
        emotion,
        content,
        id: targetData.id,
        date: new Date(date).getTime(),
      };

      dispatch({ type: "EDIT", data: updatedData });
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
