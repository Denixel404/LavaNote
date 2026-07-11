import { Text, View, TextInput, useWindowDimensions } from "react-native";
import { StyleSheet } from "react-native";
import { useState, useCallback } from "react";
import { useLocalSearchParams } from "expo-router";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

import Button from "../components/Button";
import { writeFile, readFile, renameFile, readDataFile, writeDataFile } from "@/src/scripts/fileSystem";
import { colors, bigDisplay } from "@/src/globalVars";
import { splitCategories } from "@/src/scripts/utils";

export default function editNote() { // Основное наполнение страницы
  const [noteTitle, setNoteTitle] = useState("");
  const [noteText, setNoteText] = useState("");
  const [old_title, setOldTitle] = useState(noteText);
  const [note, setNote] = useState<Record<string, string>>({});
  const [selectedCategory, setSelectedCategory] = useState("--- Не выбрано ---");
  const [allCategories, setAllCategories] = useState([]);
  const { filename } = useLocalSearchParams();
  const expansion = filename.slice(-4); // Расширение файла
  // ".txt" - для старых версий приложения до версии 2.х.х
  // "json" - новый формат заметок после версии 2.х.х
  const { width } = useWindowDimensions();
  const adaptiveStyle = {
    title: {
    color: "white",
    fontSize: 24,
    },
    text: {
      color: "#fff",
      fontSize: width > bigDisplay? 26 : 18,
      marginTop: 10,
      textAlign: "center"
    },
    input_text: {
      height: width > bigDisplay? 400 : 200,
      width: width > bigDisplay? 500 : 300,
      borderColor: colors.lava,
      borderWidth: 1,
      paddingHorizontal: 10,
      marginBottom: width > bigDisplay? 80 : 20,
      marginTop: 20,
      borderRadius: 5,
      color: "white",
      textAlignVertical: "top",
      fontSize: width > bigDisplay? 22 : 15
    },
    input_title: {
      height: width > bigDisplay? 50 : 40,
      width: width > bigDisplay? 500 : 300,
      borderColor: "#e05807",
      borderWidth: 1,
      paddingHorizontal: 10,
      marginBottom: 20,
      marginTop: 20,
      borderRadius: 5,
      color: "white",
      fontSize: width > bigDisplay? 22 : 15,
    },
    fall_list: {
      color: colors.white,
      height: 75,
      width: "90%",
    },
    category: {
      borderWidth: 2,
      borderColor: colors.lava,
      width: "87%",
      height: 50,
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 10,
      marginBottom: 30,
    },
  };

  const nav = useNavigation(); // навигация по страницам

  useFocusEffect( // Перерендеринг страницы в случае открытия редактора для другой заметки
    useCallback(() => {
      const load = async () => {
        const content = await readFile(filename); // Получение данных из файла
        const norm_content = JSON.parse(content); // Перевод данных в массив
        if (expansion === "json") { setNote(norm_content); console.log(`Load JSON: ${note}`)}
        //console.log(`LOAD:\n${content}\n from ${filename}`);
        if (expansion == ".txt") { // Парсинг старого формата в txt 
          let structure = content.split('\n');
          setNoteTitle(structure[0]);
          setOldTitle(structure[0]);

          structure.splice(0, 1);
          setNoteText(structure.join('\n'));
        } else if (expansion === "json") { // Получение данных согласно новому формату заметок
          setNoteTitle(norm_content["title"]);
          setNoteText(norm_content["text"]);
          setSelectedCategory(norm_content["category"]);
        }

        const loadedCategories = await readDataFile("categories.txt");
        setAllCategories(splitCategories(loadedCategories));
      }; 
      load()}, 
    [filename]) // Зависимость от изменяемой переменной
  );

  const edit = async () => { // Сохранение изменений
    if ((noteTitle === "") || (noteText === "")) { // Валидация данных
      alert("Поля не должны быть пустыми!");
      return;
    }
    if (expansion === ".txt") { // Перевод в новый формат данных для работы с json 
      let content = {"title": noteTitle, "text": noteText, "category": [selectedCategory]}
      await writeFile(filename, JSON.stringify(content)); // Перезапись файла
      await renameFile(filename, `${noteTitle}.json`); // Смена расширения на удобное
    } else if (expansion === "json") {
      const updatedNote = {...note, "title": noteTitle, "text": noteText, "category": [selectedCategory]}; // Обновлённый массив
      //console.log(`after ${note}`);
      await writeFile(filename, JSON.stringify(updatedNote)); // Сохранение изменений в json
      if (old_title != noteTitle) {await renameFile(filename, `${noteTitle}.json`)};
    }
    nav.navigate("index"); // Переадресация обратно
  }   

  return (
      <View style={styles.container}>
        <Text style={styles.text, adaptiveStyle.text}>Смените заголовок</Text>
        <TextInput 
          style={styles.input_title, adaptiveStyle.input_title}
          placeholder="Место для заголовка"
          placeholderTextColor="white"
          value={noteTitle}
          onChangeText={text => setNoteTitle(text)}
        />
        <Text style={styles.text, adaptiveStyle.text}>Измените старый текст</Text>
        <TextInput 
          style={styles.input_text, adaptiveStyle.input_text}
          multiline={true}
          scrollEnabled={true}
          placeholder="Текст заметки"
          placeholderTextColor="white"
          value={noteText}
          onChangeText={text => setNoteText(text)}
        />
        <Text style={adaptiveStyle.text}>Смените категорию</Text>
        <View style={adaptiveStyle.category}>
          <Picker
            selectedValue={selectedCategory}
            onValueChange={(selection) => setSelectedCategory(selection)}
            style={adaptiveStyle.fall_list}
          >
            <Picker.Item label="--- Не выбрано ---" value="--- Не выбрано ---" />
            {
              allCategories.map((category) => (
                <Picker.Item key={category} label={category} value={category} />
              ))
            }
          </Picker>
        </View>
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
  },
})