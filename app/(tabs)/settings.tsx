import { Text, View, TouchableOpacity, Linking } from "react-native";
import { StyleSheet, Alert } from "react-native";

import SocialLink from "@/app/components/Links";

const tgLogo = require("../../assets/images/telegram.png");
const githubLogo = require("../../assets/images/github.png");

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
        <Text style={styles.text}>Версия: 0.1.9 beta</Text>
      </View>
      <SocialLink image={tgLogo} label="Канал в Telegram"  url="https://t.me/under_the_ctrl"/>
      <SocialLink image={githubLogo} label="Страница на GitHub"  url="https://github.com"/>
      <TouchableOpacity style={styles.feedback} onPress={feedback}>
        <Text style={styles.text}>✏️ Нашли баг или есть идея?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({ // Таблица стилей
  container: {
    flex: 1,
    backgroundColor: "#040332",
    alignItems: "center",
    justifyContent: "center",
    gap: 15
  },
  banner: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50
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