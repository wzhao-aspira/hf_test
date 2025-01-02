import { handleError } from "../network/APIUtil";
import DialogHelper from "../helper/DialogHelper";
import { getRegulationETags } from "../network/api_client/StaticDataApi";
import { RegulationUpdateNotification } from "./RegulationUpdateNotification";

import {
    getAllRegulations,
    markRegulationAsOutdated
} from "../db/Regulation";

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
    const outdetedRegulations = downloadedRegulations.filter(n => n.regulationStatus !== 2 && eTagResult.some(m => m.regulationId === n.regulationId && !!m.regulationETag && m.regulationETag !== n.downloadedRegulationETag && m.eTagTimestamp > n.downloadedTimestamp));

    if (outdetedRegulations.length > 0) {
        markRegulationAsOutdated(outdetedRegulations.map(n => n.regulationId));

        DialogHelper.showCustomDialog({
            renderDialogContent: () => <RegulationUpdateNotification {...{ outdetedRegulations: outdetedRegulations }} />
        });
    }
}
