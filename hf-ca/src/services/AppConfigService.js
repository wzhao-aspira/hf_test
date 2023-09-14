/* eslint-disable global-require */
import { isEqual } from "lodash";
import * as FileSystem from "expo-file-system";
import { Image } from "expo-image";
import { retrieveItem, storeItem } from "../helper/StorageHelper";
import { KEY_CONSTANT } from "../constants/Constants";
import { isJpgFormat } from "../utils/GenUtil";
import { getAppConfigs } from "../network/api_client/StaticDataApi";

export async function initAppConfig() {
    const jsonData = await getAppJsonConfig();
    console.log("jsonData", jsonData);
    // merge(AppContract.strings, jsonData?.strings);

    const keyLoginSplash = await retrieveItem(KEY_CONSTANT.keyLoginSplash);
    const remoteLoginSplash = jsonData?.mobileAppLandingPagePicture;
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

export async function getAppJsonConfig() {
    try {
        const result = await getAppConfigs();
        const data = result?.data;
        await storeItem(KEY_CONSTANT.keyAppConfig, data);
        return data;
    } catch (error) {
        const storeConfig = await retrieveItem(KEY_CONSTANT.keyAppConfig);
        return storeConfig;
    }
}
