
export const getDisplayDate = (timestamp: number) => {
  if (!timestamp) return 'Дата неизвестна';
  // Определяем систему: если число больше 10^11 (100 миллиардов), значит это миллисекунды
  const isMilliseconds = timestamp > 100000000000;
  // Создаем объект Date, корректно обрабатывая миллисекунды или секунды
  const date = new Date(isMilliseconds ? timestamp : timestamp * 1000);
  // Проверяем, что дата валидна
  if (isNaN(date.getTime())) return 'Некорректная дата';
  // Выдаём корректную дату
  return date.toLocaleString('ru-RU', { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
};

export const stabilizeTitle = (title: any, mode="null") => { // Обрезка длины заголовка
  try {
    if ((title == undefined) || (title == null)) return "Ошибка загрузки";
    let max = 16; // максимальная длина с учётом приписки .txt
    if (mode == "task")  max = 24; 
    const formated_title = title.replace(".json", "");
    if (formated_title.length > max) {
      const cutText = formated_title.substring(0, max - 3) + "...";
      return cutText;
    } else {
      return formated_title;
    };
  } catch (error) {
    console.error(`Title not stabilized: ${error}`);
    return "Ошибка загрузки";
  }
}

export const checkZero = (num: number) => { // Добавление нуля к формату даты
  if (num < 10) return `0${num}`
  else return num;
}

export const splitCategories = (categoriesStroke: string) => { // Разбивка файла с категориями на массив с элементами
  let massive = undefined;
  try {
    massive = categoriesStroke.split(",").map(category => category.trim());
  } catch (error) {
    console.error(`Categories error: ${error}`);
  }
  return massive;
}

export const getRandInt = (minInt: number, maxInt: number) => {
  const min = Math.ceil(minInt);
  const max = Math.floor(maxInt);
  return Math.floor(Math.random() * (max - min + 1) + min);
}
