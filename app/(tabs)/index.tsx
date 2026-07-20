/* eslint-disable import/no-unresolved */
import { FlatList, Text, View, TouchableOpacity, Animated, useWindowDimensions, TextInput, Modal } from "react-native";
import { StyleSheet, Alert } from "react-native";
import React, { useEffect, useRef } from "react";
import { useState, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Audio } from "expo-av";
import { Picker } from "@react-native-picker/picker";
import * as notifications from "expo-notifications";
import { isHasPassword, verifyPassword } from "@/src/scripts/security";

import Button from "../components/Button";
import SmallButton from "../components/SmallButton";
import { getData, deleteFile, fileSystemInit, readFile, readDataFile, exportNoteFile, importNoteFile } from "@/src/scripts/fileSystem";
import { getDisplayDate, stabilizeTitle, splitCategories } from "@/src/scripts/utils";
import { colors, bigDisplay, gui } from "@/src/globalVars";

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
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState("Не выбрано");
  const [hasPassword, setHasPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [isLock, setIsLock] = useState(true);
  const [initReady, setInitReady] = useState(false);

  const { width } = useWindowDimensions();
  const adaptiveStyle = { // Адаптивные стили для страницы
    note: {
      backgroundColor: "rgba(255, 255, 255, 0.06)",
      backdropFilter: "blur(10px)",
      flex: 2,
      flexDirection: "row",
      borderWidth: 2,
      borderColor: colors.lava,
      borderRadius: 15,
      padding: 15,
      width: width > bigDisplay? 440 : 330,
      marginBottom: 5,
      marginTop: 5,
      gap: 10,
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
    note_category: {
      color: colors.lava,
      width: "100%",
      fontSize: width > bigDisplay? 22 : 15,
    },
    notes_btns: {
      flexDirection: "row",
      width: "50%",
      gap: width > bigDisplay? 40 : 0,
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
      gap: width > bigDisplay? 30 : 7,
      marginTop: width > bigDisplay? 20 : 5,
    },
    search_input: {
      borderWidth: 2,
      borderColor: colors.search_panel,
      borderRadius: 50,
      width: width > bigDisplay? 300 : 215,
      height: width > bigDisplay? 60 : 50,
      marginBottom: 15,
      textAlign: "center",
      color: colors.white,
      fontSize: width > bigDisplay? 22 : 15,
    },
    modalFilters: {
      backgroundColor: colors.panel,
      width: "100%",
      height: "100%",
      alignItems: "center",
    },
    modalText: {
      color: "#fff",
      fontSize: width > bigDisplay? 22 : 15,
    },
    modalTitle: {
      color: "#fff",
      fontSize: width > bigDisplay? 22 : 18,
      marginTop: 75,
      textAlign: "center",
    },
    btn_filters: {
      flexDirection: "column",
      marginTop: 50,
      gap: width > bigDisplay? 20 : 10,
    },
    fall_list: {
      color: colors.white,
      height: width > bigDisplay? 100 : 75,
      width: "90%",
    },
    category: {
      borderWidth: 2,
      borderColor: colors.lava,
      width: "87%",
      height: width > bigDisplay? 75 : 50,
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 10,
      marginBottom: 30,
      fontSize: width > bigDisplay? 22 : 15,
    },
    modalEnterPassword: {
      backgroundColor: colors.panel,
      width: "100%",
      height: "100%",
      alignItems: "center",
      padding: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    modalInputPassword: {
      color: colors.white,
      borderWidth: 2,
      borderColor: colors.lava,
      borderRadius: 20,
      height: width > bigDisplay? "80%" : "60%",
      width: width > bigDisplay? "60%" : "80%",
      textAlignVertical: "top",
      marginTop: 20,
      marginBottom: 10,
      padding: 10,
      fontSize: width > bigDisplay? 22 : 15,
    },
    button: {
      marginTop: width > bigDisplay? 60 : 30,
    },
    modalWelcome: {
      color: "#fff",
      fontSize: width > bigDisplay? 26 : 22,
      textAlign: "center",
    },
    modalEnterPasswordStroke: {
      height: 75,
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: width > bigDisplay? 25 : 10,
    },
    footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 50,
    gap: width > bigDisplay? 105 : 15,
  },
  }

  const showNote = (note: string) => { // Действия кнопки показа заметки
    nav.navigate("showNote", {filename: note}); // Переадресация с передачей аргумента
  }

  const editNote = (file: string) => { // Действия кнопки редактирования заметки
    nav.navigate("editNote", {filename: file}); // Переадресация с передачей аргумента
  }

  const updateList = (request: string) => { // Обновить список при поисковом запросе
    setSearchValue(request);
    search(request);
  }

  const search = (request: string) => { // Поиск и фильтрация заметок по запросу
    console.log("search note...");
    console.log(`search of category: ${filterCategory}`)
    if ((!request.trim()) && (filterCategory == "Не выбрано")) {
      setFilteredFiles(files);
      console.warn("request is empty")
      return
    }
    let filteredNotes = files;
    const trueRequest = request.toLowerCase().trim();
    filteredNotes = filteredNotes.filter((note) => note.name.toLowerCase().includes(trueRequest));

    if (filterCategory != "Не выбрано") {
      console.log("filters active");
      filteredNotes = filteredNotes.filter((note) => note.content.category == filterCategory);
    }
    setFilteredFiles(filteredNotes);
    console.log("filtered!");
  }

  const filterMode = () => { // Закрытие модального окна фильтров
    setFiltersVisible(false);
    search(searchValue);
  };

  const unlockApp = async () => { // Разблокировка приложения
    console.log("checking your password...");
    const check = await verifyPassword(password);

    if (check) {
      setIsLock(false);
    } else {
      alert("Пароль неверный. Попробуйте ещё раз");
    }
  };

  const loadNotes = useCallback (async () => { // Загрузка и обновление всех заметок из файлов
    const loadFiles = async () => {
      const loadedFiles = await getData();
      const filesContent = await Promise.all(
        loadedFiles.map(async (file) => {
          const noteContent = await readFile(file.name);
          let content = {};
          try {
            content = JSON.parse(noteContent);
          } catch (error) {
            console.error(`Parse error: ${error}`);
            content = {title: "Не найдено", text: "Не удалось прочитать", category: []}
          }
          file.content = content;
          return file;
        })
      );
      setFiles(filesContent);
      setFilteredFiles(filesContent);

      const loadedCategories = await readDataFile("categories.txt");
      setAllCategories(splitCategories(loadedCategories));
    };
    loadFiles();
  }, []);

  const exportNote = async (noteFilename: string) => {
    console.log("exportNote...");
    await exportNoteFile(noteFilename);
  }

  const importNote = async () => {
    console.log("Import note...");
    await importNoteFile();
    await loadNotes();
  }

  useEffect(() => { // Инициализация приложения
    const initApp = async () => {
      // Создание необходимых папок приложения и каналов
      if (accept_fileInit) await fileSystemInit(); 
      setAccept_fileInit(false);
      // Создание канала для уведомлений
      notifications.setNotificationChannelAsync("default", {
        name: "main channel",
        importance: notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
      // Проверка на существование пароля
      const checkHasPass = await isHasPassword();
      setHasPassword(checkHasPass);
      if (!checkHasPass) { // Если пароля нет - разблокируем
        setIsLock(false);
        console.log("app password not exists. Unlock");
      } else {
        console.log("app is lock. Enter the password");
      }
      setInitReady(true);
    }
    initApp();
  });

  useEffect(() => { // Загрузка звуков
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
      if (initReady) loadNotes();
    }, [initReady, loadNotes]) // Зависимости
  );
  useEffect(() => { // Подготовка анимаций
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

  return (
    <View style={styles.container}>

      <Modal
        animationType="slide"
        transparent={true}
        visible={filtersVisible}
        onRequestClose={() => setFiltersVisible(false)}
      >
        <View style={adaptiveStyle.modalFilters}>
          <Text style={adaptiveStyle.modalTitle}>Настройте фильтр по категории для поиска заметок</Text>
          <View style={adaptiveStyle.category}>
            <Picker
              selectedValue={filterCategory}
              onValueChange={(selection) => setFilterCategory(selection)}
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
          <View style={adaptiveStyle.btn_filters}>
            <Button label="Сохранить" backgroundColor={colors.lava} onPress={() => filterMode()}/>
            <Button label="Сбросить" backgroundColor="gray" onPress={() => {
              setFilterCategory("Не выбрано");
              setFilteredFiles(files);
              setFiltersVisible(false);
            }
            }/>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={hasPassword && isLock}
        onRequestClose={() => {}}
      >
        <View style={adaptiveStyle.modalEnterPassword}>
          <Text style={adaptiveStyle.modalWelcome}>Перед тем, как начать...</Text>
          <View style={adaptiveStyle.modalEnterPasswordStroke}>
            <TextInput 
                style={adaptiveStyle.modalInputPassword}
                placeholder="Введите пароль"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={showPassword}
            />
            <SmallButton name="eye" backgroundColor="gray" borderRadius={15} onPress={() => setShowPassword(!showPassword)} />
          </View>
            <View style={adaptiveStyle.button}>
              <Button label="Разблокировать" backgroundColor={colors.lava} onPress={() => unlockApp()} />
            </View>
        </View>
      </Modal>

      <View style={adaptiveStyle.search}>
        <TextInput
          style={adaptiveStyle.search_input}
          placeholder="Найти заметку..."
          placeholderTextColor={colors.secondtext}
          value={searchValue}
          onChangeText={text => updateList(text)}
        />
        <SmallButton name="search" backgroundColor={colors.search_panel} borderRadius={17} onPress={() => search(searchValue)}/>
        <SmallButton name="filter" backgroundColor={colors.search_panel} borderRadius={17} onPress={() => setFiltersVisible(true)}/>
      </View>
      <FlatList
        data={filteredFiles}
        keyExtractor={(item) => item.uri} 
        renderItem={({ item }) => (
          <Animated.View style={{ transform: [{translateX: spawnAnimation}], opacity: opacityAnimation }}>
            <TouchableOpacity style={adaptiveStyle.note} onPress={() => showNote(item.name)}>
              <View style={styles.note}>
                <Text style={adaptiveStyle.note_text}>{stabilizeTitle(item?.name || "Ошибка загрузки")}</Text>
                <Text style={adaptiveStyle.note_text_info}>
                  {getDisplayDate(item.creationTime)}
                </Text>
                <Text style={adaptiveStyle.note_category}>{stabilizeTitle(item.content?.category?.[0] || "Без категории")}</Text>
              </View>
              <View style={adaptiveStyle.notes_btns}>

                <SmallButton name={"edit"} backgroundColor="#f1951d" borderRadius={10} size={gui.noteButtonSize} iconSize={gui.noteButtonIconSize} onPress={() => editNote(item.name)} />
                <SmallButton name={"share"} backgroundColor="#a3b626" borderRadius={10} size={gui.noteButtonSize} iconSize={gui.noteButtonIconSize} onPress={async () => await exportNote(item.name)} />
                <SmallButton name={"trash"} backgroundColor="#e31313" borderRadius={10} size={gui.noteButtonSize} iconSize={gui.noteButtonIconSize} onPress={async () => {
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
                      await loadNotes();
                    }
                  }]
                  )}} 
                  />
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}
        ListEmptyComponent={<Text style={adaptiveStyle.empty}>Здесь пока пусто. Попробуйте создать новую заметку</Text>}
      />
      <View style={adaptiveStyle.footerContainer}>
        <Button label="Добавить заметку" backgroundColor={colors.lava} onPress={() => { nav.navigate("newNote") }} />
        <SmallButton name="download" backgroundColor={colors.lava} size={68} iconSize={35} borderRadius={15}  onPress={async () => await importNote()} />
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
  note: {
    // Стили для кнопок
  },
  text: {
    color: "#fff",
  },
  sett_btn: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#fff"
  },
})