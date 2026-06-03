/* eslint-disable import/no-unresolved */
import { FlatList, Text, View } from "react-native";
import { StyleSheet, Alert } from "react-native";
import React from "react";
import { useState, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import Button from "../components/Button";
import SmallButton from "../components/SmallButton";
import { getData, deleteFile } from "@/src/scripts/fileSystem";
import { getDisplayDate } from "@/src/scripts/utils";

// npx expo start - запуск проекта на локальном  сервере

export default function Index() {
  const nav = useNavigation();
  const [files, setFiles] = useState<File[]>([]);

  const showNote = (note: string) => { // Действия кнопки показа заметки
    nav.navigate("showNote", {filename: note}); // Переадресация с передачей аргумента
  }

  const editNote = (file: string) => { // Действия кнопки редактирования заметки
    nav.navigate("editNote", {filename: file}); // Переадресация с передачей аргумента
  }


  useFocusEffect( // Динамическое обновление списка заметок
    useCallback(() => {
      const loadFiles = async () => {
        const loadedFiles = await getData();
        setFiles(loadedFiles);
      };
      loadFiles();
    }, []) // Зависимости
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={files}
        keyExtractor={(item) => item.uri} 
        renderItem={({ item }) => (
          <View style={styles.notes}>
            <View style={styles.note}>
              <Text style={styles.note_text}>{item.name}</Text>
              <Text style={styles.note_text_info}>
                {getDisplayDate(item.creationTime)}
              </Text>
            </View>
            <View style={styles.notes_btns}>

              <SmallButton name={"trash"} backgroundColor="red" onPress={async () => {
                Alert.alert(`Вы действительно хотите удалить ${item.name}?`, 
                "Это действие невозможно отменить", 
                [
                  {text: "Отмена", style: "cancel"},
                  {text: "Удалить", style: "destructive",
                  onPress: async () => {
                    await deleteFile(item.name);
                    const newList = await getData();
                    setFiles(newList);
                  }
                }]
                )}} 
                />

              <SmallButton name={"eye"} backgroundColor="gray" onPress={() => showNote(item.name) } />
              <SmallButton name={"edit"} backgroundColor="#ecb40b" onPress={() => editNote(item.name)}/>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Здесь пока пусто. Начните работать!</Text>}
      />
      <View style={styles.footerContainer}>
        <Button label="Добавить заметку" backgroundColor="#e05807" onPress={() => { nav.navigate("newNote") }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#040332",
    alignItems: "center",
    justifyContent: "center",
  },
  notes: {
    flex: 2,
    flexDirection: "row",
    borderWidth: 2,
    borderColor: "#ed8143",
    borderRadius: 5,
    padding: 20,
    width: 325,
    marginBottom: 5,
    marginTop: 5,
    gap: 20,
  },
  note: {
    // Стили для кнопок
  },
  notes_btns: {
    flexDirection: "row",
    width: "50%",
  },
  note_text: {
    color: "white",
    width: "100%"
  },
  note_text_info: {
    color: "#a8a8a8",
    width: "100%"
  },
  text: {
    color: "#fff",
  },
  empty: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    marginTop: 100,
  },
  sett_btn: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#fff"
  },
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 50
  },
})