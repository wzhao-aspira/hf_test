import axios from "axios";
import { startsWith } from "lodash";
import { getBaseURL, getActiveUserID, getAppStaticInfo } from "../helper/AppHelper";
import { needRefreshToken } from "./tokenUtil";
import { globalDataForAPI, url } from "./commonUtil";
import { refreshToken } from "./identityAPI";
import { whiteList, StorageCache, axiosCache } from "./cache";
import { storeItem } from "../helper/StorageHelper";
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

function checkIsHTMLResponse(response) {
    // Check the Content-Type header
    if (response.headers["content-type"].indexOf("text/html") !== -1) {
        return true;
    }

    // Check if tags exist in response
    if (response.data?.includes && response.data?.includes("<html>")) {
        return true;
    }
    return false;
}

instance.interceptors.response.use((response) => {
    const isHTMLResponse = checkIsHTMLResponse(response);
    if (isHTMLResponse) {
        console.log("isHTMLResponse", isHTMLResponse);
        const error = new Error("Service Unavailable");
        error.response = response;
        error.status = 503;
        error.code = "ServiceUnavailable";
        throw error;
    }

    return response;
});

export async function clearLastUpdateDate() {
    await storeItem(KEY_CONSTANT.lastUpdateDate, "");
}

async function saveLastUpdateDateIntoLocalStorage(lastUpdatedDate) {
    if (lastUpdatedDate) await storeItem(KEY_CONSTANT.lastUpdateDate, lastUpdatedDate);
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
