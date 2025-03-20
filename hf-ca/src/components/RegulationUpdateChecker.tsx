import { handleError } from "../network/APIUtil";
import DialogHelper from "../helper/DialogHelper";
import { getRegulations } from "../network/api_client/StaticDataApi";
import { RegulationUpdateNotification } from "./RegulationUpdateNotification";
import { formatDownloadURL } from "../screens/regulation/detail/hooks/useFileOperations";
import * as FileSystem from "expo-file-system";
import { getAllRegulations, saveRegulationDownloadInfo } from "../db/Regulation";
import { RegulationList } from "../network/generated";
import { regulationBackgroupDownload, setAllowsCellularUpdateRegulation, markDownloadAsNotified } from "../services/RegulationService";
import { RegulationUpdateStatus } from "../constants/RegulationUpdateStatus";
import { REGULATON_DOWNLOAD_FOLDER } from "../constants/Constants";

export async function checkRegulationUpdate() {
    console.log("init allows cellular update regulation");
    setAllowsCellularUpdateRegulation(-1);

    const response = await handleError(getRegulations(), {
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
    const { isValidResponse, result } = data;
    if (!isValidResponse) {
        return;
    }

    const regulationWithETagResult = result?.regulationList;
    if (!(regulationWithETagResult && regulationWithETagResult.length > 0)) {
        return;
    }

    const downloadedRegulations: any = getAllRegulations();
    await syncRegulationDownloadData(regulationWithETagResult, downloadedRegulations);

    let needDownloadRegulations = [];
    const outdetedRegulations = downloadedRegulations.filter(n => regulationWithETagResult.some(m => m.regulationId === n.regulationId && !!m.regulationETag && m.regulationETag !== n.downloadedRegulationETag && m.eTagTimestamp > n.downloadedTimestamp));
    if (outdetedRegulations.length > 0) {
        needDownloadRegulations = needDownloadRegulations.concat(outdetedRegulations);
    }

    const preDownloadingRegulations = downloadedRegulations.filter(n => [RegulationUpdateStatus.AutoUpdateQueued, RegulationUpdateStatus.AutoUpdateStarted, RegulationUpdateStatus.AutoUpdateFailed].includes(n.regulationStatus));
    if (preDownloadingRegulations && preDownloadingRegulations.length > 0) {
        preDownloadingRegulations.forEach(r => {
            if (!needDownloadRegulations.some(m => m.regulationId === r.regulationId)) {
                needDownloadRegulations.push(r);
            }
        });
    }

    //if regulations were previously downloaded but the user has not yet viewed them, the user will be notified once.
    notifyUnviewedUpdatedRegulations(downloadedRegulations, needDownloadRegulations);
    regulationBackgroupDownload(needDownloadRegulations);
}

function notifyUnviewedUpdatedRegulations(downloadedRegulations: any, needDownloadRegulations: any) {
    const unNotifiedRegulations = downloadedRegulations.filter(n => n.regulationStatus === RegulationUpdateStatus.AutoUpdateCompleted && !needDownloadRegulations.some(m => m.regulationId == n.regulationId));
    if (unNotifiedRegulations && unNotifiedRegulations.length > 0) {
        DialogHelper.showCustomDialog({
            renderDialogContent: () => <RegulationUpdateNotification {...{ outdetedRegulations: unNotifiedRegulations }} />
        });
        markDownloadAsNotified(unNotifiedRegulations);
    }
}

async function syncRegulationDownloadData(regulationWithETagResult: RegulationList[], downloadedRegulations: any) {
    //Sync url for downloads and retries
    downloadedRegulations.forEach(r => {
        const eTaginfo = regulationWithETagResult.find(n => !!n.regulationETag && n.regulationId === r.regulationId);
        if (r.regulationUrl !== eTaginfo.regulationUrl) {
            r.regulationUrl = eTaginfo.regulationUrl;
            saveRegulationDownloadInfo(r);
        }
    });

    //Use the latest retrieved ETag to repair the previously downloaded records that lack download ETag info so that file changes can be detected next time.
    const noDownloadedInfoRegulations = regulationWithETagResult.filter(n => !!n.regulationETag && !downloadedRegulations.some(m => m.regulationId === n.regulationId));
    noDownloadedInfoRegulations.forEach(async n => {
        const formattedDownloadURL = formatDownloadURL(n.regulationUrl);
        const fileDirectory = `${FileSystem.documentDirectory}${REGULATON_DOWNLOAD_FOLDER}/${formattedDownloadURL}`;
        const fileInfo = await FileSystem.getInfoAsync(fileDirectory);
        if (fileInfo.exists) {
            const saveObject = { ...n, downloadedPath: fileDirectory, downloadedRegulationETag: n.regulationETag, downloadedTimestamp: n.eTagTimestamp, regulationStatus: RegulationUpdateStatus.Finished };
            saveRegulationDownloadInfo(saveObject);
        }
    });
}
