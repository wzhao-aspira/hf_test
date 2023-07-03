import { isEmpty } from "lodash";
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isIos } from "./AppHelper";
import { retrieveItem, storeItem } from "./StorageHelper";
import i18n from "../localization/i18n";
import store from "../redux/Store";
import { showSimpleDialog } from "../redux/AppSlice";
import { KEY_CONSTANT } from "../constants/Constants";
import { getMobileAccountById } from "./DBHelper";
import SecurityUtil from "../utils/SecurityUtil";

export async function saveOnboardingPageAppear(userId) {
    console.log(`saveOnboardingPageAppear:${userId}`);
    const appear = { result: true };
    storeItem(`${KEY_CONSTANT.localAuthOnboardingHasAppear}_${userId}`, appear);
}

export async function checkAuthAvailable() {
    let available = false;
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (hasHardware) {
        const supportedAuthentication = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (!isEmpty(supportedAuthentication)) {
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            if (isEnrolled) {
                available = true;
            }
        }
    }
    return available;
}

export async function checkAuthOnboarding(userId) {
    console.log(`checkAuthOnboarding:${userId}`);
    const available = await checkAuthAvailable();
    if (!available) {
        return false;
    }

    const appear = await retrieveItem(`${KEY_CONSTANT.localAuthOnboardingHasAppear}_${userId}`);
    console.log(`auth appear:${JSON.stringify(appear)}`);
    if (appear == "" || appear == null || appear.result == false) {
        return true;
    }
    // already showed, if user enabled biometric login before need to restore the flag
    const biometricIDSwitch = await retrieveItem(KEY_CONSTANT.biometricIDSwitch + userId, false);
    const isBlock = await checkBlockBiometricIDLogin();
    if (!isBlock && biometricIDSwitch) {
        setLastBiometricLoginUser(userId);
    } else {
        setLastBiometricLoginUser(null);
    }
    return false;
}

export async function getAuthType() {
    let authType = null;
    const supportedAuthentication = await LocalAuthentication.supportedAuthenticationTypesAsync();

    if (supportedAuthentication.includes(2) && supportedAuthentication.includes(1)) {
        authType = i18n.t("auth.biometricID");
    } else if (supportedAuthentication.includes(2)) {
        authType = i18n.t("auth.faceID");
    } else if (supportedAuthentication.includes(1)) {
        if (isIos()) {
            authType = i18n.t("auth.touchID");
        } else {
            authType = i18n.t("auth.fingerprint");
        }
    }

    return authType;
}

export async function checkBlockBiometricIDLogin(userID) {
    const result = await retrieveItem(KEY_CONSTANT.biometricIDSwitchBlock + userID, false);

    return result;
}
export async function blockBiometricIDLogin(userID) {
    await storeItem(KEY_CONSTANT.biometricIDSwitchBlock + userID, true);
}

export async function resetBiometricIDLoginBlock(userID) {
    await AsyncStorage.multiRemove([KEY_CONSTANT.biometricIDSwitchBlock + userID]);
}

export async function updateAuthInfo(authEnable, userID) {
    if (userID) {
        await storeItem(KEY_CONSTANT.biometricIDSwitch + userID, authEnable);
        await resetBiometricIDLoginBlock();
    }
}

export async function setLoginCredential(userID) {
    const mobileAccount = await getMobileAccountById(userID);
    const encrypted = SecurityUtil.xorEncrypt(JSON.stringify(mobileAccount));
    storeItem(`${KEY_CONSTANT.lastBiometricLoginUserAuthInfo}_${userID}`, encrypted);
}

export async function getLoginCredential(userID) {
    console.log(`getLoginCredential:${userID}`);
    const encrypted = await retrieveItem(`${KEY_CONSTANT.lastBiometricLoginUserAuthInfo}_${userID}`);
    if (isEmpty(encrypted)) {
        return undefined;
    }
    const parsed = JSON.parse(SecurityUtil.xorDecrypt(encrypted));
    return parsed;
}

export async function setLastBiometricLoginUser(userId) {
    storeItem(KEY_CONSTANT.lastBiometricLoginUser, userId);
}

export async function getLastBiometricLoginUser() {
    return retrieveItem(KEY_CONSTANT.lastBiometricLoginUser);
}

export async function getAuthInfo(userID) {
    const res = {
        available: false,
        typeName: "",
        enable: false,
    };

    const available = await checkAuthAvailable();
    res.available = available;
    if (available) {
        res.typeName = await getAuthType();
        if (userID) {
            const biometricIDSwitch = await retrieveItem(KEY_CONSTANT.biometricIDSwitch + userID, false);
            const isBlock = await checkBlockBiometricIDLogin();

            res.enable = !isBlock && biometricIDSwitch;
        }
    }
    console.log(`auth info:${JSON.stringify(res)}`);
    return res;
}

export async function startBiometricAuth(userID, onFinish = () => {}, onError = () => {}) {
    let disableDeviceFallback = true;
    if (isIos()) {
        disableDeviceFallback = false;
    }
    LocalAuthentication.authenticateAsync({
        promptMessage: i18n.t("auth.promptMessage"),
        fallbackLabel: i18n.t("auth.fallbackLabel"),
        cancelLabel: i18n.t("common.cancel"),
        disableDeviceFallback,
    }).then((result) => {
        console.log(result);
        if (result.success) {
            console.log("auth successfully");
            updateAuthInfo(true, userID);
            if (onFinish) {
                onFinish();
            }
        } else if (!isEmpty(result.error)) {
            console.log(`auth failed:${JSON.stringify(result)}`);
            if (result.error != "user_cancel") {
                let errorMessage = result.message;
                if (isEmpty(errorMessage)) {
                    errorMessage = result.warning;
                }
                if (isEmpty(errorMessage)) {
                    if (result.error == "lockout") {
                        errorMessage = i18n.t("auth.tooManyAttempts");
                    } else if (result.error && result.error.includes("unknown:-1004")) {
                        // two expo App faceId issue:  error: unknown:-1004,Caller is not running foreground
                        errorMessage = i18n.t("auth.unableToUse");
                    } else {
                        errorMessage = i18n.t("auth.authFailed");
                    }
                }
                store.dispatch(
                    showSimpleDialog({
                        title: i18n.t("common.error"),
                        message: errorMessage,
                    })
                );
                onError(result);
            }
        }
    });
}
