import React, { useState } from "react";
import MyButton from "./MyButton";
import { useNavigate } from "react-router-dom";
import DiaryItem from "./DiaryItem";
import { sortOptionList, filterOptionList } from "../const/options";
import { getProcessedDiaryList } from "../utils/filtersortList";
import ControlMenu from "./ControlMenu";

const DiaryList = ({ diaryList }) => {
  const navigate = useNavigate();
  const [sortType, setSortType] = useState("latest");
  const [filter, setFilter] = useState("all");
  const processedDiaryList = getProcessedDiaryList(diaryList, filter, sortType);

  return (
    <div className="DiaryList">
      <div className="menu_wrapper">
        <div className="left-col">
          <ControlMenu
            value={sortType}
            onChange={setSortType}
            optionList={sortOptionList}
          />
          <ControlMenu
            value={filter}
            onChange={setFilter}
            optionList={filterOptionList}
          />
        </div>
        <div className="right-col">
          <MyButton
            type={"positive"}
            text={"새 일기쓰기"}
            onClick={() => navigate("/new")}
          />
        </div>
      </div>

      {processedDiaryList.map((it) => (
        <DiaryItem key={it.diaryId} {...it} />
      ))}
    </div>
  );
};

DiaryList.defaultProps = {
  diaryList: [],
};

export default DiaryList;
