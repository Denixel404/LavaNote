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

export const stabilizeTitle = (title: string) => { // Обрезка длины заголовка
  const max = 16; // максимальная длина с учётом приписки .txt
  const formated_title = title//.replace(".txt", "")
  if (formated_title.length > max) {
    const cutText = formated_title.substring(0, max - 3) + "...";
    return cutText;
  } else {
    return formated_title;
  };
}