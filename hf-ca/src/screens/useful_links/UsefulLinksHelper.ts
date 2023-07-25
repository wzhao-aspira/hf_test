import { DeviceEventEmitter } from "react-native";
import * as FileSystem from "expo-file-system";
import { isEmpty } from "lodash";
import { t } from "i18next";
import { getDownloadFileName, isPDFUrl } from "../../utils/GenUtil";
import { storeItem, retrieveItem } from "../../helper/StorageHelper";
import { KEY_CONSTANT } from "../../constants/Constants";
import usefulLinksService from "../../services/UsefulLinksService";

import type { UsefulLinkData } from "../../types/usefulLink";

export const usefulLinksPDFPath = `${FileSystem.documentDirectory}usefulLinksPDF/`;

export const ingString = "_ing";

export const downloadProgressKey = "downloadProgress";
export const downloadSuccessKey = "downloadSuccess";
export const downloadFailKey = "downloadFail";
export const downloadCompleteKey = "downloadComplete";

export async function getDownloadedCountAsync(path: string, usefulLinksData: UsefulLinkData[]) {
    try {
        let count = 0;

        const fileInfo = await FileSystem.getInfoAsync(path);

        if (fileInfo.exists) {
            const arr = await FileSystem.readDirectoryAsync(path);

            for (let i = 0; i < arr.length; i++) {
                const filename = arr[i];
                console.log(`read local file: ${filename}`);
                if (isPDFUrl(filename) && !isEmpty(usefulLinksData)) {
                    for (let j = 0; j < usefulLinksData.length; j++) {
                        const data = usefulLinksData[j];
                        if (getDownloadFileName(data.url) == filename) {
                            count += 1;
                        }
                    }
                }
            }

            return count;
        }
    } catch (error) {
        console.error(error);
    }

    return null;
}

export async function checkIfNewVersionAdded(callBack: Function) {
    const keyStr = KEY_CONSTANT.usefulLinks;
    const savedUsefulLinksData = await retrieveItem(keyStr);
    const usefulLinksData = await usefulLinksService.getUsefulLinksData();

    if (isEmpty(savedUsefulLinksData)) {
        callBack();
        storeItem(keyStr, JSON.stringify(usefulLinksData));
        return;
    }

    const savedData = JSON.parse(savedUsefulLinksData);
    const diffData = getDiffData(savedData, usefulLinksData);

    // usefulLinks data + saved data, and remove duplicated by id
    const contactData = usefulLinksData.concat(savedData).filter((element, index, array) => {
        const v = array.findIndex((item) => item.id === element.id);
        return index === v;
    });

    // get all id from firebase data
    const dataIds = [];
    const allData = usefulLinksData;

    allData.forEach((ele) => {
        dataIds.push(ele.id);
    });

    // sync with firebase data, get deleted data
    const deletedData = contactData.filter((i) => !dataIds.includes(i.id));
    const deletedDataIds = [];
    deletedData.forEach((ele) => {
        deletedDataIds.push(ele.id);
    });

    storeItem(keyStr, JSON.stringify(contactData.filter((i) => !deletedDataIds.includes(i.id))));
    callBack(isEmpty(diffData) ? null : diffData);
}

export function getDiffData(savedData: UsefulLinkData[], usefulLinksData: UsefulLinkData[]) {
    const savedRegIds = [];
    savedData.forEach((ele) => {
        savedRegIds.push(ele.id);
    });
    return usefulLinksData.filter((i) => {
        return (
            // add new item, or tile or url not match
            !savedRegIds.includes(i.id) ||
            savedData.filter(
                (j) =>
                    j.id === i.id &&
                    (j.title != i.title || j.url != i.url || j.description != i.description || j.size != i.size)
            ).length === 1
        );
    });
}

