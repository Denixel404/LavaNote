import { Text, View, TouchableOpacity, Linking, useWindowDimensions, Modal, TextInput } from "react-native";
import { StyleSheet, Alert } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useFonts } from "expo-font";
import Constants from 'expo-constants';

import { readDataFile, writeDataFile } from "@/src/scripts/fileSystem";
import SocialLink from "@/app/components/Links";
import Feature from "../components/Feature";
import { colors, bigDisplay } from "@/src/globalVars";
import Button from "../components/Button";

const tgLogo = require("../../assets/images/telegram.png");
const githubLogo = require("../../assets/images/github.png");
const miniIcon = require("../../assets/images/mini-icon.png");

const feedback = () => {
  const form = "https://forms.gle/qtRpeUnDYGNCX5rR8";
  Linking.canOpenURL(form).then(supported => {
    if (supported) Linking.openURL(form);
    else Alert.alert('Ошибка', 'Не удалось открыть форму');
  });
}

export default function Settings() { // Основное наполнение страницы
  const [catVisible, setCatVisible] = useState(false);
  const [categories, setCategories] = useState("");
  const [fontsLoaded] = useFonts({
    "IBMPlexMono-Bold": require("@/assets/fonts/IBMPlexMono-Bold.ttf"),
  });
  const { width } = useWindowDimensions();
  const adaptiveStyle = {
    title: {
      color: "#fff",
      fontSize: width > bigDisplay? 46 : 32,
      fontFamily: "IBMPlexMono-Bold",
    },
    text: {
      color: "#fff",
      fontSize: width > bigDisplay? 22 : 15,
    },
    modalCategories: {
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
    modalInput: {
      color: colors.white,
      borderWidth: 2,
      borderColor: colors.lava,
      borderRadius: 20,
      height: "15%",
      width: "90%",
      textAlignVertical: "top",
      marginTop: 20,
      marginBottom: 50,
    }
  }

  useFocusEffect( // Чтение и обновление строки категорий
      useCallback(() => {
        const loadCategories = async () => {
          const loadedCategories = await readDataFile("categories.txt");
          setCategories(loadedCategories)
        };
        loadCategories();
      }, []) // Зависимости
    );

  if (!fontsLoaded) {
    return null;
  }

  const openCategories = async () => {
    console.log("opening categories...");
    setCatVisible(true);
  };

  const saveCat = async (changes: string) => {
    writeDataFile("categories.txt", changes);
    console.log("categories was saved!");
    setCatVisible(false);
  }

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={catVisible}
        onRequestClose={() => setCatVisible(false)}
      >
        <View style={adaptiveStyle.modalCategories}>
          <Text style={adaptiveStyle.modalTitle}>Измените список категорий для заметок через запятую</Text>
          <TextInput 
            style={adaptiveStyle.modalInput}
            placeholder="Введите ваши категории через запятую"
            value={categories}
            onChangeText={setCategories}
            scrollEnabled={true}
            multiline={true}
          />
          <Button label="Сохранить изменения" backgroundColor={colors.lava} onPress={async () => saveCat(categories)}/>
        </View>
      </Modal>

      <View style={styles.banner}>
        <Text style={styles.title, adaptiveStyle.title}>LavaNote</Text>
        <Text style={styles.text, adaptiveStyle.text}>Версия: {Constants.expoConfig?.version}</Text>
      </View>
      <Feature label="Изменить категории" backgroundColor="#482203bd" onPress={async () => openCategories()}/>
      <SocialLink image={tgLogo} label="Канал в Telegram"  url="https://t.me/under_the_ctrl"/>
      <SocialLink image={githubLogo} label="Страница на GitHub"  url="https://github.com/Denixel404/LavaNote"/>
      <SocialLink image={miniIcon} label="Спасибо, Flaticon!"  url="https://www.flaticon.com/free-icons/lava"/>
  
      <TouchableOpacity style={styles.feedback} onPress={feedback}>
        <Text style={styles.text, adaptiveStyle.text}>✏️ Нашли баг или есть идея?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({ // Таблица стилей
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    experimental_backgroundImage: "linear-gradient(#0A0F1A, #341913)"
  },
  banner: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50
  },
  linksList: {

  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontFamily: "IBMPlexMono-Bold",
  },
  text: {
    color: "#fff",
  },
  feedback: {
    marginTop: 50,
    backgroundColor: colors.background2,
    padding: 30,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.lava
  }
})