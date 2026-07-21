import { Text, View, ScrollView, useWindowDimensions } from "react-native";
import { StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Markdown } from "@codearcade/expo-markdown-native";

import { readFile } from "@/src/scripts/fileSystem";
import { colors, bigDisplay } from "@/src/globalVars";
import { mdStyles, codeStyles } from "@/src/markdownStyles";

export default function showNote() { // Основное наполнение страницы
  let title = null;
  let noteMassive = [];
  const { filename } = useLocalSearchParams();
  const [content, setContent] = useState<string>();
  const [md, setMd] = useState(false);
  const expansion = filename.slice(-4);
  console.log(`Get expansion: ${expansion}`);
  if (expansion === ".txt") { title = filename.replace(".txt", ""); }
  else if (expansion === "json") { title = filename.replace(".json", "")}

  const [fontsLoaded] = useFonts({
      "IBMPlexMono-Bold": require("@/assets/fonts/IBMPlexMono-Bold.ttf"),
    });
  const { width } = useWindowDimensions();
  const adaptiveStyle = { // Адаптивные стили для страницы
    text: {
      color: "#fff",
      fontSize: width > bigDisplay? 22 : 16,
      marginTop: 0,

    },
    title: {
      textAlign: "center",
      color: "white",
      fontSize: width > bigDisplay? 38 : 32,
      fontFamily: "IBMPlexMono-Bold",
    },
  };

  useFocusEffect(
    useCallback(() => {
      if (filename) {
        const load = async () => {
          let loadedContent = await readFile(filename);
          console.log(`content: ${loadedContent}`)
          if (expansion === ".txt") { // Загрузка содержимого для старого формата
            loadedContent = loadedContent.replace(title, "");
            setContent(loadedContent);
          }
          else if (expansion === "json") { // Загрузка содержимого для нового формата
            noteMassive = JSON.parse(loadedContent);
            if (!noteMassive.markdown) noteMassive["markdown"] = false;
            setContent(noteMassive["text"]);
            setMd(noteMassive["markdown"]);

          }
          console.log(`content: ${content}`);
        };
        load();
      };
    }, [filename])
  );
  return (
      <View style={styles.container}>
        <ScrollView style={styles.scroll}>
          {md ? (
            <>
              <Markdown 
                content={content}
                theme="dark"
                styles={mdStyles}
                codeTheme={codeStyles}
              />
            </>
          ) : (
            <>
              <Text style={adaptiveStyle.title} selectable={true}>{title}</Text>
              <Text style={adaptiveStyle.text} selectable={true}>{content}</Text>
            </>
          )}
        </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({ // Таблица стилей
  container: {
    flex: 1,
    backgroundColor: colors.background,
    experimental_backgroundImage: "linear-gradient(#0A0F1A, #341913)",
    padding: 10,
  },
  scroll: {
  }
})