import { instance } from "../AxiosClient";
import getAPIConfig from "../APIConfig";

import { LicensesApi } from "../generated";

function getLicensesByCustomerID(customerId: number) {
    const api = new LicensesApi(getAPIConfig(), null, instance);

    return api.v1CustomersCustomerIdLicensesGet(customerId);
}

export default { getLicensesByCustomerID };
