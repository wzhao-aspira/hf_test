/* eslint-disable global-require */
import { isEqual } from "lodash";
import * as FileSystem from "expo-file-system";
import { Image } from "expo-image";
import { retrieveItem, storeItem } from "../helper/StorageHelper";
import { KEY_CONSTANT } from "../constants/Constants";
import { isJpgFormat } from "../utils/GenUtil";
import { getAppConfigs } from "../network/api_client/StaticDataApi";
import { MobileAppConfigurationVM } from "../network/generated";

export const appConfig: { data: MobileAppConfigurationVM } = {
    data: null,
};

export async function getAppConfigData() {
    const jsonData = await getAppConfig();
    appConfig.data = jsonData;
    console.log("jsonData", jsonData);
}

export async function fetchPicture() {
    const jsonData = appConfig.data;
    const keyLoginSplash = await retrieveItem(KEY_CONSTANT.keyLoginSplash);
    const remoteLoginSplash = jsonData.mobileAppLandingPagePicture[0];
    if (remoteLoginSplash && !isEqual(keyLoginSplash, remoteLoginSplash)) {
        const { status, mimeType, headers } = await FileSystem.downloadAsync(
            remoteLoginSplash,
            `${FileSystem.documentDirectory}login_splash_tmp.jpg`,
            { cache: false }
        );
        console.log("remoteLoginSplash", remoteLoginSplash);
        console.log(`status, ${status} mimeType, ${mimeType}`);
        const contentType = headers?.["content-type"] || headers?.["Content-Type"];
        console.log("contentType", contentType);
        if (status == 200 && (isJpgFormat(contentType) || isJpgFormat(mimeType))) {
            await FileSystem.moveAsync({
                from: `${FileSystem.documentDirectory}login_splash_tmp.jpg`,
                to: `${FileSystem.documentDirectory}login_splash.jpg`,
            });
            await storeItem(KEY_CONSTANT.keyLoginSplash, remoteLoginSplash);
            await Image.clearDiskCache();
        }
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
