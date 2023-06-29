import { isEmpty } from "lodash";
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isIos } from "./AppHelper";
import { retrieveItem, storeItem } from "./StorageHelper";
import i18n from "../localization/i18n";
import store from "../redux/Store";
import { showSimpleDialog } from "../redux/AppSlice";
import { KEY_CONSTANT } from "../constants/Constants";

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

export async function checkBlockBiometricIDLogin(userName) {
    const result = await retrieveItem(KEY_CONSTANT.biometricIDSwitchBlock + userName, false);

    return result;
}
export async function blockBiometricIDLogin(userName) {
    await storeItem(KEY_CONSTANT.biometricIDSwitchBlock + userName, true);
}

export async function resetBiometricIDLoginBlock(userName) {
    await AsyncStorage.multiRemove([KEY_CONSTANT.biometricIDSwitchBlock + userName]);
}

export async function updateAuthInfo(authEnable, userName) {
    if (userName) {
        await storeItem(KEY_CONSTANT.biometricIDSwitch + userName, authEnable);
        await resetBiometricIDLoginBlock();
    }
}

export async function setLoginCredential(userName) {
    console.log(`setLoginCredential:${userName}`);
    // dbGetByCusNumber(customerNum, (res) => {
    //     if (res.success) {
    //         const loginInfo = res.profile?.searchParams;
    //         console.log(`save loginInfo:${JSON.stringify(loginInfo)}`);
    //         const encrypted = SecurityUtil.encrypt(JSON.stringify(loginInfo), true);
    //         storeItem(`${KEY_CONSTANT.loginCredential}_${userName}`, encrypted);
    //     }
    // });
}

export async function getLoginCredential(userName) {
    console.log(`getLoginCredential:${userName}`);
    // const encrypted = await retrieveItem(`${KEY_CONSTANT.loginCredential}_${userName}`);
    // if (isEmpty(encrypted)) {
    //     return undefined;
    // }
    // const parsed = SecurityUtil.safeParse(encrypted);
    // console.log(`parsed loginInfo:${JSON.stringify(parsed)}`);
    // return parsed;
}

export async function clearLoginCredential(userName) {
    AsyncStorage.multiRemove([`${KEY_CONSTANT.loginCredential}_${userName}`]);
}

export async function clearLocalAuth(userName) {
    blockBiometricIDLogin(userName);
    clearLoginCredential(userName);
}

export async function getAuthInfo(userName) {
    const res = {
        available: false,
        typeName: "",
        enable: false,
    };

    const available = await checkAuthAvailable();
    res.available = available;
    if (available) {
        res.typeName = await getAuthType();
        if (userName) {
            const biometricIDSwitch = await retrieveItem(KEY_CONSTANT.biometricIDSwitch + userName, false);
            const isBlock = await checkBlockBiometricIDLogin();

            res.enable = !isBlock && biometricIDSwitch;
        }
    }
    console.log(`auth info:${JSON.stringify(res)}`);
    return res;
}

export async function startBiometricAuth(userName, onFinish = () => {}, onError = () => {}) {
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
            updateAuthInfo(true, userName);
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
