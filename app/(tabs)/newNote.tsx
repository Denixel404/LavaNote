import { Text, View, TextInput, useWindowDimensions } from "react-native";
import { StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useState, useEffect, useCallback } from "react";
import { Audio } from "expo-av";
import { Picker } from "@react-native-picker/picker";

import Button from "../components/Button";
import { createFile, readDataFile } from "@/src/scripts/fileSystem";
import { colors, bigDisplay } from "@/src/globalVars"; 
import { splitCategories } from "@/src/scripts/utils";

export default function newNote() { // Основное наполнение страницы
  const [noteTitle, setNoteTitle] = useState("");
  const [noteText, setNoteText] = useState("");
  const [addSound, setAddSound] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("--- Не выбрано ---");

  const { width } = useWindowDimensions();
  const adaptiveStyle = {
    input_text: {
      height: width > bigDisplay? 400 : 200,
      width: width > bigDisplay? 500 : 300,
      borderColor: colors.lava,
      borderWidth: 1,
      paddingHorizontal: 10,
      marginBottom: width > bigDisplay? 60 : 0,
      marginTop: 20,
      borderRadius: 5,
      color: "white",
      textAlignVertical: "top",
      fontSize: width > bigDisplay? 22 : 15,
    },
    input_title: {
      height: width > bigDisplay? 60 : 40,
      width: width > bigDisplay? 500 : 300,
      borderColor: colors.lava,
      borderWidth: 1,
      paddingHorizontal: 10,
      marginBottom: 20,
      marginTop: 20,
      borderRadius: 5,
      color: "white",
      fontSize: width > bigDisplay? 22 : 15,
    },
    text: {
      color: "#fff",
      fontSize: 18,
      marginTop: 30,
      textAlign: "center"
    },
    title: {
      color: "white",
      fontSize: width > bigDisplay? 26 : 24,
    },
    button: {
      marginTop: 30,
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
    }
  }

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

  useFocusEffect( // Чтение и обновление списка категорий
    useCallback(() => {
      const loadCategories = async () => {
        const loadedCategories = await readDataFile("categories.txt");
        const massive = splitCategories(loadedCategories);
        setAllCategories(massive);
      };
      loadCategories();
    }, []) // Зависимости
  );

  const create = async () => { // Создание файла заметки
    if ((noteTitle === "") || (noteText === "")) { // Валидация
      alert("Поля не должны быть пустыми!");
      return;
    };
    
    let content = [noteTitle, noteText]
    createFile(`${noteTitle}.json`, content, selectedCategory)
    // Функция для проигрывания звука
    const playAddSound = async () => { 
      if (addSound) {
        try {
          // Перематываем звук в самое начало
          await addSound.setPositionAsync(0);
          // Запускаем воспроизведение
          await addSound.playAsync();
        } catch (error) {
          console.error('Sound error:', error);
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
        <Text style={styles.title, adaptiveStyle.title}>Создайте новую заметку</Text>
        <TextInput 
          style={styles.input_title, adaptiveStyle.input_title}
          placeholder="Введите здесь имя заметки"
          placeholderTextColor={colors.secondtext}
          value={noteTitle}
          onChangeText={text => setNoteTitle(text)}
        />
        <TextInput 
          style={styles.input_text, adaptiveStyle.input_text}
          multiline={true}
          scrollEnabled={true}
          placeholder="А здесь напишите её текст"
          placeholderTextColor={colors.secondtext}
          value={noteText}
          onChangeText={text => setNoteText(text)}
        />
        <Text style={adaptiveStyle.text}>Выберите категорию для заметки</Text>
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
        <View style={adaptiveStyle.button}>
          <Button label="Создать!" backgroundColor={colors.lava} onPress={create}/>
        </View>
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