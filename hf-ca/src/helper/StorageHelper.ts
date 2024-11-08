import AsyncStorage from "@react-native-async-storage/async-storage";
import { isUndefined } from "lodash";

export async function storeItem(key, item) {
    if (isUndefined(item) || item === null) {
        await AsyncStorage.removeItem(key);
        return;
    }
    try {
        await AsyncStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
        console.log(error.message);
    }
}

export async function retrieveItem(key: string) {
    try {
        const retrievedItem = await AsyncStorage.getItem(key);
        const item = JSON.parse(retrievedItem);
        return item;
    } catch (error) {
        console.log(error.message);
        return "";
    }
}

export async function retrieveAllKeys() {
    let keys: readonly string[] = [];
    try {
        keys = await AsyncStorage.getAllKeys();
    } catch (error) {
        console.log(error.message);
    }

    return keys;
}
