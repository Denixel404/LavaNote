import { Text, View } from "react-native";
import { StyleSheet } from "react-native";

export default function Settings() { // Основное наполнение страницы
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Это экран с настройками приложения</Text>
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
  }
})