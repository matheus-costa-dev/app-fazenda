import {TouchableOpacity, StyleSheet} from "react-native"
import {Ionicons} from "@expo/vector-icons"

export default function FloatButton({ onPress, iconName }) {
    return (
        <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
            <Ionicons name={iconName} style={styles.iconButton} />
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
    buttonContainer: {
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "#3F704D",
        borderRadius: 50,
        width: 60,
        height: 60,
        margin: 10,
        alignItems: "center",
        justifyContent: "center",
        elevation: 5,
        boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.3)", 
        zIndex: 10,
    },
    iconButton: {
        fontSize: 30,
        color: "#fff",
    }
})