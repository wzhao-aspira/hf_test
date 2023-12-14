import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import type { Canceler } from "axios";
import * as FileSystem from "expo-file-system";
import FileViewer from "react-native-file-viewer";

import { t } from "i18next";

import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { handleError } from "../../../network/APIUtil";
import { downloadNotification, downloadAttachment } from "../../../network/api_client/DrawResultsApi";

import { selectors as ProfileSelector } from "../../../redux/ProfileSlice";

import { isAndroid, showToast } from "../../../helper/AppHelper";
import Routers, { useAppNavigation } from "../../../constants/Routers";
import { useDialog } from "../../dialog/index";

type FileStatus = "unknown" | "not downloaded yet" | "downloading" | "downloaded";
type FileTypes = "notificationPDF" | "attachment";
const cancelDownloadMessage = "download request canceled" as const;

function useFileOperations({
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
    const { openSimpleDialog } = useDialog();

    const currentInUseProfileID = useAppSelector(ProfileSelector.selectCurrentInUseProfileID);

    const fileDirectory = `${FileSystem.documentDirectory}${folderName}/${currentInUseProfileID}/${fileID}`;
    const fileURI = `${fileDirectory}/${fileName}`;

    const cancelDownloadRef = useRef<Canceler>();
    const [status, setStatus] = useState<FileStatus>("unknown");

    const checkFileStatus = useCallback(async () => {
        const fileInfo = await FileSystem.getInfoAsync(fileURI);

        if (fileInfo.exists) setStatus("downloaded");
        else setStatus("not downloaded yet");
    }, [fileURI]);

    useEffect(() => {
        checkFileStatus();
    }, [checkFileStatus, fileURI]);

    async function downloadFile() {
        setStatus("downloading");

        const source = axios.CancelToken.source();
        cancelDownloadRef.current = source.cancel;

        const requestPromise =
            (fileType === "notificationPDF" && downloadNotification(downloadID, source.token)) ||
            (fileType === "attachment" && downloadAttachment(downloadID, source.token));

        const handleErrorResult = await handleError(requestPromise, {
            dispatch,
        });

        const { data: response, success } = handleErrorResult;

        if (!success) {
            checkFileStatus();
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

    function cancelDownload() {
        cancelDownloadRef.current(JSON.stringify(cancelDownloadMessage));
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
                        openSimpleDialog({
                            message: t("notificationAndAttachment.NoAppAssociatedWithThisMimeTypeErrorMessage", {
                                fileName,
                            }),
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

    return { status, downloadFile, cancelDownload, openFile, deleteFile };
}

export default useFileOperations;
