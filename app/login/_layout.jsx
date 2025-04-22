import { Stack } from "expo-router";
import { headerColor, statusBarBG, styles} from "../../styles/header"


export default function LoginLayout(){
    return <Stack 
            screenOptions={{
                title: "Login",
                headerTitleAlign: "center",
                headerBackButtonMenuEnabled: false,
                headerStyle: styles.header,
                statusBarBackgroundColor:statusBarBG,
                headerTintColor:headerColor
            }}
        />
}