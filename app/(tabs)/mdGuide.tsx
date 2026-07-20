import { Text, ScrollView, useWindowDimensions } from "react-native";
import { colors, bigDisplay } from "@/src/globalVars";

export default function mdGuide() {
  const { width } = useWindowDimensions();
  const adaptiveStyle = {
    container: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "flex-start",
      experimental_backgroundImage: "linear-gradient(#0A0F1A, #341913)"
    },
    text: {
      color: "#fff",
      fontSize: width > bigDisplay? 22 : 15,
      textAlign: "left",
    },
    title: {
      color: "white",
      fontSize: width > bigDisplay? 26 : 24,
    },
}
  
  return (
    <ScrollView contentContainerStyle={adaptiveStyle.container}>
      <Text style={adaptiveStyle.title}>Hello!</Text>
    </ScrollView>
  );
}