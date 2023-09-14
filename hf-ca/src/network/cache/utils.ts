import type { AxiosRequestConfig } from "axios";
import moment from "moment";
import { CacheValue } from "./type";

const toLowerCase = (value) => value.toLowerCase();
const byLowerCase = (toFind) => (value) => toLowerCase(value) === toFind;
const getKeys = (headers) => Object.keys(headers);

const cacheableMethods = ["GET", "HEAD", "POST"];

export const getHeaderCaseInsensitive = (headerName: string, headers = {}) => {
    const key = getKeys(headers).find(byLowerCase(headerName));
    return key ? headers[key] : undefined;
};

export function isCacheableMethod(config: AxiosRequestConfig): boolean {
    if (!config.method) {
        return false;
    }
    return !cacheableMethods.indexOf(config.method.toUpperCase());
}

export const isUrlInWhiteList = (url: string, whiteList: Array<string> | null): boolean => {
    // no whitelist or empty whitelist, all url permit
    if (!whiteList || whiteList.length == 0 || !url) {
        return true;
    }
    const result = whiteList.some((item) => {
        if (url.includes(item)) {
            return true;
        }
        return false;
    });
    return result;
};

export const getMaxAge = (responseCacheControlValue: string): number | null => {
    const maxAge = responseCacheControlValue?.match(/max-age=(\d+)/);
    if (maxAge) {
        return parseInt(maxAge[1]);
    }
    return null;
};

export const isCachedExpired = (cache: CacheValue): boolean => {
    if (moment().unix() - cache.createdAt > cache.maxAge) {
        return true;
    }
    return false;
};
