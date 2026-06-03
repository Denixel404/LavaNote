import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons"

type Props = { // Изменяющиеся параметры
    name: FeatherType;
    backgroundColor?: string;
    onPress: () => void;
};

// Маленькая кнопка с иконкой
export default function SmallButton ({ name, backgroundColor, onPress }: Props) {
    return (
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, {backgroundColor}]} onPress={onPress}>
                <Feather name={name} size={24} color="white" />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: 40,
        height: 40,
        marginHorizontal: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 3
    },
    button: {
        borderRadius: 10,
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "#fff"
    },
});