import { File, Directory, Paths } from "expo-file-system";
import { router } from "expo-router";

const folder_name = "LavaNote"; // Имя папки с данными приложения
const dir = `${Paths.document}${folder_name}`; // Путь к основной папке

export async function createFile(filenane: string, content: string[]) { // Создание новой заметки
    console.log("");
    const folder = new Directory(Paths.document, folder_name) 
    await folder.create({ intermediates: true, idempotent: true }); // Создани основной папки если ее нет
    console.log("FileSystem: folder ready")
    
    const file = new File(folder, filenane);
    if (!(await file.exists)){ // Проверка на существование файла
        await file.create();
        console.log("[i] FileSystem: new file was created")
    } else {
        console.warn("[WARN] FileSystem: file already exist")
    }

    await file.write(`${content[0]}\n${content[1]}`); // Запись информации в файл
    const cont = await file.text(); // Получение данных из файла
    console.log(`FileSystem: file saved in ${file.uri}`);
    console.log(`FileSystem: read file\n${cont}\n`);
    router.navigate("../"); // Переадресация обратно
    //console.log(deleteFolder());
    //console.log(`FileSystem dir: ${getData()}`);
}

export async function readFile(filename: string) { // Получение информации из файла
    const folder = new Directory(Paths.document, folder_name);
    const file = new File(folder, filename);
    return await file.text();
}

export async function writeFile(filename: string, content: string) { // Перезапись файла
    const folder = new Directory(Paths.document, folder_name);
    const file = new File(folder, filename);
    await file.write(content);
}

export async function renameFile(filename: string, newName: string) { // Переименование файла
    const folder = new Directory(Paths.document, folder_name);
    const file = new File(folder, filename);
    await file.rename(newName);
}

async function deleteFolder() { // Удаление основной директории приложения
    const targetFolder = new Directory(Paths.document, "LavaNoter");
    if (!targetFolder.exists) {
        console.log("Папка не существует");
        return;
    }
    await targetFolder.delete()
    console.log("Папка удалена");
}

export async function  getData() { // Получение списка всех заметок
    const workDir = new Directory(Paths.document, "LavaNote");
    const objects_list = await workDir.list();
    const files = objects_list.filter(item => item instanceof File);
    return files;
}

export async function getFileInfo(filename: string) { // Получение информации о файле
    const folder = new Directory(Paths.document, folder_name);
    const file = new File(folder, filename);

    const infoObj = await file.info();
    const info = [infoObj.uri, infoObj.size, infoObj.modificationTime, infoObj.size, infoObj.uri]
    console.log(`FileSystem: file ${filename} info\n${info[2]}`);
}

export async function deleteFile(filename: string) { // Удаление файла
    const folder = new Directory(Paths.document, folder_name);
    const file = new File(folder, filename);
    await file.delete(); 
    console.log(`FileSystem: file ${filename} was deleted`);
}

