import { Text, View, TextInput } from "react-native";
import { StyleSheet } from "react-native";
import { useState, useCallback } from "react";
import { useLocalSearchParams } from "expo-router";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import Button from "../components/Button";
import { writeFile, readFile, renameFile } from "@/src/scripts/fileSystem";
import { colors } from "@/src/globalVars";

export default function editNote() { // Основное наполнение страницы
  const [noteTitle, setNoteTitle] = useState("");
  const [noteText, setNoteText] = useState("");
  const [old_title, setOldTitle] = useState(noteText);
  const { filename } = useLocalSearchParams();

  const nav = useNavigation();

  useFocusEffect( // Перерендеринг страницы в случае открытия редактора для другой заметки
    useCallback(() => {
      const load = async () => {
        const content = await readFile(filename);
        //console.log(`LOAD:\n${content}\n from ${filename}`);
        let structure = content.split('\n');
        setNoteTitle(structure[0]);
        setOldTitle(structure[0]);

        structure.splice(0, 1);
        setNoteText(structure.join('\n'));
      }; 
      load()}, 
    [filename]) // Зависимость от изменяемой переменной
  );

  const edit = async () => { // Сохранение изменений
    if ((noteTitle === "") || (noteText === "")) { // Валидация данных
      alert("Поля не должны быть пустыми!");
      return;
    }
    let content = `${noteTitle}\n${noteText}`
    await writeFile(filename, content); // Перезапись файла
    if (!(noteTitle === old_title)) await renameFile(filename, `${noteTitle}.txt`); // Проверка на изменение имени файла
    nav.navigate("index");
  }   

  return (
      <View style={styles.container}>
        <Text style={styles.text}>Смените заголовок</Text>
        <TextInput 
          style={styles.input_title}
          placeholder="Место для заголовка"
          placeholderTextColor="white"
          value={noteTitle}
          onChangeText={text => setNoteTitle(text)}
        />
        <Text style={styles.text}>Измените старый текст</Text>
        <TextInput 
          style={styles.input_text}
          multiline={true}
          scrollEnabled={true}
          placeholder="Текст заметки"
          placeholderTextColor="white"
          value={noteText}
          onChangeText={text => setNoteText(text)}
        />
        <Button label="Сохранить" backgroundColor={colors.lava} onPress={edit}/>
      </View>
  );
}

const styles = StyleSheet.create({ // Таблица стилей
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "flex-start",
    experimental_backgroundImage: "linear-gradient(#0A0F1A, #341913)",
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
    borderColor: "#e05807",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    marginTop: 20,
    borderRadius: 5,
    color: "white"
  }
})