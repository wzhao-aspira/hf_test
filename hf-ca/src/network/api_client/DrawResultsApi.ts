import { instance } from "../AxiosClient";
import getAPIConfig from "../APIConfig";

import { DrawResultsApi } from "../generated";

export async function getActivePermitsByCustomerId(customerId: string) {
    const api = new DrawResultsApi(getAPIConfig(), null, instance);
    return api.v1CustomersCustomerIdActivePermitsGet(customerId);
}

export async function downloadNotification(drawTicketLicenseId: string, cancelToken) {
    const api = new DrawResultsApi(getAPIConfig(), null, instance);

    return api.buildNotificationAsync(drawTicketLicenseId, { responseType: "blob", cancelToken });
}

export async function downloadAttachment(fileId: string, cancelToken) {
    const api = new DrawResultsApi(getAPIConfig(), null, instance);
    return api.buildAttachmentAsync(fileId, { responseType: "blob", cancelToken });
}

export async function getDrawApplicationListByCustomerId(customerId: string) {
    const api = new DrawResultsApi(getAPIConfig(), null, instance);
    return api.v1CustomersCustomerIdDrawResultsGet(customerId);
}

export type { ActivePermitListVM } from "../generated";
