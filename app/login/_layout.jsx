import { Stack } from "expo-router";

export default function LoginLayout(){
    return <Stack 
            screenOptions={{
                title: "Login",
                headerTitleAlign: "center",
                headerBackButtonMenuEnabled: false
            }}
        />
}