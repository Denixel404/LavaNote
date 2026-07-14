import * as secureStore from "expo-secure-store";
import { hashSHA256, getRandomBytes } from "rn-encryption";
import { writeDataFile, readDataFile } from "./fileSystem";

const password_name = "LNpassword"; // Имя ячейки для пароля в защищённом хранилище
const password_salt_name = "LNpasswordSalt"; // Имя ячейки для соли пароля в защищённом хранилище

export async function generateSalt(lenght: number) { // Генерация случайной соли для хеша
    return await getRandomBytes(lenght); // 
}

export async function isHasPassword() { // Проверка на существования пароля в защищённом хранилище
    const passwordHash = await secureStore.getItemAsync(password_name);
    if (passwordHash) return true;
    else return false;
};

export function hashPassword(password: string, salt: string) { // Вычисления хеша
    return hashSHA256(password + salt);
};

export async function saveNewPassword(newPassword: string) { // Сохранение нового пароля в безопасном виде
    const salt = await generateSalt(16);
    const passwordHash = hashPassword(newPassword, salt);
    await secureStore.setItemAsync(password_salt_name, salt);
    await secureStore.setItemAsync(password_name, passwordHash);

    const appSettingsJson = await readDataFile("settings.json");
    const appSettings = JSON.parse(appSettingsJson);
    appSettings.hasPassword = true;
    await writeDataFile("settings.json", JSON.stringify(appSettings));
    console.warn("app password was been changed");
}

export async function verifyPassword(password: string) { // Верификация пароля
    const passHash = await secureStore.getItemAsync(password_name);
    const salt = await secureStore.getItemAsync(password_salt_name);
    if ((!passHash) || (!salt)) {
        console.error("Password verify error: salt or password's hash not exists");
        return false;
    }
    const getHash = hashPassword(password, salt);
    if (getHash === passHash) {
        console.log("verify password! Unlock app...");
        return true;
    } else {
        console.log("Uncorrect password. Try again");
        return false;
    }
}

export async function deleteAppPassword() { // Удаление пароля из защищённого хранилища
    await secureStore.deleteItemAsync(password_name);
    await secureStore.deleteItemAsync(password_salt_name);
    console.warn("app password with salt was deleted")
}
