import { sortDiaryList } from "./../utils/sortDiaries";
import { getDiaries } from "../firebase/diaryManager";
import {
  createDiary,
  deleteDiary,
  updateDiary,
} from "../firebase/diaryManager";

export const diaryReducer = (state, action) => {
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

export const initialState = [];

//INIT
export const onInitialize = async (dispatch, user) => {
  const sortedDiaries = await sortDiaryList(user);
  if (sortDiaryList.length > 0) {
    dispatch({ type: "INIT", data: sortedDiaries });
  }
};

// CREATE
export const onCreate = async (
  dispatch,
  user,
  dataId,
  date,
  content,
  emotion
) => {
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

    await getDiaries(user);
  } catch (error) {
    console.error(error);
  }
};

// REMOVE
export const onRemove = async (dispatch, user, data, targetId) => {
  try {
    const targetData = data.find((item) => item.diaryId === targetId);
    if (!targetData) {
      console.error("해당 데이터를 찾을 수 없습니다.");
      return;
    }

    await deleteDiary(targetData.id);

    dispatch({ type: "REMOVE", targetId });
    getDiaries(user);
  } catch (error) {
    console.error(error);
  }
};

// EDIT
export const onEdit = async (
  dispatch,
  data,
  targetId,
  date,
  content,
  emotion
) => {
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
