/* eslint-disable import/prefer-default-export */
import { instance } from "../AxiosClient";
import getAPIConfig from "../APIConfig";

import { DrawResultsApi } from "../generated";

export async function getActivePermitsByCustomerId(customerId: string) {
    const api = new DrawResultsApi(getAPIConfig(), null, instance);
    return api.v1CustomersCustomerIdActivePermitsGet(customerId);
}

export async function downloadAccessPermitNotification(drawTicketLicenseId: string) {
    const api = new DrawResultsApi(getAPIConfig(), null, instance);
    return api.buildNotificationAsync(drawTicketLicenseId, { responseType: "blob" });
}

export async function downloadAccessPermitAttachment(fileId: string) {
    const api = new DrawResultsApi(getAPIConfig(), null, instance);
    return api.buildAttachmentAsync(fileId, { responseType: "blob" });
}

export type { ActivePermitListVM } from "../generated";
