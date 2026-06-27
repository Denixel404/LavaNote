import { View, Text, StyleSheet, FlatList, Alert, useWindowDimensions } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useState, useCallback, useEffect } from "react";
import { Audio } from "expo-av";

import SmallButton from "../components/SmallButton";
import { colors, bigDisplay } from "@/src/globalVars";
import Button from "../components/Button";
import { deleteTask, getTasks, getTaskText, readTask, deleteFolder } from "@/src/scripts/fileSystem";
import { stabilizeTitle, getDisplayDate } from "@/src/scripts/utils";
import { deleteNotification } from "@/src/scripts/notificationsSystem";
// Объект напоминания
type taskData = {
    id: string;
    text: string;
    date: string;
    filename: string;
  };

export default function tasks_index() {
  const nav = useNavigation();
  const [deleteSound, setDeleteSound] = useState(null);
  const [tasks, setTasks] = useState<taskData[]>([]);
  const { width } = useWindowDimensions();
  const adaptiveStyles = {
    empty: {
      color: "white",
      textAlign: "center",
      marginTop: "50%",
      marginRight: "3%",
      marginLeft: "3%",
      fontSize: width > bigDisplay? 22 : 18,
    },
    notification: {
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.06)",
      backdropFilter: "blur(10px)",
      flex: 2,
      flexDirection: "row",
      borderWidth: 2,
      borderColor: colors.lava,
      borderRadius: 15,
      padding: 20,
      width: width > bigDisplay? 400 : 325,
      height: width > bigDisplay? 110 : 85,
      marginBottom: 5,
      marginTop: 5,
      gap: width > bigDisplay? 35 : 50,
    },
    noteInfo: {
      // Блок текста с информацией
    },
    second_line: {
      color: colors.secondtext,
      fontSize: width > bigDisplay? 20 : 13,
    },
    text: {
      color: colors.white,
      fontSize: width > bigDisplay? 22 : 15,
    },
  }

  useFocusEffect( // Динамическое обновление списка заметок
    useCallback(() => {
      //deleteFolder();
      const loadFiles = async () => {
        const loadedFiles = await getTasks();
        const tasksPromises = loadedFiles.map(async (file) => { // Загрузка данных из файлов
          const task = await readTask(file.name);
          const taskDate = Date.parse(task["date"]);
          if (taskDate < Date.now()) { // Удаление файла с информацией для просроченных уведомлений
            await deleteTask(file.name); // Удаляем файл
            await deleteNotification(task["id"]); // Отменяем уведомление (на всякий случай)
            return undefined;
          }
          return { // Структура 1 напоминания для Flatlist
            id: task["id"] || "no id",
            text: task["text"] || "Напоминание",
            date: task["date"] || new Date().toISOString(),
            filename: file.name,
          };
        });
        const loadedTasks = (await Promise.all(tasksPromises)).filter(task => task !== undefined); // Фильтруем список файлов, чтобы не было undefined
        setTasks(loadedTasks);
      };
      loadFiles();
    }, []) // Зависимости
  );

  useEffect(() => { // Звуки
      const loadSound = async () => {
        const {sound: loadedSound} = await Audio.Sound.createAsync(require("@/assets/sounds/delete.mp3"));
        setDeleteSound(loadedSound);
      }
      loadSound();
      return () => {
        if (deleteSound) deleteSound.unloadAsync();
      }
    }, []);

  return (
    <View style={styles.container}>
      
    <FlatList // Динамический список напоминаний
      data={tasks}
      keyExtractor={(item) => item.filename} 
      renderItem={({ item }) => (
        <View style={styles.notification, adaptiveStyles.notification}>
          <View style={styles.noteInfo}>
            <Text style={styles.text, adaptiveStyles.text}>{stabilizeTitle(item.text, "task") || "Загрузка..."}</Text>
            <Text style={styles.second_line, adaptiveStyles.second_line}>Сработает {getDisplayDate(Date.parse(item.date))}</Text>
          </View>
          <SmallButton name={"trash"} backgroundColor="#e31313" onPress={async () => { // Удалить файл напоминания
            Alert.alert("Вы точно хотите удалить напомининание?", // Всплывающее окно с подтверждением 
            "Это действие невозможно отменить. Делайте это только с уже прозвучавшими напоминаниями или с теми, которые хотите отменить навсегда.", 
            [
              {text: "Отмена", style: "cancel"},
              {text: "Удалить", style: "destructive",
              onPress: async () => {
                await deleteNotification(item.id);
                await deleteTask(item.filename);
                
                const playDeleteSound = async () => {
                  if (deleteSound) {
                    try {
                      // Перематываем звук в самое начало
                      await deleteSound.setPositionAsync(0);
                      // Запускаем воспроизведение
                      await deleteSound.playAsync();
                    } catch (error) {
                      console.error('Ошибка при воспроизведении: ', error);
                    }
                  }
                };
                playDeleteSound(); // Проигрываем звук
                setTasks(prev => prev.filter(t => t.filename !== item.filename)); // Обновляем список
              }
            }]
          )}} />
        </View>
      )}
      ListEmptyComponent={<Text style={styles.empty, adaptiveStyles.empty}>Вы ничего не планировали. Создайте новое напоминание!</Text>}
    />
      <View style={styles.admin}>
        <Button label="Добавить напоминание" backgroundColor={colors.lava} onPress={() => { nav.navigate("newTask") }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({ // Таблица стилей
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    experimental_backgroundImage: "linear-gradient(#0A0F1A, #341913)"
  },
  notification: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    backdropFilter: "blur(10px)",
    flex: 2,
    flexDirection: "row",
    borderWidth: 2,
    borderColor: colors.lava,
    borderRadius: 15,
    padding: 20,
    width: 325,
    marginBottom: 5,
    marginTop: 5,
    gap: 30,
  },
  noteInfo: {
    // Блок текмта с информацией
  },
  second_line: {
    color: colors.secondtext
  },
    admin: {
      marginBottom: 50,
  },
  text: {
    color: colors.white
  },
  empty: {
    color: "white",
    textAlign: "center",
    marginTop: "50%",
    marginRight: "3%",
    marginLeft: "3%",
    fontSize: 18,
  },
})