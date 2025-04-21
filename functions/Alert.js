import { Platform, Alert } from "react-native";

export function AlertMessage(message){
    const system = Platform.OS;

    if (system === "android" || system === "ios") {
        Alert.alert("Erro", message)
    } else {
        alert(message)
    }
}


