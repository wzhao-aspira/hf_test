import { instance } from "../AxiosClient";
import getAPIConfig from "../APIConfig";

import { PreferencePointsApi } from "../generated";

export async function getPreferencePoints(profileId: string) {
    const api = new PreferencePointsApi(getAPIConfig(), null, instance);
    return api.v1CustomersCustomerIdPreferencePointsGet(profileId);
}
