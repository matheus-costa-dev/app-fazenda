import CustomButton from "@/components/CustomButton";
import { StyleSheet } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "expo-router";

export default function LogoutButton() {
    const { signOut } = useAuth();
    const router = useRouter();
  
    const handleLogout = () => {
      signOut();
      router.replace("/")
    };
  
    return (
      <CustomButton
        buttonText={"Logout"}
        customTouchableStyle={styles.customTouchableStyle}
        customButtonStyle={styles.customButtonStyle}
        onPress={handleLogout}
      />
    );
  }

  const styles = StyleSheet.create({
    customTouchableStyle: {
      backgroundColor: "#A62C2C",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
      marginBottom: "auto",
      marginRight: 10,
    },
    customButtonStyle: {
      color: "#fff",
      fontSize: 16,
    },
  });