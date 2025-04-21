import {TouchableOpacity, Text, StyleSheet} from "react-native"

export default function CustomButton( {onPress ,buttonText, customTouchableStyle, customButtonStyle} ) {
    return (
        <TouchableOpacity
            style={[styles.button, customTouchableStyle]}
            onPress={() => onPress()}
        >
            <Text style={[styles.buttonText, { paddingHorizontal: 10 }, customButtonStyle]}> {buttonText} </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#6c63ff",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 8,
    },
    cancelButton: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ff4d4d",
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
    },
})