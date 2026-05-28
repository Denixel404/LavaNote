import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

let panelcolor = "#07091b";
let orangecolor = "#e05807";

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ 
            tabBarActiveTintColor: orangecolor, 
            headerStyle: {
                backgroundColor: panelcolor
            },
            headerShadowVisible: false,
            headerTintColor: "#fff",
            tabBarStyle: {
                backgroundColor: panelcolor
            }
        }}>
            <Tabs.Screen 
                name="index" 
                options={{ 
                    title: "Заметки", 
                    tabBarIcon: ({ color, focused }) => (<Ionicons name={focused? "home-sharp": "home-outline"} color={color} size={24} />) 
                    }} />
            <Tabs.Screen 
                name="settings" 
                options={{ title: "О приложении",
                tabBarIcon: ({ color, focused }) => (<Ionicons name={focused? "information-circle": "information-circle-outline"} color={color} size={24} />)
                }} />
            <Tabs.Screen 
                name="newNote"
                options={{
                    title: "Новая заметка",
                    href: null,
                }} />
            <Tabs.Screen 
                name="showNote"
                options={{
                    title: "Просмотр",
                    href: null,
                }} />
        </Tabs>
    );
}