import { KEY_CONSTANT } from "../constants/Constants";
import { retrieveItem, storeItem } from "./StorageHelper";

export default async function getSalesAgentsSearchHistory(profileId) {
    try {
        const result = await retrieveItem(`${profileId}_${KEY_CONSTANT.keySalesAgentsRecentSearch}`);
        if (result) {
            return JSON.parse(result);
        }
    } catch (error) {
        console.log(error);
    }
    return null;
}

export async function insertSearchItem(item, profileId) {
    if (!item) {
        return;
    }
    try {
        const result = await getSalesAgentsSearchHistory(profileId);
        if (result && result.length > 0) {
            let salesAgentRecentSearch = result;
            // Remove exist item that equal to new item
            salesAgentRecentSearch = salesAgentRecentSearch.filter((newItem) => {
                return newItem.text !== item.text;
            });
            // Five items limit
            if (salesAgentRecentSearch.length >= 5) {
                salesAgentRecentSearch = salesAgentRecentSearch.slice(0, salesAgentRecentSearch.length - 1);
            }
            storeItem(
                `${profileId}_${KEY_CONSTANT.keySalesAgentsRecentSearch}`,
                JSON.stringify([item, ...salesAgentRecentSearch])
            );
        } else {
            await storeItem(`${profileId}_${KEY_CONSTANT.keySalesAgentsRecentSearch}`, JSON.stringify([item]));
        }
    } catch (error) {
        console.log(error.message);
    }
}
