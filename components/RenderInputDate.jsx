import { Ionicons } from "@expo/vector-icons";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { forwardRef } from "react";

function RenderInput({ icon, placeholder, value, setValue, keyboardType, onSubmitEditing, onPress, editable }, ref) {
    return (
        <TouchableOpacity style={styles.inputContainer} onPress={onPress}>
            <Ionicons name={icon} size={20} color={"#6c63ff"} style={styles.inputIcon} />
            <TextInput
                placeholder={placeholder}
                style={styles.input}
                value={value}
                onChangeText={setValue}
                placeholderTextColor="#aaa"
                keyboardType={keyboardType}
                onSubmitEditing={onSubmitEditing}
                ref={ref} // Encaminha a ref para o TextInput
                editable={editable}
            />
        </TouchableOpacity>
    );
}

export default forwardRef(RenderInput);

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        backgroundColor: "#fff",
        paddingHorizontal: 12,
        marginBottom: 16,
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: "#333",
        paddingHorizontal: 20,
        borderRadius: 20,
    },
});

