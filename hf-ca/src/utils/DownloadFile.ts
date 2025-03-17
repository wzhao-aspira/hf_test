import * as FileSystem from 'expo-file-system';
import { formatDownloadURL } from "../screens/regulation/detail/hooks/useFileOperations";
import contentDispositionParser from "./contentDispositionParser";

const downloadFile = async ({ url, folder, onStart, onComplete, onError }: { url: string, folder: string, onStart: () => void, onComplete: (downloadResult: FileSystem.FileSystemDownloadResult, folderUri: string) => void, onError: () => void }) => {
    try {
        onStart?.();

        const formattedDownloadURL = formatDownloadURL(url);
        const tempFolderUri = `${FileSystem.documentDirectory}temp${folder}/${formattedDownloadURL}/`;
        await FileSystem.makeDirectoryAsync(tempFolderUri, { intermediates: true });
        const tempFileName = "tempfile";
        const tempDestinationUri = tempFolderUri + tempFileName;
        const result = await FileSystem.downloadAsync(url, tempDestinationUri);
        if (result.status !== 200) {
            onError?.();
            return;
        }

        const folderUri = `${FileSystem.documentDirectory}${folder}/${formattedDownloadURL}/`;
        //Delete previously downloaded files   
        const preFileDirectory = await FileSystem.getInfoAsync(folderUri);
        if (preFileDirectory.exists) {
            await FileSystem.deleteAsync(folderUri);
            console.log("Previously downloaded files deleted successfully");
        }
        await FileSystem.makeDirectoryAsync(folderUri, { intermediates: true });

        const contentDispositionValue = result.headers?.["Content-Disposition"] as string;
        let fileName =
            // @ts-expect-error
            contentDispositionValue && contentDispositionParser(contentDispositionValue)?.filename;
        if (!fileName) {
            fileName = url?.split("/")?.pop();
        }

        const destinationUri = folderUri + fileName;
        await FileSystem.moveAsync({
            from: encodeURI(tempDestinationUri),
            to: encodeURI(destinationUri),
        });

        onComplete?.(result, folderUri);

    } catch (error) {
        onError?.();
    }
};

export default downloadFile;

