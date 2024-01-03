export const getProcessedDiaryList = (diaryList, filter, sortType) => {
  const filterCallback = (item) => {
    if (filter === "good") {
      return parseInt(item.emotion) <= 3;
    } else {
      return parseInt(item.emotion) > 3;
    }
  };

  const compare = (a, b) => {
    const dateSortBA = parseInt(b.date) - parseInt(a.date);
    const dateSortAB = parseInt(a.date) - parseInt(b.date);
    if (sortType === "latest") {
      return dateSortBA === 0
        ? parseInt(b.diaryId) - parseInt(a.diaryId)
        : dateSortBA;
    } else {
      return dateSortAB === 0
        ? parseInt(a.diaryId) - parseInt(b.diaryId)
        : dateSortAB;
    }
  };

  const copyList = JSON.parse(JSON.stringify(diaryList));

  const filteredList =
    filter === "all" ? copyList : copyList.filter((it) => filterCallback(it));

  const sortedList = filteredList.sort(compare);
  return sortedList;
};
