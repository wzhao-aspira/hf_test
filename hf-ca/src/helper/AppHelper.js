import { Linking, Platform } from "react-native";
import { camelCase, isEmpty } from "lodash";
import Toast from "react-native-root-toast";
import Constants from "expo-constants";
import i18next from "i18next";
import BuildType from "../constants/BuildType";
import AppContract from "../assets/_default/AppContract";
import { retrieveItem, storeItem } from "./StorageHelper";
import { KEY_CONSTANT } from "../constants/Constants";

export const CHANNEL = BuildType.toUpperCase();

export function isAndroid() {
    return Platform.OS == "android";
}

export function isIos() {
    return Platform.OS == "ios";
}

export function isQaEnv() {
    return CHANNEL.includes("DEV") || CHANNEL.includes("QA");
}

export function isUATEnv() {
    return CHANNEL.includes("UAT");
}

export function isProdEnv() {
    return CHANNEL.includes("PROD");
}

export function getBaseURL() {
    if (isUATEnv()) {
        return AppContract.URL.uat;
    }
    if (isProdEnv()) {
        return AppContract.URL.prod;
    }
    return AppContract.URL.qa;
}

export function showToast(message, option = {}) {
    Toast.show(message, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: false,
        delay: 0,
        ...option,
    });
}

export function genTestId(testID) {
    if (isAndroid()) {
        const idPrefix = `${AppContract.appId}:id/`;
        if (testID.includes(idPrefix)) {
            return idPrefix + testID.split(idPrefix)[1];
        }
        return idPrefix + camelCase(testID);
    }
    return camelCase(testID);
}

export async function getActiveUserID() {
    return retrieveItem(KEY_CONSTANT.keyLastUsedMobileAccountId);
}

export async function setActiveUserID(userId) {
    return storeItem(KEY_CONSTANT.keyLastUsedMobileAccountId, userId);
}

export function showNotImplementedFeature() {
    showToast("Feature to be added");
}

export function openLink(url) {
    if (!isEmpty(url)) {
        try {
            Linking.canOpenURL(url).then((canOpen) => {
                if (canOpen) {
                    Linking.openURL(url);
                }
            });
        } catch (e) {
            console.log(`AppUtils - openLink - Catch the exception [${e}]`);
            // TODO: error dialog.
        }
    }
    // TODO: empty url dialog
}

export function openAppStore(url) {
    const { t } = i18next;
    function openStoreError() {
        showToast(isIos() ? t("versionUpgrade.openIosStoreError") : t("versionUpgrade.openAndroidStoreError"));
    }
    if (isEmpty(url)) {
        openStoreError();
        return;
    }
    if (!isEmpty(url)) {
        try {
            if (isIos()) {
                Linking.canOpenURL(url).then((canOpen) => {
                    if (canOpen) {
                        Linking.openURL(url);
                    }
                });
            } else {
                const storeUrl = `https://play.google.com/store/apps/details?id=${AppContract.appId}`;
                // const storeUrl = `https://play.google.com/store/apps/details?id=com.aspiraconnect.hf.ab`;
                Linking.openURL(storeUrl);
            }
        } catch (e) {
            console.log(`AppUtils - openLink - Catch the exception [${e}]`);
            openStoreError();
        }
    }
}

export function getAppStaticInfo() {
    const { appStaticName, contractName } = AppContract;
    if (isEmpty(appStaticName)) {
        throw new Error("App Name can not be empty!");
    }
    const platform = isAndroid() ? "Android" : "iOS";
    const buildNumber = Constants.expoConfig?.ios?.buildNumber;
    const appStaticInfo = `${appStaticName}_${buildNumber}_${platform}_${contractName}`;
    return appStaticInfo;
}

export function getISWebStaticInfo() {
    const { appStaticName } = AppContract;
    if (isEmpty(appStaticName)) {
        throw new Error("App Name can not be empty!");
    }
    const platform = isAndroid() ? "android" : "ios";
    const version = Constants.expoConfig?.ios?.buildNumber;

    const appStaticInfo = `mobileAppName=${encodeURIComponent(appStaticName)}&mobileAppPlatform=${encodeURIComponent(
        platform
    )}&mobileAppVersion=${encodeURIComponent(version)}`;

    return appStaticInfo;
}
