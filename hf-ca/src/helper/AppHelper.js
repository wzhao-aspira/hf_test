import { Linking, Platform } from "react-native";
import { camelCase, isEmpty } from "lodash";
import Toast from "react-native-root-toast";
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

export function getInternetSalesURL() {
    if (isUATEnv()) {
        return AppContract.internetSalesURL.uat;
    }
    if (isProdEnv()) {
        return AppContract.internetSalesURL.prod;
    }
    return AppContract.internetSalesURL.qa;
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
