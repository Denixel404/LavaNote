import { View, Text, StyleSheet } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { colors } from "@/src/globalVars";
import Button from "../components/Button";

export default function tasks_index() {
  const nav = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Здесь будут напоминания</Text>
      <Button label="Добавить напоминание" backgroundColor={colors.lava} onPress={() => { nav.navigate("newTask") }} />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    experimental_backgroundImage: "linear-gradient(#0A0F1A, #341913)"
  },
  text: {
    color: colors.white
  },
})