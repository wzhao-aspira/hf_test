/* eslint-disable global-require */
import { isEqual } from "lodash";
import * as FileSystem from "expo-file-system";
import { Image } from "expo-image";
import appConfig from "./mock_data/app_config.json";
import { retrieveItem, storeItem } from "../helper/StorageHelper";
import { KEY_CONSTANT } from "../constants/Constants";
import { getConfig } from "../network/API";
import { isJpgFormat } from "../utils/GenUtil";

export async function initAppConfig() {
    const jsonData = await getAppJsonConfig();
    console.log("jsonData", jsonData);
    // merge(AppContract.strings, jsonData?.strings);

    const keyLoginSplash = await retrieveItem(KEY_CONSTANT.keyLoginSplash);
    const remoteLoginSplash = jsonData?.login_splash;
    if (remoteLoginSplash && !isEqual(keyLoginSplash, remoteLoginSplash)) {
        const { status, mimeType, headers } = await FileSystem.downloadAsync(
            remoteLoginSplash,
            `${FileSystem.documentDirectory}login_splash_tmp.jpg`,
            { cache: false }
        );
        console.log("remoteLoginSplash", remoteLoginSplash);
        console.log(`status, ${status} mimeType, ${mimeType}`);
        console.log("headers", headers?.["content-type"]);
        if (status == 200 && (isJpgFormat(headers?.["content-type"]) || isJpgFormat(mimeType))) {
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
    const config = await getConfig();
    if (config?.success) {
        await storeItem(KEY_CONSTANT.keyAppConfig, appConfig);
        return appConfig;
    }
    const storeConfig = await retrieveItem(KEY_CONSTANT.keyAppConfig);
    return storeConfig;
}
