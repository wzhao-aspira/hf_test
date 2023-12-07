import axios from "axios";
import { startsWith } from "lodash";
import { getBaseURL, getActiveUserID, getAppStaticInfo } from "../helper/AppHelper";
import { needRefreshToken } from "./tokenUtil";
import { globalDataForAPI, url } from "./commonUtil";
import { refreshToken } from "./identityAPI";
import { whiteList, StorageCache, axiosCache } from "./cache";
import { retrieveItem, storeItem } from "../helper/StorageHelper";
import { KEY_CONSTANT } from "../constants/Constants";

export const instance = axiosCache(
    axios.create({
        timeout: 60 * 1000, // 60 seconds
        headers: {
            AppStaticInfo: getAppStaticInfo(),
        },
    }),
    { cacheClass: StorageCache, urlWhiteList: whiteList }
);

async function request(endpoint, options = { method: "get" }) {
    instance.defaults.baseURL = getBaseURL();
    console.log("url", endpoint);
    if (startsWith(endpoint, "https://")) {
        instance.defaults.baseURL = null;
    }
    const requestBody = { ...options, url: endpoint };
    return instance.request(requestBody);
}

instance.interceptors.request.use(async (cfg) => {
    if (needRefreshToken() && !cfg.url?.startsWith(url)) {
        const userId = await getActiveUserID();
        await refreshToken(instance, userId);
        const config = {
            ...cfg,
            headers: {
                ...cfg.headers,
                Authorization: `Bearer ${globalDataForAPI.jwtToken.access_token}`,
            },
        };
        return config;
    }
    return cfg;
});

export async function clearLastUpdateDate() {
    await storeItem(KEY_CONSTANT.lastUpdateDateOfCustomers, JSON.stringify({}));
}

async function saveLastUpdateDateIntoLocalStorage(lastUpdatedDate) {
    if (!lastUpdatedDate) return;

    const currentInUseProfileID = await retrieveItem(KEY_CONSTANT.currentInUseProfileID);

    if (currentInUseProfileID && lastUpdatedDate) {
        const lastUpdateDateOfCustomers = await retrieveItem(KEY_CONSTANT.lastUpdateDateOfCustomers);

        if (lastUpdateDateOfCustomers) {
            const parsedLastUpdateDateOfAccounts = JSON.parse(lastUpdateDateOfCustomers);

            parsedLastUpdateDateOfAccounts[currentInUseProfileID] = lastUpdatedDate;

            await storeItem(KEY_CONSTANT.lastUpdateDateOfCustomers, JSON.stringify(parsedLastUpdateDateOfAccounts));
        } else {
            await storeItem(
                KEY_CONSTANT.lastUpdateDateOfCustomers,
                JSON.stringify({
                    [currentInUseProfileID]: lastUpdatedDate,
                })
            );
        }
    }
}

instance.interceptors.response.use((response) => {
    const result = {
        success: true,
        data: response.data,
        headers: {
            "last-updated-date": response.headers["last-updated-date"],
        },
    };

    const lastUpdatedDate = response.headers["last-updated-date"];
    saveLastUpdateDateIntoLocalStorage(lastUpdatedDate);

    return result;
});

export default request;
