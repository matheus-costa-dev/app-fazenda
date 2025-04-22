import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import AuthWrapper from "../components/AuthWrapper";
import LogoutButton from "../components/LogoutButton";
import { headerColor, statusBarBG, styles} from "../styles/header"

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthWrapper>
        <Stack
          screenOptions={{
            headerShown: false,
            headerStyle: styles.header,
            headerTitleAlign: "center",
            headerRight: () => <LogoutButton />,
            statusBarBackgroundColor:statusBarBG,
            headerTintColor:headerColor

          }}
        />
      </AuthWrapper>
    </AuthProvider>
  );
}

