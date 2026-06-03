import { Text, View } from "react-native";
import { StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";

import { readFile } from "@/src/scripts/fileSystem"

export default function showNote() { // Основное наполнение страницы
  const { filename } = useLocalSearchParams();
  const [content, setContent] = useState<string>();
  const title = filename.replace(".txt", "");

  useEffect(() => {
    if (filename) {
      const load = async () => {
        let loadedContent = await readFile(filename);
        loadedContent = loadedContent.replace(title, "")
        setContent(loadedContent);
      };
      load();
    }
  }, [filename]);

  return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>{content}</Text>
      </View>
  );
}

const styles = StyleSheet.create({ // Таблица стилей
  container: {
    flex: 1,
    backgroundColor: "#040332",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    color: "white",
    fontSize: 32,
  },
  text: {
    color: "#fff",
    fontSize: 18,
    marginTop: 30,
    textAlign: "center"
  },
})