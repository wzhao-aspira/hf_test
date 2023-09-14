import { BaseCache, CacheValue } from "./type";

class MemoryCache extends BaseCache {
    private cache = {};

    get(key: string): Promise<CacheValue | undefined> {
        return Promise.resolve(this.cache[key]);
    }

    set(key: string, value: CacheValue) {
        this.cache[key] = value;
    }

    flushAll() {
        this.cache = {};
    }
}

export default MemoryCache;
