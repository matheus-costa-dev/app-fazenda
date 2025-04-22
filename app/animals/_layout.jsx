import { Stack } from "expo-router";
import { headerColor, statusBarBG, styles} from "../../styles/header"


export default function AnimalsLayout() {
  return <Stack 
    screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        headerStyle: styles.header,
        statusBarBackgroundColor:statusBarBG,
        headerTintColor:headerColor
    }}
  />;
}
