import { instance } from "../AxiosClient";
import { StaticDataApi } from "../generated";
import getConfig from "../APIConfig";

export async function getIdentityTypes() {
    const api = new StaticDataApi(getConfig(), null, instance);
    return api.v1StaticDataIdentityTypesGet();
}

export async function getYouthIdentityOwners() {
    const api = new StaticDataApi(getConfig(), null, instance);
    return api.v1StaticDataYouthIdentityOwnersGet();
}

export async function getCountries() {
    const api = new StaticDataApi(getConfig(), null, instance);
    return api.v1StaticDataCountriesGet();
}

export async function getStates() {
    const api = new StaticDataApi(getConfig(), null, instance);
    return api.v1StaticDataStatesGet();
}
