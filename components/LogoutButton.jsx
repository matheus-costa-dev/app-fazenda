import CustomButton from "@/components/CustomButton";
import { StyleSheet } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "expo-router";
import { AlertMessage } from "@/functions/Alert";



export default function LogoutButton() {
    const { signOut } = useAuth();
    const router = useRouter();
    const handleLogout = () => {

      try {
        signOut();
        router.replace("/login")
      } catch (error) {
        console.error(error)
      }
 
    };
  
    return (
      <CustomButton
        buttonText={"Logout"}
        customTouchableStyle={styles.customTouchableStyle}
        customButtonStyle={styles.customButtonStyle}
        onPressIn={handleLogout}
      />
    );
  }

  const styles = StyleSheet.create({
    customTouchableStyle:   {
      backgroundColor: "#A62C2C",
      borderRadius: 20,
      marginBottom:"10%"
    },
    customButtonStyle: {
      color: "#fff",
      fontSize: 12,
    },
  });
