/* eslint-disable global-require */
import { Image as RNImage } from "react-native";
import { isEmpty } from "lodash";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { KEY_CONSTANT } from "../constants/Constants";
import { retrieveItem } from "./StorageHelper";

export async function getLoginSplash() {
    const keyLoginSplash = await retrieveItem(KEY_CONSTANT.keyLoginSplash);
    if (!isEmpty(keyLoginSplash)) {
        return `${FileSystem.documentDirectory}login_splash.jpg`;
    }
    const [{ localUri }] = await Asset.loadAsync(require("../assets/_default/images/login_splash.jpg"));
    return localUri;
}

export function getLogo() {
    return require("../assets/_default/images/logo.png");
}

export function getLogoRatio() {
    return 581 / 768;
}

export async function getImageSize(imgUri) {
    return new Promise((resolve, reject) => {
        RNImage.getSize(
            imgUri,
            (width, height) => {
                resolve({ width, height });
            },
            (error) => {
                reject(error);
            }
        );
    });
}
