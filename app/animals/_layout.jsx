import { Stack } from "expo-router";
import { headerStyles } from "../../styles/app";


export default function AnimalsLayout() {
  return <Stack 
    screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        headerStyle: headerStyles.header,
        headerTintColor:headerStyles.header.color,
        statusBarBackgroundColor:headerStyles.statusbar.backgroundColor,
    }}
  />;
}
