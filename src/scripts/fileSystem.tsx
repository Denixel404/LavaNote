import { File, Directory, Paths } from "expo-file-system";
import { router, useRouter } from "expo-router";

export async function createFile(filenane: string, content: string[]) { // Создание новой заметки
    let folder_name = "LavaNote"; // 

    const folder = new Directory(Paths.document, folder_name) 
    await folder.create({ intermediates: true, idempotent: true }); // Создани основной папки если ее нет
    console.log("FileSystem: folder ready")
    
    const file = new File(Paths.document, filenane);
    if (!(await file.exists)){ // Проверка на существование файла
        await file.create();
        console.log("[i] FileSystem: new file was created")
    } else {
        console.warn("[WARN] FileSystem: file already exist")
    }

    await file.write(`${content[0]}\n${content[1]}`); // Запись информации в файл
    const cont = await file.text(); // Получение данных из файла
    console.log(`FileSystem: read file\n${cont}\n`);
    router.navigate("../"); // Переадресация обратно
    
}
