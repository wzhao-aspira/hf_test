import { instance } from "../AxiosClient";
import { StaticDataApi } from "../generated";
import getAPIConfig from "../APIConfig";

export async function getIdentityTypes() {
    const api = new StaticDataApi(getAPIConfig(false), null, instance);
    return api.v1StaticDataIdentityTypesGet();
}

export async function getYouthIdentityOwners() {
    const api = new StaticDataApi(getAPIConfig(false), null, instance);
    return api.v1StaticDataYouthIdentityOwnersGet();
}

export async function getCountries() {
    const api = new StaticDataApi(getAPIConfig(false), null, instance);
    return api.v1StaticDataCountriesGet();
}

export async function getStates() {
    const api = new StaticDataApi(getAPIConfig(false), null, instance);
    return api.v1StaticDataStatesGet();
}

export async function getAppConfigs() {
    const api = new StaticDataApi(getAPIConfig(false), null, instance);
    return api.v1StaticDataAppConfigsGet();
}
