export const getDisplayDate = (timestamp: number) => {
  if (!timestamp) return 'Дата неизвестна';
  // Определяем систему: если число больше 10^11 (100 миллиардов), значит это миллисекунды
  const isMilliseconds = timestamp > 100000000000;
  // Создаем объект Date, корректно обрабатывая миллисекунды или секунды
  const date = new Date(isMilliseconds ? timestamp : timestamp * 1000);
  // Проверяем, что дата валидна
  if (isNaN(date.getTime())) return 'Некорректная дата';
  return date.toLocaleString('ru-RU');
};