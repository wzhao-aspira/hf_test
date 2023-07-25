import { instance } from "../AxiosClient";
import getAPIConfig from "../APIConfig";

import { StaticDataApi } from "../generated";

const api = new StaticDataApi(getAPIConfig(), null, instance);
export async function getIdentityTypes() {
    return api.v1StaticDataIdentityTypesGet();
}

export async function getYouthIdentityOwners() {
    return api.v1StaticDataYouthIdentityOwnersGet();
}

export async function getCountries() {
    return api.v1StaticDataCountriesGet();
}

export async function getStates() {
    return api.v1StaticDataStatesGet();
}
