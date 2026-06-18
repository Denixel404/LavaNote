import * as Notifications from 'expo-notifications';

export async function requestNotificationsPermission() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === "granted") {
        return true;
    } else {
        return false;
    }
}