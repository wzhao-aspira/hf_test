import { instance } from "../AxiosClient";
import getAPIConfig from "../APIConfig";

import { MobileAppAlertsApi } from "../generated";
import type { MarkMobileAppIdAsReadVM } from "../generated";
export async function getMobileAppAlert() {
    const api = new MobileAppAlertsApi(getAPIConfig(), null, instance);
    return await api.v1MobileAppAlertsGet();
}

export async function markMobileAppAlertAsRead(markMobileAppIdAsReadVMs: Array<MarkMobileAppIdAsReadVM>) {
    const api = new MobileAppAlertsApi(getAPIConfig(), null, instance);
    return await api.v1MobileAppAlertsPut(markMobileAppIdAsReadVMs);
}
