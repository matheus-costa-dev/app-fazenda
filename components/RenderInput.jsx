import { Ionicons } from "@expo/vector-icons";
import { View, TextInput } from "react-native";
import { forwardRef } from "react";
import { appStyles, colors } from "@/styles/app";

function RenderInput({ icon, placeholder, value, setValue, isPassword, keyboardType, onSubmitEditing, onPress, editable }, ref) {
    return (
        <View style={appStyles.inputContainer}>
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
                secureTextEntry={isPassword}
                keyboardType={keyboardType}
                onSubmitEditing={onSubmitEditing}
                onPress={onPress}
                ref={ref} // Encaminha a ref para o TextInput
                editable={editable}
            />
        </View>
    );
}

export default forwardRef(RenderInput);

