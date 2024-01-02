export const getStringDate = (date) => {
  let year = date.getFullYear();

  let month = date.getMonth() + 1;

  let day = date.getDate();

  if (month < 10) {
    month = `0${month}`;
  }

  if (day < 10) {
    day = `0${day}`;
  }

  return `${year}-${month}-${day}`;
};

export const increaseMonth = (currentDate) => {
  return new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    currentDate.getDate()
  );
};

export const decreaseMonth = (currentDate) => {
  return new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    currentDate.getDate()
  );
};

export const filterDiariesByMonth = (diaryList, curDate) => {
  const firstDay = new Date(
    curDate.getFullYear(),
    curDate.getMonth(),
    1
  ).getTime();
  const lastDay = new Date(
    curDate.getFullYear(),
    curDate.getMonth() + 1,
    0,
    23,
    59,
    59
  ).getTime();

  return diaryList.filter(
    (diary) => firstDay <= diary.date && diary.date <= lastDay
  );
};
