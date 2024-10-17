/* eslint-disable no-async-promise-executor */
import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import { getHeaderCaseInsensitive, getMaxAge, isCacheableMethod, isCachedExpired, isUrlInWhiteList } from "./utils";
import { getCacheInstance } from "./Cache";
import { AxiosCacheOptions, CacheInstance } from "./type";
import MemoryCache from "./MemoryCache";

const CancelType = "CACHE";

let Cache: CacheInstance;

export const getCacheByAxiosConfig = async (config: AxiosRequestConfig) => {
    const { url } = config;
    if (url) {
        return Cache.get(url);
    }
    return undefined;
};

const requestInterceptor = (urlWhiteList: string[] | null) => async (config: AxiosRequestConfig) => {
    const { url } = config;
    // Url in white list and http method in allowed list
    if (isCacheableMethod(config) && isUrlInWhiteList(url, urlWhiteList)) {
        if (!url) {
            return config;
        }

        const lastCached = await Cache.get(url);
        // if cache with max-age and isn't expired, cancel the request and result data from cache
        if (!config.cancelToken && lastCached && lastCached.maxAge && !isCachedExpired(lastCached)) {
            const source = axios.CancelToken.source();
            config.cancelToken = source.token;
            source.cancel(JSON.stringify({ type: CancelType, data: lastCached }), config);
            return config;
        }

        // if the previous response header with etag, add 'If-None-Match' to request header
        if (lastCached && lastCached.etag) {
            config.headers = { ...config.headers, "If-None-Match": lastCached.etag };
        }
    }
    return config;
};

const responseInterceptor =
    (urlWhiteList: string[] | null) =>
    (response: AxiosResponse): Promise<AxiosResponse> => {
        return new Promise<AxiosResponse>((resolve, reject) => {
            const { url } = response.config;
            // Url in white list and http method in allowed list
            if (isCacheableMethod(response.config) && isUrlInWhiteList(url, urlWhiteList)) {
                const responseEtagValue = getHeaderCaseInsensitive("etag", response.headers);
                const responseCacheControlValue = getHeaderCaseInsensitive("cache-control", response.headers);
                const maxAge = getMaxAge(responseCacheControlValue);

                // response header has max-age or etag, save to cache
                if (responseEtagValue || maxAge) {
                    if (!url) {
                        reject(response.config);
                    }
                    Cache.set(url, responseEtagValue, response.data, maxAge);
                }
            }
            resolve(response);
        });
    };

const responseErrorInterceptor =
    (urlWhiteList: string[] | null) =>
    (error: AxiosError): Promise<AxiosError | AxiosResponse> => {
        return new Promise(async (resolve, reject) => {
            const url = error.response?.config?.url;

            if (axios.isCancel(error)) {
                const cancelMessage = JSON.parse(error.message);
                // Cancel cause by cache, response data from cache
                if (cancelMessage.type == CancelType) {
                    const data = cancelMessage.data?.value;
                    const response: AxiosResponse = {
                        data,
                        status: 200,
                        statusText: "OK",
                        headers: {},
                        config: {
                            headers: undefined,
                        },
                    };
                    resolve(response);
                }
            }
            if (error.response && error.response.status === 304 && isUrlInWhiteList(url, urlWhiteList)) {
                const cachedValue = await getCacheByAxiosConfig(error.response.config);
                if (!cachedValue) {
                    reject(error);
                }
                // fix 304 error header with etag. return status=200, get data from cache
                const newResponse: AxiosResponse = error.response;
                newResponse.status = 200;
                newResponse.data = cachedValue.value;
                resolve(newResponse);
            }
            reject(error);
        });
    };

export async function resetCache() {
    await Cache.reset();
}

export function axiosCache(axiosInstance: AxiosInstance, options?: AxiosCacheOptions): AxiosInstance {
    if (options?.cacheClass) {
        Cache = getCacheInstance(options.cacheClass);
    } else {
        Cache = getCacheInstance(MemoryCache);
    }

    axiosInstance.interceptors.request.use(requestInterceptor(options?.urlWhiteList));
    axiosInstance.interceptors.response.use(
        responseInterceptor(options?.urlWhiteList),
        responseErrorInterceptor(options?.urlWhiteList)
    );

    return axiosInstance;
}
