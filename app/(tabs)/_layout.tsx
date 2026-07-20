import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useWindowDimensions } from "react-native";

import { colors } from "@/src/globalVars";

let panelcolor = colors.panel;
let orangecolor = colors.lava;

export default function TabLayout() {
    const { width } = useWindowDimensions();
    const adaptiveStyle = {
        tab: {

        }
    }
    return (
        <Tabs screenOptions={{ 
            tabBarActiveTintColor: orangecolor, 
            headerStyle: {
                backgroundColor: panelcolor,
            },
            headerShadowVisible: false,
            headerTintColor: "#fff",
            tabBarStyle: {
                backgroundColor: panelcolor,
                experimental_backgroundImage: "linear-gradient(#1c1b20, #0c0a15)",
                height: width > 600? 150 : 100,
            },
            tabBarLabelStyle: {
                fontSize: width > 600? 18 : 10,
            }
        }}>
            <Tabs.Screen 
                name="index" 
                options={{ 
                    title: "Заметки", 
                    tabBarIcon: ({ color, focused }) => (<Ionicons name={focused? "home-sharp": "home-outline"} color={color} size={24} />) 
                }}/>
            <Tabs.Screen
                name="tasks_index"
                options={{
                    title: "Напоминания",
                    tabBarIcon: ({ color, focused }) => (<Ionicons name={focused? "notifications": "notifications-outline"} color={color} size={24}/>)
                }}
            />
            <Tabs.Screen 
                name="settings" 
                options={{ title: "О приложении",
                tabBarIcon: ({ color, focused }) => (<Ionicons name={focused? "information-circle": "information-circle-outline"} color={color} size={24} />)
                }} 
            />
            <Tabs.Screen 
                name="newNote"
                options={{
                    title: "Новая заметка",
                    href: null,
                }} 
            />
            <Tabs.Screen 
                name="showNote"
                options={{
                    title: "Просмотр",
                    href: null,
                }} 
            />
            <Tabs.Screen 
                name="editNote"
                options={{
                    title: "Редактирование",
                    href: null,
                }} 
            />

            <Tabs.Screen
                name="newTask"
                options={{
                    title: "Новое напоминание",
                    href: null,
                }}
            />
            <Tabs.Screen
                name="mdGuide"
                options={{
                    title: "Памятка по Markdown",
                    href: null,
                }}
            />
        </Tabs>
    );
}