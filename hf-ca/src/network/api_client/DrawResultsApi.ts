/* eslint-disable import/prefer-default-export */
import { instance } from "../AxiosClient";
import getAPIConfig from "../APIConfig";

import { DrawResultsApi } from "../generated";

export async function getActivePermitsByCustomerId(customerId: string) {
    const api = new DrawResultsApi(getAPIConfig(), null, instance);
    return api.v1CustomersCustomerIdActivePermitsGet(customerId);
}
