import * as notifications from "expo-notifications";
import { Platform } from "react-native";

import { colors } from "../globalVars";

export async function notificationsInit() {
  if (Platform.OS === "android") { // проверка вида операционной системы
    await notifications.setNotificationChannelAsync("default", { // Создание канала для push-уведомлений
      name: "Основной канал", // Название канала (отображается в настройках)
      importance: notifications.AndroidImportance.MAX, // Приоритет в системе
      vibrationPattern: [0, 255, 255, 255],
      lightColor: colors.lava, // Цвет темы
    });
  }
  const { status: permissionExisting } = await notifications.getPermissionsAsync();
  let finalPermission = permissionExisting;
  if (permissionExisting !== "granted") { // Проверка: есть ли разрешения
    const { status } = await notifications.requestPermissionsAsync();
    finalPermission = status; 
  }
  if (finalPermission !== "granted") { // Проверка на получение разрешений
    console.warn("notificationsSystem: permissions not exists");
  } else {
    console.log("notificationsSystem: get permissions");
  }
}

export async function deleteNotification(id: string) { // Отменить запланированное уведомление
  try {
    await notifications.cancelScheduledNotificationAsync(id)
    console.log("notificationsSystem: notification was deleted");
  } catch (error) {
    console.error(`notificationsSystem: Error: ${error}`)
  }
}

