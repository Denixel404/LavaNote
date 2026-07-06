/* eslint-disable import/no-unresolved */
import { FlatList, Text, View, TouchableOpacity, Animated, useWindowDimensions, TextInput } from "react-native";
import { StyleSheet, Alert } from "react-native";
import React, { useEffect, useRef } from "react";
import { useState, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Audio } from "expo-av";
import * as notifications from "expo-notifications";

import Button from "../components/Button";
import SmallButton from "../components/SmallButton";
import { getData, deleteFile, fileSystemInit } from "@/src/scripts/fileSystem";
import { getDisplayDate, stabilizeTitle } from "@/src/scripts/utils";
import { colors, bigDisplay } from "@/src/globalVars";

const sec = 1000;

// npx expo start - запуск проекта на локальном  сервере
// npx expo run:android - запуск на андроид

export default function Index() {
  const nav = useNavigation();
  const [deleteSound, setDeleteSound] = useState(null);
  const [files, setFiles] = useState<File[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<File[]>([]);
  const [accept_fileInit, setAccept_fileInit] = useState(true);
  //const [isVisible, setVisible] = useState(false);
  const spawnAnimation = useRef(new Animated.Value(-30)).current;
  const opacityAnimation = useRef(new Animated.Value(0)).current;
  const [searchValue, setSearchValue] = useState("");

  const { width } = useWindowDimensions();
  const adaptiveStyle = {
    note: {
      backgroundColor: "rgba(255, 255, 255, 0.06)",
      backdropFilter: "blur(10px)",
      flex: 2,
      flexDirection: "row",
      borderWidth: 2,
      borderColor: colors.lava,
      borderRadius: 15,
      padding: 20,
      width: width > bigDisplay? 440 : 325,
      marginBottom: 5,
      marginTop: 5,
      gap: 47,
    },
    note_text: {
      color: "white",
      width: "100%",
      fontSize: width > bigDisplay? 22 : 15,
    }, 
    note_text_info: {
      color: colors.secondtext,
      width: "100%",
      fontSize: width > bigDisplay? 22 : 15,
    },
    notes_btns: {
      flexDirection: "row",
      width: "50%",
      gap: width > bigDisplay? 40 : 5,
      marginTop: width > bigDisplay? 10 : 0,
    },
    empty: {
      color: "white",
      fontSize: width > bigDisplay? 24 : 20,
      textAlign: "center",
      marginTop: 100,
    },
    search: {
      flexDirection: "row",
      gap: 20,
    },
    search_input: {
      borderWidth: 2,
      borderColor: "#f1951d",
      borderRadius: 50,
      width: 250,
      marginBottom: 15,
      textAlign: "center",
      color: colors.white,
    },
  }

  const showNote = (note: string) => { // Действия кнопки показа заметки
    nav.navigate("showNote", {filename: note}); // Переадресация с передачей аргумента
  }

  const editNote = (file: string) => { // Действия кнопки редактирования заметки
    nav.navigate("editNote", {filename: file}); // Переадресация с передачей аргумента
  }

  const updateList = (request: string) => {
    setSearchValue(request);
    search(request);
  }

  const search = (request: string) => {
    console.log("search note...");
    if (!request.trim()) {
      setFilteredFiles(files);
      console.warn("request is empty")
      return
    }
    const trueRequest = request.toLowerCase().trim();
    const filter = files.filter((note) => note.name.includes(trueRequest));
    setFilteredFiles(filter);
    console.log("filtered!")
  }

  useEffect(() => { // Создание необходимых папок приложения и каналов
    if (accept_fileInit) fileSystemInit();
    setAccept_fileInit(false);
    notifications.setNotificationChannelAsync("default", {
      name: "main channel",
      importance: notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  });

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
        setFilteredFiles(loadedFiles)
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
      <View style={adaptiveStyle.search}>
        <TextInput
          style={adaptiveStyle.search_input}
          placeholder="Найти заметку..."
          placeholderTextColor={colors.secondtext}
          value={searchValue}
          onChangeText={text => updateList(text)}
        />
        <SmallButton name="search" backgroundColor="#f1951d" borderRadius={17} onPress={() => search(searchValue)}/>
      </View>
      <FlatList
        data={filteredFiles}
        keyExtractor={(item) => item.uri} 
        renderItem={({ item }) => (
          <Animated.View style={{ transform: [{translateX: spawnAnimation}], opacity: opacityAnimation }}>
            <TouchableOpacity style={styles.notes, adaptiveStyle.note} onPress={() => showNote(item.name)}>
              <View style={styles.note}>
                <Text style={styles.note_text, adaptiveStyle.note_text}>{stabilizeTitle(item.name)}</Text>
                <Text style={styles.note_text_info, adaptiveStyle.note_text_info}>
                  {getDisplayDate(item.creationTime)}
                </Text>
              </View>
              <View style={styles.notes_btns, adaptiveStyle.notes_btns}>

                <SmallButton name={"edit"} backgroundColor="#f1951d" borderRadius={10} onPress={() => editNote(item.name)}/>
                <SmallButton name={"trash"} backgroundColor="#e31313" borderRadius={10} onPress={async () => {
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
        ListEmptyComponent={<Text style={styles.empty, adaptiveStyle.empty}>Здесь пока пусто. Начните работать!</Text>}
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
    experimental_backgroundImage: "linear-gradient(#0A0F1A, #341913)",
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
    color: colors.secondtext,
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