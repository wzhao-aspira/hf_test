import { isEqual } from "lodash";
import * as FileSystem from "expo-file-system";
import { Image } from "expo-image";
import { retrieveItem, storeItem } from "../helper/StorageHelper";
import { KEY_CONSTANT } from "../constants/Constants";
import { isImageFormat } from "../utils/GenUtil";
import { getAppConfigs } from "../network/api_client/StaticDataApi";
import { MobileAppConfigurationVM } from "../network/generated";

export const appConfig: { data: MobileAppConfigurationVM } = {
    data: null,
};

const LOGIN_SPLASH_FILE_NAME = "login_splash";
const LOADING_SPLASH_FILE_NAME = "loading_splash";

export async function getLoadingSplashFromFile() {
    const { exists } = await FileSystem.getInfoAsync(
        `${FileSystem.documentDirectory}${LOADING_SPLASH_FILE_NAME}.jpg`
    ).catch();
    if (exists) {
        return { uri: `${FileSystem.documentDirectory}${LOADING_SPLASH_FILE_NAME}.jpg?${Math.random()}` };
    }
    return undefined;
}

export async function getAppConfigData() {
    const jsonData = await getAppConfig();
    appConfig.data = jsonData;
}

async function cacheImage(url: string, localStorageKey: string, fileName: string) {
    console.log(`cacheImage url:${url},localStorageKey:${localStorageKey},fileName:${fileName}`);

    const localCache = await retrieveItem(localStorageKey);
    if (url && !isEqual(localCache, url)) {
        console.log("start download");

        const res = await FileSystem.downloadAsync(url, `${FileSystem.documentDirectory}${fileName}_tmp.jpg`, {
            cache: false,
        }).catch((e) => console.log(e));
        const { status, mimeType, headers } = res || {};
        const contentType = headers?.["content-type"] || headers?.["Content-Type"];
        console.log("contentType", contentType);
        if (status == 200 && (isImageFormat(contentType) || isImageFormat(mimeType))) {
            console.log(`downloadSuccess:${fileName}`);
            await FileSystem.moveAsync({
                from: `${FileSystem.documentDirectory}${fileName}_tmp.jpg`,
                to: `${FileSystem.documentDirectory}${fileName}.jpg`,
            }).catch((e) => console.log(e));
            await storeItem(localStorageKey, url);
            await Image.clearDiskCache();
        }
    }
}

export async function fetchPicture() {
    const jsonData = appConfig.data;
    try {
        const remoteLoginSplash = jsonData.mobileAppLandingPagePicture[0];
        cacheImage(remoteLoginSplash, KEY_CONSTANT.keyLoginSplash, LOGIN_SPLASH_FILE_NAME);

        const remoteLoadingSplash = jsonData.mobileAppSplashPicture;
        cacheImage(remoteLoadingSplash, KEY_CONSTANT.keyAppLoadingSplash, LOADING_SPLASH_FILE_NAME);
    } catch (error) {
        console.log(error);
    }
}

async function getAppConfig() {
    try {
        const result = await getAppConfigs();
        const data = result?.data.result;
        await storeItem(KEY_CONSTANT.keyAppConfig, data);
        return data;
    } catch (error) {
        console.log(error);
        // get app config failed, then get data from storage.
        const config = await getAppConfigFromCache();
        if (!config) {
            console.log("app config api error and not storage data");
            throw error;
        }
        console.log("app config api error, get data from storage");
        return config;
    }
}

async function getAppConfigFromCache(): Promise<MobileAppConfigurationVM> {
    const config = await retrieveItem(KEY_CONSTANT.keyAppConfig);
    return config;
}
