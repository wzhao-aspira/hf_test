import { handleError } from "../network/APIUtil";
import DialogHelper from "../helper/DialogHelper";
import { getRegulationETags } from "../network/api_client/StaticDataApi";
import { RegulationUpdateNotification } from "./RegulationUpdateNotification";
import { formatDownloadURL } from "../screens/regulation/detail/hooks/useFileOperations";
import { folderName } from "../screens/regulation/detail/RegulationDetailScreen";
import * as FileSystem from "expo-file-system";

import {
    getAllRegulations,
    markRegulationAsOutdated,
    saveRegulationDownloadInfo
} from "../db/Regulation";
import { RegulationETagVM } from "../network/generated";

export async function checkRegulationUpdate() {
    const response = await handleError(getRegulationETags(), {
        showError: false,
        showLoading: false,
        dispatch: null
    });
    const { success, error } = response;
    if (!success) {
        console.log(error);
        return;
    }
    const { data } = response.data;
    const { isValidResponse, result: eTagResult } = data;
    if (!isValidResponse) {
        return;
    }
    if (!eTagResult || eTagResult.length === 0) {
        return;
    }
    const downloadedRegulations: any = getAllRegulations();
    const outdetedRegulations = downloadedRegulations.filter(n => eTagResult.some(m => m.regulationId === n.regulationId && !!m.regulationETag && m.regulationETag !== n.downloadedRegulationETag && m.eTagTimestamp > n.downloadedTimestamp));
    if (outdetedRegulations.length > 0) {
        markRegulationAsOutdated(outdetedRegulations.map(n => n.regulationId));
        DialogHelper.showCustomDialog({
            renderDialogContent: () => <RegulationUpdateNotification {...{ outdetedRegulations: outdetedRegulations }} />
        });
    }
    //Use the latest retrieved ETag to repair the previously downloaded records that lack download ETag info so that file changes can be detected next time.
    fixHistoricalDownloadedData(eTagResult, downloadedRegulations);
}

export async function fixHistoricalDownloadedData(eTagResult: RegulationETagVM[], downloadedRegulations: any) {
    const noDownloadedInfoRegulations = eTagResult.filter(n => !!n.regulationETag && !downloadedRegulations.some(m => m.regulationId == n.regulationId));
    noDownloadedInfoRegulations.forEach(async n => {
        const formattedDownloadURL = formatDownloadURL(n.regulationUrl);
        const fileDirectory = `${FileSystem.documentDirectory}${folderName}/${formattedDownloadURL}`;
        const fileInfo = await FileSystem.getInfoAsync(fileDirectory);
        if (fileInfo.exists) {
            const saveObject = { ...n, downloadedPath: fileDirectory, downloadedRegulationETag: n.regulationETag, downloadedTimestamp: n.eTagTimestamp, regulationStatus: 1 };
            saveRegulationDownloadInfo(saveObject);
        }
    });
}
