import { Text, View, TextInput } from "react-native";
import { StyleSheet } from "react-native";
import { useState } from "react";
import { useAudioPlayer } from "expo-audio";

import Button from "../components/Button";
import { createFile } from "@/src/scripts/fileSystem";
import { colors } from "@/src/globalVars"; 

const addSound = require("@/assets/sounds/add.mp3");

export default function newNote() { // Основное наполнение страницы
  const [noteTitle, setNoteTitle] = useState("");
  const [noteText, setNoteText] = useState("");
  const player = useAudioPlayer(addSound);

  let create = () => { // Создание файла заметки
    if ((noteTitle === "") || (noteText === "")) {
      alert("Поля не должны быть пустыми!");
      return;
    } else if (noteTitle.length > 14) {
      alert("Заголовок слишком длинный!");
      return
    }
    let content = [noteTitle, noteText]
    createFile(`${noteTitle}.txt`, content)
    player.seekTo(0);
    player.play();
  }   

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Создайте новую заметку</Text>
        <Text style={styles.text}>1. Подберите идеальный заголовок</Text>
        <TextInput 
          style={styles.input_title}
          placeholder="Место для заголовка"
          placeholderTextColor="white"
          value={noteTitle}
          onChangeText={text => setNoteTitle(text)}
        />
        <Text style={styles.text}>2. Опишите свои мысли</Text>
        <TextInput 
          style={styles.input_text}
          multiline={true}
          scrollEnabled={true}
          placeholder="Текст заметки"
          placeholderTextColor="white"
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