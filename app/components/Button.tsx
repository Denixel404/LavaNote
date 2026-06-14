import { StyleSheet, View, TouchableOpacity, Text, Animated } from "react-native";
import { useRef } from "react";

type Props = {
    label: string;
    backgroundColor?: string;
    onPress: () => void;
};

// Стандартная кнопка
export default function Button ({ label, backgroundColor, onPress }: Props) {
    const scaleAnimation = useRef(new Animated.Value(1)).current;
    const onPressIn = () => Animated.spring(scaleAnimation, {toValue: 0.85, useNativeDriver: true}).start();
    const onPressOut = () => Animated.spring(scaleAnimation, {toValue: 1, useNativeDriver: true}).start();
    return (
        <Animated.View style={[styles.buttonContainer, {transform: [{scale: scaleAnimation}]} ]}>
            <TouchableOpacity style={[styles.button, {backgroundColor}]} onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
                <Text style={styles.buttonLabel}>{label}</Text>
            </TouchableOpacity>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: 225,
        height: 68,
        marginHorizontal: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 3
    },
    button: {
        borderRadius: 15,
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

