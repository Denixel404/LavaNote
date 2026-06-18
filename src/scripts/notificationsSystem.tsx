import * as notifications from "expo-notifications";
import { saveDataReminder } from "./fileSystem";
import { Platform } from "react-native";

import { colors } from "../globalVars";

export async function notificationsInit() {
  if (Platform.OS === "android") {
    await notifications.setNotificationChannelAsync("default", {
      name: "Основной канал",
      importance: notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 255, 255, 255],
      lightColor: colors.lava,
    });
  }
  const { status: permissionExisting } = await notifications.getPermissionsAsync();
  let finalPermission = permissionExisting;
  if (permissionExisting !== "granted") {
    const { status } = await notifications.requestPermissionsAsync();
    finalPermission = status;
  }
  if (finalPermission !== "granted") {
    console.warn("notificationsSystem: permissions not exists");
  } else {
    console.log("notificationsSystem: get permissions");
  }
}

export async function deleteNotification(id: string) {
  try {
    await notifications.cancelScheduledNotificationAsync(id)
    console.log("notificationsSystem: notification was deleted");
  } catch (error) {
    console.error(`notificationsSystem: Error: ${error}`)
  }
}

