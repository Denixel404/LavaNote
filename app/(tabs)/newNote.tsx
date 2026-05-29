import { Text, View, TextInput } from "react-native";
import { StyleSheet } from "react-native";
import { useState } from "react";

import Button from "../components/Button";
import { createFile } from "@/src/scripts/fileSystem";

export default function newNote() { // Основное наполнение страницы
  const [noteTitle, setNoteTitle] = useState("");
  const [noteText, setNoteText] = useState("");

  let create = () => {
    if ((noteTitle === "") || (noteText === "")) {
      alert("Поля не должны быть пустыми!");
      return;
    } else if (noteTitle.length > 14) {
      alert("Заголовок слишком длинный!");
      return
    }
    let content = [noteTitle, noteText]
    createFile(`${noteTitle}.txt`, content)
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
        <Button label="Создать!" backgroundColor="#e05807" onPress={create}/>
      </View>
  );
}

const styles = StyleSheet.create({ // Таблица стилей
  container: {
    flex: 1,
    backgroundColor: "#040332",
    alignItems: "center",
    justifyContent: "flex-start",
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
    borderColor: "#e05807",
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
    borderColor: "#e05807",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    marginTop: 20,
    borderRadius: 5,
    color: "white"
  }
})