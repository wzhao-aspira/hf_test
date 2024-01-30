import { BaseCache, CacheValue } from "./type";
import { retrieveItem, storeItem, retrieveAllKeys } from "../../helper/StorageHelper";

class StorageCache extends BaseCache {
    flushAll() {
        retrieveAllKeys();
    }

    async get(key: string): Promise<CacheValue | undefined> {
        const cache = await retrieveItem(key);
        if (cache) {
            const data = cache as CacheValue;
            return data;
        }
        return undefined;
    }

    set(key: string, value: CacheValue) {
        storeItem(key, value);
    }
}

export default StorageCache;
