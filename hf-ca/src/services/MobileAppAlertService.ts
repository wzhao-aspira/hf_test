import { KEY_CONSTANT } from "../constants/Constants";
import {
    getAllPendingSynchronizeObjects,
    getMobileAppAlertRealmQuery,
    markAsSynchronized,
    markMobileAppAlertAsReadDbCommand,
    saveMobileAppAlertData,
} from "../db/MobileAppAlert";
import { retrieveItem, storeItem } from "../helper/StorageHelper";
import {
    getMobileAppAlert,
    markMobileAppAlertAsRead as markMobileAppAlertAsReadAPI,
} from "../network/api_client/MobileAppAlertAPIs";
import { isEmpty } from "lodash";
import { MarkMobileAppIdAsReadVM } from "../network/generated/api";
import { MobileAppAlert } from "../types/mobileAppAlert";

async function getMobileAppAlertDataFromAPI() {
    const searchResult = await getMobileAppAlert();
    const lastUpdateTime = searchResult?.headers?.["last-updated-date"];
    const { result, errors } = searchResult.data;
    const alertList = result;

    const formattedResult = alertList.map((x) => {
        return {
            ...x,
            needSynchronizeReadState: false,
        } as MobileAppAlert;
    });

    return { formattedResult, lastUpdateTime, errors };
}

export async function getMobileAppAlertData() {
    await syncMobileAppAlertReadStatusIfNecessary();
    const requestResult = await getMobileAppAlertDataFromAPI();
    const { formattedResult, lastUpdateTime, errors } = requestResult;
    if (!isEmpty(formattedResult)) {
        await saveMobileAppAlertData(formattedResult);
        await storeItem(`${KEY_CONSTANT.keyIsEmptyMobileAppAlertOnlineDataCached}`, false);
        await storeItem(`${KEY_CONSTANT.mobileAppAlertLastUpdateTime}`, lastUpdateTime);
    } else {
        await storeItem(`${KEY_CONSTANT.keyIsEmptyMobileAppAlertOnlineDataCached}`, true);
    }

    return { formattedResult, errors };
}

export async function isMobileAppAlertEmptyResultCached() {
    const isEmptyResultCached = await retrieveItem(KEY_CONSTANT.keyIsEmptyMobileAppAlertOnlineDataCached);
    if (isEmptyResultCached == null) {
        return false;
    }
    return isEmptyResultCached;
}

export async function getMobileAppAlertDataFromDB() {
    const dbResult = await getMobileAppAlertRealmQuery();
    if (!dbResult) {
        return undefined;
    }
    return dbResult.map((x) => x);
}

export async function getMobileAppAlertLastUpdateTimeDataFromCache() {
    const lastUpdateTime = await retrieveItem(KEY_CONSTANT.mobileAppAlertLastUpdateTime);
    return lastUpdateTime;
}

export async function markMobileAppAlertAsRead(markAsReadVms: Array<MarkMobileAppIdAsReadVM>) {
    const result = await markMobileAppAlertAsReadAPI(markAsReadVms);
    return result;
}

export async function markMobileAppAlertAsReadInDB(markAsReadVms: Array<MarkMobileAppIdAsReadVM>) {
    return await markMobileAppAlertAsReadDbCommand(markAsReadVms);
}

export async function syncMobileAppAlertReadStatusIfNecessary() {
    console.log("Mobild App Alert - Finding locally pending synchronization data");
    const realmObjects = await getAllPendingSynchronizeObjects();
    const markMobileAppAlertAsReadReadVMs = realmObjects.map((x) => {
        return {
            mobileAppAlertId: x.mobileAppAlertId,
            readDate: x.readDate,
        };
    });

    if (markMobileAppAlertAsReadReadVMs && markMobileAppAlertAsReadReadVMs[0]) {
        const ids = markMobileAppAlertAsReadReadVMs.map((x) => x.mobileAppAlertId).join(",");
        console.log(`Mobile App Alert - ${ids} is waiting for synchronization`);
        const synchronizeResult = await markMobileAppAlertAsRead(markMobileAppAlertAsReadReadVMs);

        if (synchronizeResult?.data?.isValidResponse) {
            markAsSynchronized(markMobileAppAlertAsReadReadVMs);
            console.log(`Mobile App Alert - ${ids} synchronized`);
            return { hasSynchronizedData: true };
        }
    }

    return { hasSynchronizedData: false };
}
