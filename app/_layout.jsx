import { Stack, useRouter, useRootNavigationState } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import AuthWrapper from "../components/AuthWrapper";
import LogoutButton from "../components/LogoutButton";
import { headerStyles } from "@/styles/app";
import { useEffect, useRef } from "react";

export default function RootLayout() {
  
  // const router = useRouter();
  // const navigationState = useRootNavigationState();
  // const hasRedirected = useRef(false); // 👈 pra evitar múltiplos redirects

  // useEffect(() => {
  //   if (!navigationState?.key || hasRedirected.current) return;

  //   hasRedirected.current = true; // marca que já redirecionou
  //   router.replace("/test");
  // }, [navigationState]);

 
  return (
    <AuthProvider>
      <AuthWrapper>
        <Stack
          screenOptions={{
            headerShown: false,
            headerTitleAlign: "center",
            headerRight: () => <LogoutButton />,
            headerStyle: headerStyles.header,
            headerTintColor:headerStyles.header.color,
            statusBarBackgroundColor:headerStyles.statusbar.backgroundColor,

          }}
        />
      </AuthWrapper>
    </AuthProvider>
  );
}