export function downloadFile(usefulLinkData: UsefulLinkData) {
    // get file name from url
    const item = { ...usefulLinkData };
    const filename = getDownloadFileName(item.url);
    const PDFFileFolderPath = usefulLinksPDFPath;
    const path = PDFFileFolderPath + filename + ingString; // _ing means downloading
    console.log(`local path:${path}`);

    const callback = (downloadProgress) => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        DeviceEventEmitter.emit(downloadProgressKey, item, progress);
    };

    const downloadResumable = FileSystem.createDownloadResumable(item.url, path, {}, callback);

    FileSystem.makeDirectoryAsync(PDFFileFolderPath)
        .then(() => {
            console.log("create folder successful!");
        })
        .catch(() => {
            console.log("folder is exist!");
        })
        .finally(() => {
            (async () => {
                try {
                    const downloadResponse = await downloadResumable.downloadAsync();

                    console.log("The response from the server: ", downloadResponse);

                    if (downloadResponse && downloadResponse.status === 200) {
                        DeviceEventEmitter.emit(downloadSuccessKey, path, item);
                    } else {
                        console.log("Incorrect status from the server, delete the temporary download file if existed");
                        const file = await FileSystem.getInfoAsync(path);
                        if (file.exists) {
                            await FileSystem.deleteAsync(path);
                        }
                        const errMsg = t("usefulLinks.downloadFailedLinkIssueMsg");
                        DeviceEventEmitter.emit(downloadFailKey, errMsg, item);
                    }
                } catch (error) {
                    const errMsg = t("usefulLinks.downloadFailedMsg");
                    DeviceEventEmitter.emit(downloadFailKey, errMsg, item);
                } finally {
                    DeviceEventEmitter.emit(downloadCompleteKey, item);
                }
            })();
        });
}

export async function clearUnusedDownloadedFiles() {
    const dirInfo = await FileSystem.getInfoAsync(usefulLinksPDFPath);
    console.log(dirInfo);

    if (dirInfo.exists) {
        const dirUri = `${dirInfo.uri}/`;
        const downloadFiles = await FileSystem.readDirectoryAsync(dirUri);
        console.log(`downloadFiles:${JSON.stringify(downloadFiles)}`);

        const latestUsefulLinksData = await usefulLinksService.getUsefulLinksData();
        const savedUsefulLinksData = (await JSON.parse(
            await retrieveItem(KEY_CONSTANT.usefulLinks)
        )) as UsefulLinkData[];

        console.log({ latestUsefulLinksData, savedUsefulLinksData, downloadFiles, dirUri });

        if (!isEmpty(latestUsefulLinksData) && !isEmpty(downloadFiles)) {
            // delete files
            const deleteFiles: string[] = [];

            const dirFiles = await FileSystem.readDirectoryAsync(dirUri);

            if (!isEmpty(dirFiles)) {
                for (let i = 0; i < dirFiles.length; i++) {
                    const ele = dirFiles[i];
                    let exist = false;
                    for (let j = 0; j < latestUsefulLinksData.length; j++) {
                        if (ele == getDownloadFileName(latestUsefulLinksData[j]?.url)) {
                            exist = true;
                            break;
                        }
                    }
                    if (!exist) {
                        deleteFiles.push(dirUri + ele);
                    }
                }
            }

            if (!isEmpty(savedUsefulLinksData)) {
                const diffData = getDiffData(savedUsefulLinksData, latestUsefulLinksData);
                for (let i = 0; i < diffData.length; i++) {
                    const v1 = diffData[i];
                    for (let j = 0; j < savedUsefulLinksData.length; j++) {
                        const v2 = savedUsefulLinksData[j];
                        if (v1.id === v2.id && isPDFUrl(v2.url)) {
                            deleteFiles.push(dirUri + getDownloadFileName(v2.url));
                            break;
                        }
                    }
                }
            }

            console.log(`delete filename:${JSON.stringify(deleteFiles)}`);

            if (!isEmpty(deleteFiles)) {
                await Promise.all(
                    [...new Set(deleteFiles)].map(async (k) => {
                        const fileInfo = await FileSystem.getInfoAsync(k);
                        if (fileInfo.exists) {
                            await FileSystem.deleteAsync(k);
                        }
                    })
                );
            }
        }
    }
}
