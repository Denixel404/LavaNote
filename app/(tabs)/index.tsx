/* eslint-disable import/no-unresolved */
import { FlatList, Text, View, TouchableOpacity, Animated } from "react-native";
import { StyleSheet, Alert } from "react-native";
import React, { useEffect, useRef } from "react";
import { useState, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Audio } from "expo-av";

import Button from "../components/Button";
import SmallButton from "../components/SmallButton";
import { getData, deleteFile } from "@/src/scripts/fileSystem";
import { getDisplayDate, stabilizeTitle } from "@/src/scripts/utils";
import { colors } from "@/src/globalVars";

const sec = 1000;

// npx expo start - запуск проекта на локальном  сервере

export default function Index() {
  const nav = useNavigation();
  const [deleteSound, setDeleteSound] = useState(null);
  const [files, setFiles] = useState<File[]>([]);
  //const [isVisible, setVisible] = useState(false);
  const spawnAnimation = useRef(new Animated.Value(-30)).current;
  const opacityAnimation = useRef(new Animated.Value(0)).current;

  const showNote = (note: string) => { // Действия кнопки показа заметки
    nav.navigate("showNote", {filename: note}); // Переадресация с передачей аргумента
  }

  const editNote = (file: string) => { // Действия кнопки редактирования заметки
    nav.navigate("editNote", {filename: file}); // Переадресация с передачей аргумента
  }

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

  useFocusEffect( // Динамическое обновление списка заметок
    useCallback(() => {
      const loadFiles = async () => {
        const loadedFiles = await getData();
        setFiles(loadedFiles);
      };
      loadFiles();
    }, []) // Зависимости
  );
  useEffect(() => {
    spawnAnimation.setValue(-30);
    opacityAnimation.setValue(1);
    Animated.timing(spawnAnimation, {
      toValue: 0,
      duration: sec,
      useNativeDriver: true,
    }).start();
    opacityAnimation.setValue(0);
    Animated.timing(opacityAnimation, {
      toValue: 1,
      duration: sec,
      useNativeDriver: true,
    }).start();
  });

  // const spawnAnimationToggle = () => {
  //   if (isVisible) {
  //     Animated.timing(spawnAnimation, {
  //       toValue: 300,
  //       duration: 500,
  //       useNativeDriver: true,
  //     }).start() 
  //   } else {
  //     Animated.timing(spawnAnimation, {
  //       toValue: 0,
  //       duration: 500,
  //       useNativeDriver: true,
  //     }).start()
  //   };
  //   setVisible(!isVisible);
  // };

  return (
    <View style={styles.container}>

      <FlatList
        data={files}
        keyExtractor={(item) => item.uri} 
        renderItem={({ item }) => (
          <Animated.View style={{ transform: [{translateX: spawnAnimation}], opacity: opacityAnimation }}>
            <TouchableOpacity style={styles.notes} onPress={() => showNote(item.name)}>
              <View style={styles.note}>
                <Text style={styles.note_text}>{stabilizeTitle(item.name)}</Text>
                <Text style={styles.note_text_info}>
                  {getDisplayDate(item.creationTime)}
                </Text>
              </View>
              <View style={styles.notes_btns}>

                <SmallButton name={"edit"} backgroundColor="#f1951d" onPress={() => editNote(item.name)}/>
                <SmallButton name={"trash"} backgroundColor="#e31313" onPress={async () => {
                  Alert.alert(`Вы действительно хотите удалить ${item.name}?`, 
                  "Это действие невозможно отменить", 
                  [
                    {text: "Отмена", style: "cancel"},
                    {text: "Удалить", style: "destructive",
                    onPress: async () => {
                      await deleteFile(item.name);
                      
                      const playDeleteSound = async () => {
                        if (deleteSound) {
                          try {
                            // Перематываем звук в самое начало
                            await deleteSound.setPositionAsync(0);
                            // Запускаем воспроизведение
                            await deleteSound.playAsync();
                          } catch (error) {
                            console.error('Ошибка при воспроизведении:', error);
                          }
                        }
                      };
                      playDeleteSound();
                      const newList = await getData();
                      setFiles(newList);
                    }
                  }]
                  )}} 
                  />
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Здесь пока пусто. Начните работать!</Text>}
      />
      <View style={styles.footerContainer}>
        <Button label="Добавить заметку" backgroundColor={colors.lava} onPress={() => { nav.navigate("newNote") }} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    experimental_backgroundImage: "linear-gradient(#0A0F1A, #341913)"
  },
  notes: {
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
    gap: 47,
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