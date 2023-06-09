import { Platform } from "react-native";
import { camelCase } from "lodash";
import BuildType from "../constants/BuildType";
import AppContract from "../assets/_default/AppContract";

export const CHANNEL = BuildType.toUpperCase();

export function isAndroid() {
    return Platform.OS == "android";
}

export function isQaEnv() {
    return CHANNEL.includes("DEV");
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
