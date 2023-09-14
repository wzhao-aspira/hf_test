export interface Cacheable<T> {
    new (...args: any): T;
}

export interface CacheValue {
    etag: string;
    value: any;
    maxAge?: number;
    createdAt: number;
    lastHitAt: number;
}

export interface CacheInstance {
    get(url: string): Promise<CacheValue | undefined>;
    set(url: string, etag: string, value: any, maxAge: number | null);
    reset();
}

export abstract class BaseCache {
    abstract get(key: string): Promise<CacheValue | undefined>;
    abstract set(key: string, value: CacheValue);
    abstract flushAll();
}

export interface AxiosCacheOptions {
    cacheClass?: Cacheable<BaseCache>;
    urlWhiteList: string[] | null;
}
