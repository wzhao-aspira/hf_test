import * as FileSystem from "expo-file-system";

async function cleanUpInvalidFiles({
    folderName,
    downloadableFileIDList,
}: {
    folderName: string;
    downloadableFileIDList: string[];
}) {
    if (!downloadableFileIDList) return;

    try {
        const filesDirectory = `${FileSystem.documentDirectory}${folderName}`;

        const dirInfo = await FileSystem.getInfoAsync(filesDirectory);

        if (dirInfo.exists) {
            // The item value of the dirContents is the id of the file
            const dirContents = await FileSystem.readDirectoryAsync(filesDirectory);
            const downloadedFilesIDList = dirContents;

            const invalidDownloadedFilesIDList = downloadedFilesIDList.filter(
                (id) => !downloadableFileIDList.includes(id)
            );

            invalidDownloadedFilesIDList.forEach((fileID) => {
                FileSystem.deleteAsync(`${filesDirectory}/${fileID}`);
                console.log(`${filesDirectory}/${fileID} deleted`);
            });
        }
    } catch (error) {
        console.log(error);
    }
}

export default cleanUpInvalidFiles;
