import * as FileSystem from "expo-file-system";

async function cleanUpInvalidFiles({
    folderName,
    downloadableFileIDList,
    profileID,
}: {
    folderName: string;
    downloadableFileIDList: string[];
    profileID?: string;
}) {
    if (!downloadableFileIDList) {
        return;
    }

    try {
        const filesDirectory = profileID
            ? `${FileSystem.documentDirectory}${folderName}/${profileID}` // Files belonging to specific customers
            : `${FileSystem.documentDirectory}${folderName}`; // files not belonging to specific customers

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
