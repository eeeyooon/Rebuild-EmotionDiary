import { db } from "./firebaseConfig";
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

const diaryCollectionRef = collection(db, "diary");

export const getDiaries = async (user) => {
  const diaryData = await getDocs(
    query(diaryCollectionRef, where("user", "==", user))
  );
  return diaryData.docs.map((doc) => ({
    id: doc.id,
    diaryId: doc.diaryId,
    user: doc.user,
    ...doc.data(),
  }));
};

export const createDiary = async (data) => {
  await addDoc(diaryCollectionRef, {
    ...data,
    user: localStorage.getItem("kakao_email"),
  });
};

export const updateDiary = async (id, data) => {
  const docRef = doc(diaryCollectionRef, id);
  await updateDoc(docRef, data);
};

export const deleteDiary = async (id) => {
  await deleteDoc(doc(db, "diary", id));
};
