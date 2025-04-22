import { Stack, useRouter } from "expo-router";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import AuthWrapper from "../components/AuthWrapper";
import {  StyleSheet } from "react-native";
import LogoutButton from "../components/LogoutButton";

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthWrapper>
        <Stack
          screenOptions={{
            headerShown: false,
            headerTitleAlign: "center",
            headerRight: () => <LogoutButton />
          }}
        />
      </AuthWrapper>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  customTouchableStyle:{
    backgroundColor: "#A62C2C",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: "auto",
    marginRight: 10,
  },
  customButtonStyle:{
    color: "#fff",
    fontSize: 16,
  },

})