import { File, Paths } from "expo-file-system";

export function createFile(path: string, content: string) {
    try {
        const file = new File(Paths.document, path);
        file.create();
        file.write(content);
        console.log(file.textSync());
    } catch (error) {
        console.error(`FileSystem create error: ${error}`)
    }
}
