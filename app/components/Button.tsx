import { StyleSheet, View, TouchableOpacity, Text } from "react-native";

type Props = {
    label: string;
    backgroundColor?: string;
    onPress: () => void;
};

// Стандартная кнопка
export default function Button ({ label, backgroundColor, onPress }: Props) {
    return (
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, {backgroundColor}]} onPress={onPress}>
                <Text style={styles.buttonLabel}>{label}</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: 175,
        height: 68,
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
    buttonLabel: {
        color: "#fff",
        fontSize: 16
    },
});

