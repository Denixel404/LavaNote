import * as Notifications from 'expo-notifications';

async function requestNotificationsPermission() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === "granted") {
        return true;
    } else {
        return false;
    }
}