import { isEmpty } from "lodash";
import { KEY_CONSTANT } from "../constants/Constants";
import { retrieveItem, storeItem } from "../helper/StorageHelper";
import { getRegulations } from "../network/api_client/StaticDataApi";

export async function getRegulationData() {
    const response = await getRegulations();

    return response;
}

export async function saveCacheRegulations(regulationData) {
    if (!isEmpty(regulationData)) {
        await storeItem(KEY_CONSTANT.regulations, regulationData);
    }
}

export async function getCacheRegulations() {
    const cacheRegulations = await retrieveItem(KEY_CONSTANT.regulations);

    return cacheRegulations;
}
