import { View, Text, StyleSheet, FlatList, Alert } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useState, useCallback, useEffect } from "react";
import { Audio } from "expo-av";

import SmallButton from "../components/SmallButton";
import { colors } from "@/src/globalVars";
import Button from "../components/Button";
import { deleteTask, getTasks, getTaskText, readTask, deleteFolder } from "@/src/scripts/fileSystem";
import { stabilizeTitle, getDisplayDate } from "@/src/scripts/utils";
import { deleteNotification } from "@/src/scripts/notificationsSystem";

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

  useFocusEffect( // Динамическое обновление списка заметок
    useCallback(() => {
      //deleteFolder();
      const loadFiles = async () => {
        const loadedFiles = await getTasks();
        const tasksPromises = loadedFiles.map(async (file) => {
          const task = await readTask(file.name);
          return {
            id: task["id"] || "no id",
            text: task["text"] || "Напоминание",
            date: task["date"] || new Date().toISOString(),
            filename: file.name,
          };
        });
        const loadedTasks = await Promise.all(tasksPromises);
        setTasks(loadedTasks);
      };
      loadFiles();
    }, []) // Зависимости
  );

  useEffect(() => {
      const loadSound = async () => {
        const {sound: loadedSound} = await Audio.Sound.createAsync(require("@/assets/sounds/delete.mp3"));
        setDeleteSound(loadedSound);
      }
      loadSound();
      return () => {
        if (deleteSound) deleteSound.unloadAsync();
      }
    }, []);

  const getInfo = async (filename: string) => {
    const task = await readTask(filename);
    const date = getDisplayDate(Date.parse(task["date"]))
    return `Сработает ${date}`;
  }

  return (
    <View style={styles.container}>
      
    <FlatList 
      data={tasks}
      keyExtractor={(item) => item.filename} 
      renderItem={({ item }) => (
        <View style={styles.notification}>
          <View style={styles.noteInfo}>
            <Text style={styles.text}>{stabilizeTitle(item.text, "task") || "Загрузка..."}</Text>
            <Text style={styles.second_line}>Сработает {getDisplayDate(Date.parse(item.date))}</Text>
          </View>
          <SmallButton name={"trash"} backgroundColor="#e31313" onPress={async () => {
            Alert.alert("Вы точно хотите удалить напомининание?", 
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
                playDeleteSound();
                setTasks(prev => prev.filter(t => t.filename !== item.filename));
              }
            }]
          )}} />
        </View>
      )}
      ListEmptyComponent={<Text style={styles.empty}>Вы ничего не планировали. Создайте новое напоминание!</Text>}
    />
      <View style={styles.admin}>
        <Button label="Добавить напоминание" backgroundColor={colors.lava} onPress={() => { nav.navigate("newTask") }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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