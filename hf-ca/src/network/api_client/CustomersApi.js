import { instance } from "../AxiosClient";
import getAPIConfig from "../APIConfig";

import { CustomersApi } from "../generated";

const api = new CustomersApi(getAPIConfig(), null, instance);
export async function findAndLinkAuditProfile(findIndividualVM) {
    return api.v1CustomersLinksAdultPost(findIndividualVM);
}

export async function findAndLinkYouthProfile(findYouthVM) {
    return api.v1CustomersLinksYouthPost(findYouthVM);
}

export async function findAndLinkBusinessProfile(findBusinessVM) {
    return api.v1CustomersLinksBusinessPost(findBusinessVM);
}

export async function findAndLinkVesselProfile(findVesselVM) {
    return api.v1CustomersLinksVesselPost(findVesselVM);
}
