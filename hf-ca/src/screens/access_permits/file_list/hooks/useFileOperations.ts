import { useState, useEffect } from "react";
import * as FileSystem from "expo-file-system";
import FileViewer from "react-native-file-viewer";

import { useAppDispatch } from "../../../../hooks/redux";
import { handleError } from "../../../../network/APIUtil";
import {
    downloadAccessPermitNotification,
    downloadAccessPermitAttachment,
} from "../../../../network/api_client/DrawResultsApi";

import { isAndroid, showToast } from "../../../../helper/AppHelper";
import Routers, { useAppNavigation } from "../../../../constants/Routers";
import DialogHelper from "../../../../helper/DialogHelper";

type FileStatus = "unknown" | "not downloaded yet" | "downloading" | "downloaded";
type FileTypes = "notificationPDF" | "attachment";

function useDownloadFile({
    fileID,
    fileType,
    fileName,
    downloadID,
    folderName = "",
}: {
    fileID: string;
    fileType: FileTypes;
    fileName: string;
    downloadID: string;
    folderName: string;
}) {
    const dispatch = useAppDispatch();
    const navigation = useAppNavigation();

    const fileDirectory = `${FileSystem.documentDirectory}${folderName}/${fileID}`;
    const fileURI = `${fileDirectory}/${fileName}`;

    const [status, setStatus] = useState<FileStatus>("unknown");

    useEffect(() => {
        async function checkFileStatus() {
            const fileInfo = await FileSystem.getInfoAsync(fileURI);

            if (fileInfo.exists) setStatus("downloaded");
            else setStatus("not downloaded yet");
        }
        checkFileStatus();
    }, [fileURI]);

    async function downloadFile() {
        setStatus("downloading");

        const handleErrorResult = await handleError(
            (fileType === "notificationPDF" && downloadAccessPermitNotification(downloadID)) ||
                (fileType === "attachment" && downloadAccessPermitAttachment(downloadID)),
            {
                dispatch,
                showLoading: true,
            }
        );

        const { data: response, success } = handleErrorResult;

        if (!success) {
            setStatus("not downloaded yet");
            return;
        }

        const blobFileData = response.data;

        const fr = new FileReader();

        fr.onload = async () => {
            try {
                await FileSystem.makeDirectoryAsync(fileDirectory, { intermediates: true });
                await FileSystem.writeAsStringAsync(
                    fileURI,
                    // @ts-expect-error
                    fr.result.split(",")[1], // The blob data in base64 format
                    { encoding: FileSystem.EncodingType.Base64 } // Specify that the encoding type is base64
                );

                setStatus("downloaded");
                console.log(`The file ${fileURI} saved`);
            } catch (error) {
                setStatus("not downloaded yet");
                console.log({ error });
            }
        };

        fr.readAsDataURL(blobFileData); // Read the blob data as a data URL
    }

    function openFile() {
        if (!fileURI) {
            return;
        }

        if (isAndroid()) {
            FileViewer.open(fileURI)
                .then(() => {
                    console.log(`${fileURI} file opened`);
                })
                .catch((error) => {
                    console.log(error);

                    const errorMessage = error?.message;

                    if (errorMessage === "No app associated with this mime type") {
                        DialogHelper.showSimpleDialog({
                            message: `Sorry, this file ${fileName} cannot be opened because there is no app associated with its format on your device. Please try to find and install an app that can handle this format.`,
                            okText: "common.gotIt",
                        });
                    } else {
                        showToast(errorMessage);
                    }
                });
        } else {
            navigation.navigate(Routers.webView, {
                url: fileURI,
            });
        }
    }

    async function deleteFile() {
        const fileInfo = await FileSystem.getInfoAsync(fileDirectory);

        if (fileInfo.exists) {
            await FileSystem.deleteAsync(fileDirectory);
            setStatus("not downloaded yet");
            console.log("File deleted successfully");
        } else {
            console.log("File not found");
        }
    }

    return { status, downloadFile, openFile, deleteFile };
}

export default useDownloadFile;
