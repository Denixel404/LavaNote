import { Text, View, TextInput } from "react-native";
import { StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { Audio } from "expo-av";

import Button from "../components/Button";
import { createFile } from "@/src/scripts/fileSystem";
import { colors } from "@/src/globalVars"; 

export default function newNote() { // Основное наполнение страницы
  const [noteTitle, setNoteTitle] = useState("");
  const [noteText, setNoteText] = useState("");
  const [addSound, setAddSound] = useState(null);

  useEffect(() => { // Загрузка звуков
      const loadSound = async () => {
        const {sound: loadedSound} = await Audio.Sound.createAsync(require("@/assets/sounds/add.mp3"));
        setAddSound(loadedSound);
      }
      loadSound();
      return () => {
        if (addSound) addSound.unloadAsync();
      }
    }, []);

  let create = async () => { // Создание файла заметки
    if ((noteTitle === "") || (noteText === "")) { // Валидация
      alert("Поля не должны быть пустыми!");
      return;
    };
    
    let content = [noteTitle, noteText]
    createFile(`${noteTitle}.json`, content)
    // Функция для проигрывания звука
    const playAddSound = async () => { 
      if (addSound) {
        try {
          // Перематываем звук в самое начало
          await addSound.setPositionAsync(0);
          // Запускаем воспроизведение
          await addSound.playAsync();
        } catch (error) {
          console.error('Ошибка при воспроизведении:', error);
        }
      }
    };
    playAddSound(); // Проиграть звук
    // Очистка
    setNoteTitle("");
    setNoteText("");
  }   

  return ( // Страница
      <View style={styles.container}>
        <Text style={styles.title}>Создайте новую заметку</Text>
        <TextInput 
          style={styles.input_title}
          placeholder="Введите здесь имя заметки"
          placeholderTextColor={colors.secondtext}
          value={noteTitle}
          onChangeText={text => setNoteTitle(text)}
        />
        <TextInput 
          style={styles.input_text}
          multiline={true}
          scrollEnabled={true}
          placeholder="А здесь напишите её текст"
          placeholderTextColor={colors.secondtext}
          value={noteText}
          onChangeText={text => setNoteText(text)}
        />
        <Button label="Создать!" backgroundColor={colors.lava} onPress={create}/>
      </View>
  );
}

const styles = StyleSheet.create({ // Таблица стилей
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "flex-start",
    experimental_backgroundImage: "linear-gradient(#0A0F1A, #341913)"
  },
  title: {
    color: "white",
    fontSize: 24,
  },
  text: {
    color: "#fff",
    fontSize: 18,
    marginTop: 30,
    textAlign: "center"
  },
  input_text: {
    height: 200,
    width: 300,
    borderColor: colors.lava,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    marginTop: 20,
    borderRadius: 5,
    color: "white",
    textAlignVertical: "top"
  },
  input_title: {
    height: 40,
    width: 300,
    borderColor: colors.lava,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    marginTop: 20,
    borderRadius: 5,
    color: "white"
  }
})