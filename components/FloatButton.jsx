import {TouchableOpacity} from "react-native"
import {Ionicons} from "@expo/vector-icons"
import { floatButtonStyles } from "@/styles/app";

export default function FloatButton({ onPress, iconName }) {
    return (
        <TouchableOpacity style={floatButtonStyles.buttonContainer} onPress={onPress}>
            <Ionicons name={iconName} style={floatButtonStyles.iconButton} />
        </TouchableOpacity>
    );
}

