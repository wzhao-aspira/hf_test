import { isEmpty } from "lodash";
import { getUsefulLinks } from "../network/api_client/StaticDataApi";
import { UsefulLinkData } from "../types/usefulLink";
import { UsefulLinkVM } from "../network/generated";
import { retrieveItem, storeItem } from "../helper/StorageHelper";
import { KEY_CONSTANT } from "../constants/Constants";

function formatUsefulLinksData(list: UsefulLinkVM[] = []) {
    const formattedData = list.map((item) => {
        return {
            description: item.description,
            linkUrl: item.linkUrl,
            title: item.title,
        };
    });
    return formattedData;
}

export async function saveUsefulLinksToCache(usefulLinks: UsefulLinkData[]) {
    if (!isEmpty(usefulLinks)) {
        await storeItem(KEY_CONSTANT.usefulLinks, usefulLinks);
    }
}

export async function getUsefulLinksFromCache() {
    const cacheUsefulLinks = await retrieveItem(KEY_CONSTANT.usefulLinks);

    return cacheUsefulLinks;
}

export async function getUsefulLinksData(): Promise<UsefulLinkData[]> {
    let result = [];
    const response = await getUsefulLinks();
    if (!isEmpty(response?.data?.result)) {
        result = formatUsefulLinksData(response?.data?.result);
    }

    return result;
}

export default {
    getUsefulLinksData,
};
