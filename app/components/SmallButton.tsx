import { StyleSheet, View, Pressable, Text } from "react-native";
import { Feather } from "@expo/vector-icons"

type Props = {
    name: FeatherType;
    backgroundColor?: string;
    onPress: () => void;
};

export default function SmallButton ({ name, backgroundColor, onPress }: Props) {
    return (
        <View style={styles.buttonContainer}>
            <Pressable style={[styles.button, {backgroundColor}]} onPress={onPress}>
                <Feather name={name} size={24} color="white" />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: 50,
        height: 50,
        marginHorizontal: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 3
    },
});