import { Text, View } from "react-native";
import { StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function Index() { // Основное наполнение страницы
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Здесь пока пусто. Начните работать!</Text>
      <Link href="/settings" style={styles.sett_btn}>
        Перейти к настройкам
      </Link>
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
  }

})
