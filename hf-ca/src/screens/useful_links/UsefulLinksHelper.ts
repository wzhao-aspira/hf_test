import * as FileSystem from "expo-file-system";
import { isEmpty } from "lodash";
import { getDownloadFileName, isPDFUrl } from "../../utils/GenUtil";
import { storeItem, retrieveItem } from "../../helper/StorageHelper";
import { KEY_CONSTANT } from "../../constants/Constants";
import usefulLinksService from "../../services/UsefulLinksService";

import type { UsefulLinkData } from "../../types/usefulLink";

export const usefulLinksPDFPath = `${FileSystem.documentDirectory}usefulLinksPDF/`;

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

export async function checkIfNewVersionAdded(data, callBack) {
    const keyStr = KEY_CONSTANT.usefulLinks;
    const savedUsefulLinksData = await retrieveItem(keyStr);
    if (isEmpty(savedUsefulLinksData)) {
        callBack();
        storeItem(keyStr, JSON.stringify(data));
        return;
    }
    const savedData = JSON.parse(savedUsefulLinksData);
    const usefulLinksData = await getUsefulLinksData();
    const diffData = getDiffData(savedData, usefulLinksData);

    // usefulLinks data + saved data, and remove duplicated by id
    const contactData = usefulLinksData.concat(savedData).filter((element, index, array) => {
        const v = array.findIndex((t) => t.id === element.id);
        return index === v;
    });

    // get all id from firebase data
    const dataIds = [];
    const allData = await getUsefulLinksData();

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

export function getDiffData(savedData, usefulLinksData) {
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

/**
 * @deprecated
 * you can use the getUsefulLinksData function from the usefulLinksService file
 */
export async function getUsefulLinksData() {
    const DATA = await usefulLinksService.getUsefulLinksData();

    return DATA;
}
