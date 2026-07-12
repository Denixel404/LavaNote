import * as secureStore from "expo-secure-store";
import { hashSHA256, getRandomBytes } from "rn-encryption";
import { writeDataFile, readDataFile } from "./fileSystem";

const password_name = "LNpassword";
const password_salt_name = "LNpasswordSalt";

export async function generateSalt(lenght: number) { // 
    return await getRandomBytes(lenght); // 
}

export async function isHasPassword() { //
    const passwordHash = await secureStore.getItemAsync(password_name);
    if (passwordHash) return true;
    else return false;
};

export function hashPassword(password: string, salt: string) { // 
    return hashSHA256(password + salt);
};

export async function saveNewPassword(newPassword: string) { // 
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