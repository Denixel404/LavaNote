import { Text, View } from "react-native";
import { StyleSheet } from "react-native";
import { Link } from "expo-router";

import Button from "../components/Button"

export default function Index() { // Основное наполнение страницы
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Здесь пока пусто. Начните работать!</Text>
      <Link href="/settings" style={styles.sett_btn}>
        Перейти к настройкам
      </Link>
      <View style={styles.footerContainer}>
        <Button label="Добавить заметку" backgroundColor="#e05807"/>
        <Button label="Открыть заметку" backgroundColor="#e05807"/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({ // Таблица стилей
  container: {
    flex: 1,
    backgroundColor: "#040332",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
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
