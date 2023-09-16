import React, { useReducer, useRef, useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import New from "./pages/New";
import Diary from "./pages/Diary";
import Edit from "./pages/Edit";

// DB 관련
import { db } from "./firebase/firebaseConfig";
import { collection, getDocs, addDoc } from "firebase/firestore";

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
  // localStorage.setItem("diary", JSON.stringify(newState));
  return newState;
};

export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();

function App() {
  const [data, dispatch] = useReducer(reducer, []);
  const [diary, setDiary] = useState([]);
  const diaryCollectionRef = collection(db, "diary");

  useEffect(() => {
    const getDiary = async () => {
      const diaryData = await getDocs(diaryCollectionRef);
      const dataArray = diaryData.docs.map((doc) => ({
        diaryId: doc.diaryId,
        ...doc.data(),
      }));
      setDiary(dataArray);
    };

    getDiary();
  }, []);

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
      const docRef = await addDoc(diaryCollectionRef, {
        diaryId: dataId.current,
        emotion,
        content,
        date: new Date(date).getTime(),
        user: "userId01",
      });

      const newData = {
        diaryId: docRef.id,
        emotion,
        content,
        date: new Date(date).getTime(),
      };
      dispatch({ type: "CREATE", data: newData });
      dataId.current += 1;
    } catch (error) {
      console.log(error);
    }
  };

  // REMOVE
  const onRemove = (targetId) => {
    dispatch({ type: "REMOVE", targetId });
  };

  // EDIT
  const onEdit = (targetId, date, content, emotion) => {
    dispatch({
      type: "EDIT",
      data: {
        diaryId: targetId,
        emotion,
        date: new Date(date).getTime(),
        content,
      },
    });
  };

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={{ onCreate, onRemove, onEdit }}>
        <BrowserRouter>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
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
