/* eslint-disable import/prefer-default-export */
import moment from "moment";
import { BaseCache, Cacheable, CacheInstance, CacheValue } from "./type";

let instance;

export const getCacheInstance = (CacheClass: Cacheable<BaseCache>): CacheInstance => {
    if (!instance) {
        const cache = new CacheClass();
        return {
            async get(url: string): Promise<CacheValue | undefined> {
                let cacheValue: CacheValue = await cache.get(url);
                if (cacheValue) {
                    cacheValue = { ...cacheValue, lastHitAt: moment().unix() };
                    cache.set(url, cacheValue);
                }
                return cacheValue;
            },
            set(url: string, etag: string, value: any, maxAge: number | null) {
                return cache.set(url, { etag, value, createdAt: moment().unix(), lastHitAt: 0, maxAge });
            },
            reset() {
                cache.flushAll();
            },
        };
    }
    return instance;
};
