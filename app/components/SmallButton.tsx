import { StyleSheet, View, TouchableOpacity, Animated } from "react-native";
import { Feather } from "@expo/vector-icons"
import { useRef } from "react";

type Props = { // Изменяющиеся параметры
    name: FeatherType;
    backgroundColor?: string;
    onPress: () => void;
};



// Маленькая кнопка с иконкой
export default function SmallButton ({ name, backgroundColor, onPress }: Props) {
    const scaleAnimation = useRef(new Animated.Value(1)).current;
    const onPressIn = () => Animated.spring(scaleAnimation, {toValue: 0.85, useNativeDriver: true}).start();
    const onPressOut = () => Animated.spring(scaleAnimation, {toValue: 1, useNativeDriver: true}).start();
    return (
        <Animated.View style={[styles.buttonContainer, { transform: [{ scale: scaleAnimation }] }]}>
            <TouchableOpacity style={[styles.button, {backgroundColor}]} onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
                <Feather name={name} size={24} color="white" />
            </TouchableOpacity>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: 50,
        height: 50,
        marginHorizontal: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 3,
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