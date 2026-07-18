import { StyleSheet, TouchableOpacity, Animated, useWindowDimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRef } from "react";
import { bigDisplay } from "@/src/globalVars";

type Props = { // Изменяющиеся параметры
    name: FeatherType;
    backgroundColor?: string;
    borderRadius?: number;
    onPress: () => void;
    size: number;
    iconSize: number;
};

// Маленькая кнопка с иконкой
export default function SmallButton ({ name, backgroundColor, borderRadius, size, iconSize, onPress }: Props) {
    const scaleAnimation = useRef(new Animated.Value(1)).current;
    const onPressIn = () => Animated.spring(scaleAnimation, {toValue: 0.85, useNativeDriver: true}).start();
    const onPressOut = () => Animated.spring(scaleAnimation, {toValue: 1, useNativeDriver: true}).start();

    const { width } = useWindowDimensions();
    const isTab = width > bigDisplay; // Это устройство планшет?
    const bias = 7; // Смещение для корректировки размера на паншетах

    const tabSize = size < 75? size + bias : 75;
    let finalSize = size;
    if ((size === undefined) || (size === null)) {
        finalSize = (isTab? 75 : 50);
    } else {
        finalSize = (isTab? tabSize : size);
    }

    const tabIconSize = tabSize < 36? iconSize + bias : 36;
    let finalIconSize = iconSize;
    if ((iconSize === undefined) || (iconSize === null)) {
        finalIconSize = (isTab? 36 : 24);
    } else {
        finalIconSize = (isTab? tabIconSize : iconSize);
    }

    const adaptiveStyle = {
        buttonView: {
            width: width > bigDisplay? 75 : 50,
            height: width > bigDisplay? 75 : 50,
            marginHorizontal: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 3,
        }
    }

    return (
        <Animated.View style={[styles.buttonContainer, { transform: [{ scale: scaleAnimation }] }]}>
            <TouchableOpacity style={[styles.buttonContainer, {backgroundColor, borderRadius, width: finalSize, height: finalSize}]} onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut}>
                <Feather name={name} size={finalIconSize} color="white" />
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