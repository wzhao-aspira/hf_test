import { instance } from "../AxiosClient";
import getAPIConfig from "../APIConfig";

import { CustomersApi } from "../generated";

export async function getProfiles() {
    const api = new CustomersApi(getAPIConfig(), null, instance);
    return api.v1CustomersLinksGet();
}

export async function findAndLinkAuditProfile(findIndividualVM) {
    const api = new CustomersApi(getAPIConfig(), null, instance);
    return api.v1CustomersLinksAdultPost(findIndividualVM);
}

export async function findAndLinkYouthProfile(findYouthVM) {
    const api = new CustomersApi(getAPIConfig(), null, instance);
    return api.v1CustomersLinksYouthPost(findYouthVM);
}

export async function findAndLinkBusinessProfile(findBusinessVM) {
    const api = new CustomersApi(getAPIConfig(), null, instance);
    return api.v1CustomersLinksBusinessPost(findBusinessVM);
}

export async function findAndLinkVesselProfile(findVesselVM) {
    const api = new CustomersApi(getAPIConfig(), null, instance);
    return api.v1CustomersLinksVesselPost(findVesselVM);
}
