import CustomButton from "@/components/CustomButton";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "expo-router";
import { headerStyles } from "@/styles/app";


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
        customTouchableStyle={headerStyles.logout.customTouchableStyle}
        customButtonStyle={headerStyles.logout.customButtonStyle}
        onPressIn={handleLogout}
      />
    );
  }
  