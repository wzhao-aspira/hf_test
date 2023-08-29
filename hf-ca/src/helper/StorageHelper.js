import AsyncStorage from "@react-native-async-storage/async-storage";

export async function storeItem(key, item) {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
        console.log(error.message);
    }
}

export async function retrieveItem(key) {
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
    let keys = [];
    try {
        keys = await AsyncStorage.getAllKeys();
    } catch (error) {
        console.log(error.message);
    }

    return keys;
}
