import { Text, Image, StyleSheet, Linking } from 'react-native';
import { TouchableOpacity } from 'react-native';

type Props = {
    label: string;
    url: string;
    image: ImageSourcePropType;
};

export default function SocialLink ({ label, url, image }: Props) {
    return (
        <TouchableOpacity style={styles.piclink} onPress={() => Linking.openURL(url)}>
            <Image source={image}></Image>
            <Text style={styles.text}>{label}</Text>
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