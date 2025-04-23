import { Stack } from "expo-router";
import { headerStyles } from "@/styles/app";


export default function LoginLayout(){
    return <Stack 
            screenOptions={{
                title: "Login",
                headerTitleAlign: "center",
                headerBackButtonMenuEnabled: false,
                headerStyle: headerStyles.header,
                headerTintColor:headerStyles.header.color,
                statusBarBackgroundColor:headerStyles.statusbar.backgroundColor,
            }}
        />
}