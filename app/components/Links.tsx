import { Text, Image, StyleSheet, Linking, useWindowDimensions } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { bigDisplay } from "@/src/globalVars";

type Props = {
    label: string;
    url: string;
    image: ImageSourcePropType;
};

// Гипер ссылка с картинкой
export default function SocialLink ({ label, url, image }: Props) {
    const { width } = useWindowDimensions();
    const adaptiveStyle = {
      picLink: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        width: width > bigDisplay? 400 : 200,
      },
      text: {
        color: "#fff",
        fontSize: width > bigDisplay? 22 : 15,
      }
    }
    return (
        <TouchableOpacity style={styles.piclink, adaptiveStyle.picLink} onPress={() => Linking.openURL(url)}>
            <Image source={image}></Image>
            <Text style={styles.text, adaptiveStyle.text}>{label}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({ // Таблица стилей
  text: {
    color: "#fff",
  },
  piclink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    width: 200
  }
})