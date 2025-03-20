import { isEmpty } from "lodash";
import { KEY_CONSTANT } from "../constants/Constants";
import { RegulationUpdateStatus } from "../constants/RegulationUpdateStatus";
import { retrieveItem, storeItem } from "../helper/StorageHelper";
import { getRegulations } from "../network/api_client/StaticDataApi";
import DialogHelper from "../helper/DialogHelper";
import notifee, { AndroidImportance, AuthorizationStatus } from '@notifee/react-native';
import { getDefaultAppIcon } from "../helper/ImgHelper";
import { getAllRegulations, saveRegulationDownloadInfo, getRegulationById, updateRegulationStatus } from "../db/Regulation";
import downloadFile from "../utils/DownloadFile";
import NetInfo, { NetInfoStateType } from "@react-native-community/netinfo";
import { appConfig } from "../services/AppConfigService";
import * as FileSystem from 'expo-file-system';
import { REGULATON_DOWNLOAD_FOLDER } from "../constants/Constants";

export async function getRegulationData() {
    const response = await getRegulations();

    return response;
}

export async function saveCacheRegulations(regulationData) {
    if (!isEmpty(regulationData)) {
        await storeItem(KEY_CONSTANT.regulations, regulationData);
    }
}

export async function getCacheRegulations() {
    const cacheRegulations = await retrieveItem(KEY_CONSTANT.regulations);

    return cacheRegulations;
}

export async function getAllowsCellularUpdateRegulation(): Promise<number> {
    return await retrieveItem(KEY_CONSTANT.allowsCellularUpdateRegulation);
}

//-1: not determind; 0: not allow; 1: allow; 
export async function setAllowsCellularUpdateRegulation(status: number): Promise<void> {
    await storeItem(KEY_CONSTANT.allowsCellularUpdateRegulation, status)
}

export async function regulationBackgroupDownload(regulations) {
    if (!regulations || regulations.length < 1) {
        return;
    }

    const versionResult = await retrieveItem(KEY_CONSTANT.keyVersionInfo);
    if (!!versionResult && versionResult.updateOption === 2) {
        return;
    }

    console.log("backgroup download regulations");
    console.log(regulations);

    const { regulationDownloadNetworkConfirmation } = appConfig.data;
    console.log(regulationDownloadNetworkConfirmation);
    initRegulationDownloadQueue(regulations.filter(n => n.regulationStatus !== RegulationUpdateStatus.AutoUpdateQueued));
    const netinfo = await NetInfo.fetch();
    console.log(netinfo);
    if (netinfo.type === NetInfoStateType.cellular) {
        if (await getAllowsCellularUpdateRegulation() === -1) {
            DialogHelper.showSelectDialog({
                title: "Reminder",
                message: regulationDownloadNetworkConfirmation,
                cancelAction: () => {
                    setAllowsCellularUpdateRegulation(0)
                },
                okAction: () => {
                    setAllowsCellularUpdateRegulation(1);
                    regulationFileDownload(regulations);
                },
            });
        }
    } else {
        regulationFileDownload(regulations);
    }
}

export function reDownloadFailedRegulations() {
    const regulations: any = getAllRegulations();
    if (!regulations || regulations.length < 1) {
        return;
    }
    const failedDownloadedRegulations = regulations.filter(n => n.regulationStatus === RegulationUpdateStatus.AutoUpdateFailed);
    regulationFileDownload(failedDownloadedRegulations);
}

export function markDownloadAsNotified(regulations: Array<any>) {
    if (!!regulations && regulations.length > 0) {
        const regulationIds = regulations.map(n => n.regulationId);
        updateRegulationStatus(regulationIds, RegulationUpdateStatus.UpdateNotified);
    }
}

export function markDownloadAsFinishedByID(regulationId: string) {
    const regulationStatusInfo = getRegulationById(regulationId);
    if (
        !!regulationStatusInfo &&
        (regulationStatusInfo.regulationStatus === RegulationUpdateStatus.AutoUpdateCompleted ||
            regulationStatusInfo.regulationStatus === RegulationUpdateStatus.UpdateNotified)
    ) {
        updateRegulationStatus([regulationId], RegulationUpdateStatus.Finished);
    }
}

async function regulationFileDownload(regulations) {
    if (!regulations || regulations.length < 1) {
        return;
    }

    console.log("regulations file download start");
    for (const regulation of regulations) {
        await downloadFile({
            url: regulation.regulationUrl,
            folder: REGULATON_DOWNLOAD_FOLDER,
            onStart: () => markDownloadAsStarted(regulation),
            onComplete: (downloadResult: FileSystem.FileSystemDownloadResult, folderUri: string) => markDownloadAsCompleted(downloadResult, folderUri, regulation),
            onError: () => markDownloadAsFailed(regulation)
        })
    }
}

function initRegulationDownloadQueue(regulations: Array<any>) {
    if (!!regulations && regulations.length > 0) {
        const regulationIds = regulations.map(n => n.regulationId);
        updateRegulationStatus(regulationIds, RegulationUpdateStatus.AutoUpdateQueued);
    }
}

function markDownloadAsStarted(regulation) {
    if (!!regulation) {
        updateRegulationStatus([regulation.regulationId], RegulationUpdateStatus.AutoUpdateStarted);
    }
}

function markDownloadAsFailed(regulation) {
    if (!!regulation) {
        updateRegulationStatus([regulation.regulationId], RegulationUpdateStatus.AutoUpdateFailed);
    }
}

function markDownloadAsCompleted(downloadResult: FileSystem.FileSystemDownloadResult, folderUri: string, regulation) {
    regulation.regulationStatus = RegulationUpdateStatus.AutoUpdateCompleted;
    regulation.downloadedPath = folderUri;
    regulation.downloadedRegulationETag = downloadResult?.headers?.["etag"];
    regulation.downloadedTimestamp = new Date().getTime();
    saveRegulationDownloadInfo(regulation);
    notifyDownloadComplete(regulation.regulationId, regulation.regulationTitle);
}

async function notifyDownloadComplete(regulationId: string, regulationTitle: string) {
    const settings = await notifee.getNotificationSettings();
    const { regulationDownloadedNotificationTitle, regulationDownloadedNotificationBody } = appConfig.data;
    if (settings.authorizationStatus !== AuthorizationStatus.AUTHORIZED) {
        return;
    }
    const channelId = await notifee.createChannel({
        id: 'important',
        name: 'Important Notifications',
        importance: AndroidImportance.HIGH,
    });
    await notifee.displayNotification({
        title: regulationDownloadedNotificationTitle,
        body: regulationDownloadedNotificationBody?.replace("{{RegulationTitle}}", regulationTitle),
        android: {
            channelId,
            importance: AndroidImportance.HIGH,
            smallIcon: "ic_notification",
            largeIcon: getDefaultAppIcon(),
            pressAction: {
                id: 'default',
                launchActivity: 'default'
            },
        },
        data: {
            type: "VIEW_REGULATION",
            id: regulationId
        }
    });
}