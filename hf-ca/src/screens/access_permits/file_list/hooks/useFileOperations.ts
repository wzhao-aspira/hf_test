import { useState, useEffect } from "react";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";

import { useAppDispatch } from "../../../../hooks/redux";
import { handleError } from "../../../../network/APIUtil";
import { downloadAccessPermitFile } from "../../../../network/api_client/DrawResultsApi";

import { isAndroid } from "../../../../helper/AppHelper";
import Routers, { useAppNavigation } from "../../../../constants/Routers";

type FileStatus = "unknown" | "not downloaded yet" | "downloading" | "downloaded";

function useDownloadFile({
    fileID,
    fileName,
    folderName = "",
}: {
    fileID: string;
    fileName: string;
    folderName: string;
}) {
    const dispatch = useAppDispatch();
    const navigation = useAppNavigation();

    const fileDirectory = `${FileSystem.documentDirectory}${folderName}`;
    const fileURI = `${fileDirectory}/${fileID}-${fileName}.pdf`;

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

        const handleErrorResult = await handleError(downloadAccessPermitFile(fileID), { dispatch, showLoading: true });
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

                console.log(`The file is saved in ${fileURI}`);

                setStatus("downloaded");
            } catch (error) {
                setStatus("not downloaded yet");
            }
        };

        fr.readAsDataURL(blobFileData); // Read the blob data as a data URL
    }

    function openFile() {
        if (!fileURI) {
            return;
        }

        if (isAndroid()) {
            FileSystem.getContentUriAsync(fileURI).then((cUri) => {
                console.log(cUri);
                IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
                    data: cUri,
                    // https://developer.android.com/reference/android/content/Intent#FLAG_GRANT_READ_URI_PERMISSION
                    // flag 1: FLAG_GRANT_READ_URI_PERMISSION
                    flags: 1,
                }).catch((error) => {
                    console.log(`startActivityAsync error:${error}`);
                });
            });
        } else {
            navigation.navigate(Routers.webView, {
                url: fileURI,
                // TODO: to be confirmed with BA
                // title: t("usefulLinks.usefulLinks"),
            });
        }
    }

    async function deleteFile() {
        const fileInfo = await FileSystem.getInfoAsync(fileURI);

        if (fileInfo.exists) {
            await FileSystem.deleteAsync(fileURI);
            setStatus("not downloaded yet");
            console.log("File deleted successfully");
        } else {
            console.log("File not found");
        }
    }

    return { status, downloadFile, openFile, deleteFile };
}

export default useDownloadFile;
