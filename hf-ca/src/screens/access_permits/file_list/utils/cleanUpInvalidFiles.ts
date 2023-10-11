import * as FileSystem from "expo-file-system";
import { AccessPermitItem } from "../../../../types/accessPermit";

async function cleanUpInvalidFiles({
    folderName,
    accessPermitsData,
}: {
    folderName: string;
    accessPermitsData: AccessPermitItem[];
}) {
    if (!accessPermitsData) return;

    try {
        const filesDirectory = `${FileSystem.documentDirectory}${folderName}`;

        const dirInfo = await FileSystem.getInfoAsync(filesDirectory);

        if (dirInfo.exists) {
            // The item value of the dirContents is the id of the file
            const dirContents = await FileSystem.readDirectoryAsync(filesDirectory);
            const downloadedFilesIDList = dirContents;

            // Use the flatMap function to get the file info list from each hunt day in each access permit
            const fileInfoList = accessPermitsData.flatMap((accessPermit) =>
                accessPermit.huntDays.flatMap((huntDay) => huntDay.fileInfoList)
            );
            const fileIDList = fileInfoList.map((fileInfo) => fileInfo.id).filter((fileID) => fileID);

            const invalidDownloadedFilesIDList = downloadedFilesIDList.filter((id) => !fileIDList.includes(id));

            invalidDownloadedFilesIDList.forEach((fileID) => {
                FileSystem.deleteAsync(`${filesDirectory}/${fileID}`);
            });
        }
    } catch (error) {
        console.log(error);
    }
}

export default cleanUpInvalidFiles;
