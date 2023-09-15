import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

function DBTest() {
  const [diaryItem, setDiaryItem] = useState({});
  const diaryCollectionRef = collection(db, "diary");

  useEffect(() => {
    const getDiary = async () => {
      const diaryData = await getDocs(diaryCollectionRef);
      const dataArray = diaryData.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDiaryItem(dataArray[0]);
    };

    getDiary();
  }, []);

  return <div>DBTest</div>;
}

export default DBTest;
