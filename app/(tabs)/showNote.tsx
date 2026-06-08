import { Text, View, ScrollView } from "react-native";
import { StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useFonts } from "expo-font";

import { readFile } from "@/src/scripts/fileSystem";
import { colors } from "@/src/globalVars";

export default function showNote() { // Основное наполнение страницы
  const { filename } = useLocalSearchParams();
  const [content, setContent] = useState<string>();
  const title = filename.replace(".txt", "");

  const [fontsLoaded] = useFonts({
      "IBMPlexMono-Bold": require("@/assets/fonts/IBMPlexMono-Bold.ttf"),
      "IBMPlexMono-Medium": require("@/assets/fonts/IBMPlexMono-Medium.ttf"),
    });

  useFocusEffect(
    useCallback(() => {
      if (filename) {
        const load = async () => {
          let loadedContent = await readFile(filename);
          loadedContent = loadedContent.replace(title, "")
          setContent(loadedContent);
        };
        load();
      };
    }, [filename])
  );

  return (
      <View style={styles.container}>
        <ScrollView style={styles.scroll}>
          <Text style={styles.title} selectable={true}>{title}</Text>
          <Text style={styles.text} selectable={true}>{content}</Text>
        </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({ // Таблица стилей
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "flex-start",
    experimental_backgroundImage: "linear-gradient(#0A0F1A, #341913)",
    padding: 8,
  },
  title: {
    textAlign: "center",
    color: "white",
    fontSize: 32,
    fontFamily: "IBMPlexMono-Bold",
  },
  text: {
    color: "#fff",
    fontSize: 18,
    marginTop: 0,
    textAlign: "left",
    fontFamily: "IBMPlexMono-Medium"
  },
  scroll: {
  }
})