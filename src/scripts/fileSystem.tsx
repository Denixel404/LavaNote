import { File, Directory, Paths } from "expo-file-system";
import { router } from "expo-router";

const folder_name = "LavaNote"; // Имя папки с данными приложения
const dir = `${Paths.document}${folder_name}`; // Путь к основной папке

export async function fileSystemInit() {
    console.log("Initialization file structure...");
    const main_folder = new Directory(Paths.document, folder_name);
    if (!(await main_folder.exists)) {
        await main_folder.create({ intermediates: true, idempotent: true });
        console.log("FileSystem: main folder was created");
    } else {
        console.log("FileSystem: main folder already exists")
    }

    const data_folder = new Directory(Paths.document.uri + folder_name, "data");
    const categories_file = new File(Paths.document.uri + folder_name + "/data", "categories.txt");
    if (!(data_folder.exists)) {
        await data_folder.create({ intermediates: true, idempotent: true });
        console.log("FileSystem: data folder was created");
    } else {
        console.log("FileSystem: data folder already exists");
    }

    if (!(categories_file.exists)) {
        await categories_file.create();
        await categories_file.write("Важное, Моё");
        console.log("FileSystem: categories file was created");
    } else {
        console.log("FileSystem: categories file already exists");
    }

    const tasks_folder = new Directory(Paths.document.uri + folder_name + "/" + "data", "tasks");
    if (!(tasks_folder.exists)) { 
        await tasks_folder.create({ intermediates: true, idempotent: true });
        console.log("FileSystem: tasks folder was created");
    } else {
        console.log("FileSystem: tasks folder already exists");
    }
    // console.log(`FileSystem: ${folder_name}: ${main_folder.list()}`);
    // console.log(`FileSystem: data: ${data_folder.list()}`);
    // console.log(`FileSystem: tasks: ${tasks_folder.list()}`);
    console.log("Initialization file structure complete!\n");
}

export async function createFile(filename: string, content: string[], category: string) { // Создание новой заметки
    console.log("");
    const folder = new Directory(Paths.document, folder_name) 
    await folder.create({ intermediates: true, idempotent: true }); // Создани основной папки если ее нет
    console.log("FileSystem: folder ready");
    const noteMassive = {"title": content[0], "text": content[1], "category": [category]}; 
    
    const file = new File(folder, filename);
    if (!(await file.exists)){ // Проверка на существование файла
        await file.create();
        console.log("[i] FileSystem: new file was created")
    } else {
        console.warn("[WARN] FileSystem: file already exist")
    }

    await file.write(JSON.stringify(noteMassive)); // Запись информации в файл
    const cont = await file.text(); // Получение данных из файла
    const contParse = JSON.parse(cont);
    //console.log(`FileSystem: file saved in ${file.uri}`);
    //console.log(`FileSystem: read file\n${contParse}\n`);
    router.navigate("../"); // Переадресация обратно
    //console.log(deleteFolder());
    //console.log(`FileSystem dir: ${getData()}`);
}

export async function readFile(filename: string) { // Получение информации из файла
    const folder = new Directory(Paths.document, folder_name);
    const file = new File(folder, filename);
    return await file.text();
}

export async function readDataFile(filename: string) {
    const folder = new Directory(Paths.document.uri + folder_name, "data");
    const file = new File(folder, filename);
    return await file.text();
}

export async function writeFile(filename: string, content: string) { // Перезапись файла
    const folder = new Directory(Paths.document, folder_name);
    const file = new File(folder, filename);
    await file.write(content);
}

export async function writeDataFile(filename: string, content: string) {
    const folder = new Directory(Paths.document.uri + folder_name, "data");
    const file = new File(folder, filename);
    await file.write(content)
}

export async function renameFile(filename: string, newName: string) { // Переименование файла
    const folder = new Directory(Paths.document, folder_name);
    const file = new File(folder, filename);
    await file.rename(newName);
}

export async function deleteFolder() { // Удаление основной директории приложения
    const targetFolder = new Directory(Paths.document.uri + folder_name + "/data", "tasks");
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
    //console.log(`FileSystem: file ${filename} info\n${info[2]}`);
}

export async function deleteFile(filename: string) { // Удаление файла
    const folder = new Directory(Paths.document, folder_name);
    const file = new File(folder, filename);
    await file.delete(); 
    console.log(`FileSystem: file ${filename} was deleted`);
}

export async function saveDataReminder(data: any, filename: string) { // Сохранить файл напоминания
    const jsonData = JSON.stringify(data);
    const folder = new Directory(Paths.document.uri + folder_name + "/data", "tasks");
    const file = new File(folder, filename);
    if (!(await file.exists)){ // Проверка на существование файла
        await file.create();
        console.log("[i] FileSystem: new file was created")
    } else {
        console.warn("[WARN] FileSystem: file already exist")
    }
    await file.write(jsonData);
    //console.log(`fileSystem: Task created: ${folder.list()}`)
}

export async function getTaskText(filename: string) { // Получение текста напоминания
    const folder = new Directory(Paths.document.uri + folder_name + "/data", "tasks");
    const file = new File(folder, filename);
    const content = await file.text();
    const massive = JSON.parse(content);
    return massive["text"];
}

export async function readTask(filename: string) { // Чтение и получение информации о напоминании
    const folder = new Directory(Paths.document.uri + folder_name + "/data", "tasks");
    const file = new File(folder, filename);
    const content = await file.text();
    const massive = JSON.parse(content);
    return massive;   
}

export async function  getTasks() { // Получение списка всех напоминаний
    const workDir = new Directory(Paths.document.uri + "LavaNote" + "/data", "tasks");
    const objects_list = await workDir.list();
    const files = objects_list.filter(item => item instanceof File);
    return files;
}

export async function deleteTask(filename: string) { // Удаление файла
    const folder = new Directory(Paths.document.uri + folder_name + "/data", "tasks");
    const file = new File(folder, filename);
    await file.delete(); 
    console.log(`FileSystem: file ${filename} was deleted`);
}

