import { Text, View, TouchableOpacity, Linking } from "react-native";
import { StyleSheet, Alert } from "react-native";
import Constants from 'expo-constants';

import SocialLink from "@/app/components/Links";
import { colors } from "@/src/globalVars";

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
  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.title}>О приложении</Text>
        <Text style={styles.text}>Версия: {Constants.expoConfig?.version}</Text>
      </View>

      <SocialLink image={tgLogo} label="Канал в Telegram"  url="https://t.me/under_the_ctrl"/>
      <SocialLink image={githubLogo} label="Страница на GitHub"  url="https://github.com/Denixel404/LavaNote"/>
      <SocialLink image={miniIcon} label="Спасибо, Flaticon!"  url="https://www.flaticon.com/free-icons/lava"/>
  
      <TouchableOpacity style={styles.feedback} onPress={feedback}>
        <Text style={styles.text}>✏️ Нашли баг или есть идея?</Text>
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
  },
  text: {
    color: "#fff",
  },
  feedback: {
    marginTop: 50,
    backgroundColor: "#1b1e2e",
    padding: 30,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#e05807"
  }
})