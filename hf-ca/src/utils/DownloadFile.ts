import * as FileSystem from 'expo-file-system';
import { formatDownloadURL } from "../screens/regulation/detail/hooks/useFileOperations";
import contentDispositionParser from "./contentDispositionParser";

const downloadFile = async ({ url, folder, onStart, onComplete, onError }: { url: string, folder: string, onStart: () => void, onComplete: () => void, onError: () => void }) => {
    try {
        if (onStart) {
            onStart();
        }

        const formattedDownloadURL = formatDownloadURL(url);
        const folderUri = `${FileSystem.documentDirectory}${folder}/${formattedDownloadURL}/`;
        await FileSystem.makeDirectoryAsync(folderUri, { intermediates: true });
        const tempFileName = url?.split("/")?.pop();
        const tempDestinationUri = folderUri + tempFileName;
        const result = await FileSystem.downloadAsync(url, tempDestinationUri);
        if (result.status !== 200) {
            if (onError) {
                onError();
            }
            return;
        }
        const contentDispositionValue = result.headers?.["Content-Disposition"] as string;
        const fileName =
            // @ts-expect-error
            contentDispositionValue && contentDispositionParser(contentDispositionValue)?.filename;
        if (!!fileName) {
            const destinationUri = folderUri + fileName;
            await FileSystem.moveAsync({
                from: encodeURI(tempDestinationUri),
                to: encodeURI(destinationUri),
            });
        }

        if (onComplete) {
            onComplete();
        }
    } catch (error) {
        if (onError) {
            onError();
        }
    }
};

export default downloadFile;

