import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import FileViewer from "react-native-file-viewer";

import { useAppDispatch } from "../../../../hooks/redux";
import { handleError } from "../../../../network/APIUtil";

import { isAndroid, showToast } from "../../../../helper/AppHelper";
import Routers, { useAppNavigation } from "../../../../constants/Routers";
import { useDialog } from "../../../../components/dialog/index";
import contentDispositionParser from "../../../../utils/contentDispositionParser";

type FileStatus = "unknown" | "not downloaded yet" | "downloading" | "downloaded";

export function formatDownloadURL(downloadURL: string) {
    return downloadURL.replace(/\W/g, "_");
}

function useDownloadFile({ downloadURL, folderName = "" }: { downloadURL: string; folderName: string }) {
    const dispatch = useAppDispatch();
    const navigation = useAppNavigation();
    const { openSimpleDialog } = useDialog();
    const formattedDownloadURL = formatDownloadURL(downloadURL);
    const fileDirectory = `${FileSystem.documentDirectory}${folderName}/${formattedDownloadURL}`;

    const [status, setStatus] = useState<FileStatus>("unknown");

    const checkFileStatus = useCallback(async () => {
        const fileInfo = await FileSystem.getInfoAsync(fileDirectory);

        if (fileInfo.exists) setStatus("downloaded");
        else setStatus("not downloaded yet");
    }, [fileDirectory]);

    useEffect(() => {
        checkFileStatus();
    }, [checkFileStatus, fileDirectory]);

    async function downloadFile() {
        setStatus("downloading");

        const handleErrorResult = await handleError(axios.get<File>(downloadURL, { responseType: "blob" }), {
            dispatch,
            showLoading: true,
        });

        const { data: response, success } = handleErrorResult;

        if (!success) {
            checkFileStatus();
            return;
        }

        const fr = new FileReader();

        fr.onload = async () => {
            try {
                const contentDispositionValue = response?.headers?.["content-disposition"] as string;

                const fileNameFromContentDisposition =
                    // @ts-expect-error
                    contentDispositionValue && contentDispositionParser(contentDispositionValue)?.filename;
                const fileName = fileNameFromContentDisposition || downloadURL?.split("/")?.pop();

                if (!fileName) {
                    setStatus("not downloaded yet");
                    showToast("can not get the filename");
                    return;
                }

                const fileURI = `${fileDirectory}/${fileName}`;

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

                const errorMessage = error?.message;
                if (errorMessage) showToast(errorMessage);

                console.log({ error });
            }
        };

        const blobFileData = response.data;
        fr.readAsDataURL(blobFileData); // Read the blob data as a data URL
    }

    async function openFile() {
        const fileNameList = await FileSystem.readDirectoryAsync(fileDirectory);

        const fileName = fileNameList[0];

        const fileURI = `${fileDirectory}/${fileName}`;

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
                        openSimpleDialog({
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
            checkFileStatus();
            console.log("File deleted successfully");
        } else {
            console.log("File not found");
        }
    }

    return { status, downloadFile, openFile, deleteFile };
}

export default useDownloadFile;
