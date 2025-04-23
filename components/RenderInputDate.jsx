import { Ionicons } from "@expo/vector-icons";
import { TextInput, TouchableOpacity } from "react-native";
import { forwardRef } from "react";
import { appStyles, colors } from "../styles/app";

function RenderInput({ icon, placeholder, value, setValue, keyboardType, onSubmitEditing, onPress, editable }, ref) {
    return (
        <TouchableOpacity 
        style={appStyles.inputContainer} 
        onPress={onPress}>
            <Ionicons 
            name={icon}
            size={20} 
            color={colors.inputIcon} 
            style={appStyles.inputIcon} />
            <TextInput
                placeholder={placeholder}
                style={appStyles.input}
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
