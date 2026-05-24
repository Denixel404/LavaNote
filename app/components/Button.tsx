import { StyleSheet, View, Pressable, Text } from "react-native";

type Props = {
    label: string;
    backgroundColor?: string
};

export default function Button ({ label, backgroundColor }: Props) {
    return (
        <View style={styles.buttonContainer}>
            <Pressable style={[styles.button, {backgroundColor}]} onPress={() => alert("You made click!")}>
                <Text style={styles.buttonLabel}>{label}</Text>
            </Pressable>
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

