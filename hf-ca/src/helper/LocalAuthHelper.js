import { isEmpty } from "lodash";
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isIos } from "./AppHelper";
import { retrieveItem, storeItem } from "./StorageHelper";
import i18n from "../localization/i18n";
import store from "../redux/Store";
import { showSimpleDialog } from "../redux/AppSlice";

const LocalStorage = {
    get: retrieveItem,
    set: storeItem,
    multiRemove: async (keys) => {
        await AsyncStorage.multiRemove(keys);
    },
};

const AsyncConstants = {
    localAuthOnboardingHasAppear: "localAuthOnboardingHasAppear",
    biometricIDSwitchBlock: "biometricIDSwitchBlock",
    biometricIDSwitch: "biometricIDSwitch",
    loginCredential: "loginCredential",
};

export async function saveOnboardingPageAppear(userId) {
    console.log(`saveOnboardingPageAppear:${userId}`);
    const appear = { result: true };
    LocalStorage.set(`${AsyncConstants.localAuthOnboardingHasAppear}_${userId}`, appear);
}

export async function checkAuthOnboarding(userId) {
    console.log(`checkAuthOnboarding:${userId}`);
    const available = await checkAuthAvailable();
    if (!available) {
        return false;
    }

    const appear = await LocalStorage.get(`${AsyncConstants.localAuthOnboardingHasAppear}_${userId}`);
    console.log(`auth appear:${JSON.stringify(appear)}`);
    if (appear == "" || appear == null || appear.result == false) {
        return true;
    }

    return false;
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
            const biometricIDSwitch = await LocalStorage.get(AsyncConstants.biometricIDSwitch + userName, false);
            const isBlock = await checkBlockBiometricIDLogin();

            res.enable = !isBlock && biometricIDSwitch;
        }
    }
    console.log(`auth info:${JSON.stringify(res)}`);
    return res;
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

// async function getUserName() {
//     // Get mobile account id from the local storage
//     return retrieveItem(KEY_CONSTANT.keyLastUsedMobileAccountId);
// }

export async function checkBlockBiometricIDLogin(userName) {
    const result = await LocalStorage.get(AsyncConstants.biometricIDSwitchBlock + userName, false);

    return result;
}
export async function blockBiometricIDLogin(userName) {
    await LocalStorage.set(AsyncConstants.biometricIDSwitchBlock + userName, true);
}

export async function resetBiometricIDLoginBlock(userName) {
    await LocalStorage.multiRemove([AsyncConstants.biometricIDSwitchBlock + userName]);
}

export async function updateAuthInfo(authEnable, userName) {
    if (userName) {
        await LocalStorage.set(AsyncConstants.biometricIDSwitch + userName, authEnable);
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
    //         LocalStorage.set(`${AsyncConstants.loginCredential}_${userName}`, encrypted);
    //     }
    // });
}

export async function getLoginCredential(userName) {
    console.log(`getLoginCredential:${userName}`);
    // const encrypted = await LocalStorage.get(`${AsyncConstants.loginCredential}_${userName}`);
    // if (isEmpty(encrypted)) {
    //     return undefined;
    // }
    // const parsed = SecurityUtil.safeParse(encrypted);
    // console.log(`parsed loginInfo:${JSON.stringify(parsed)}`);
    // return parsed;
}

export async function clearLoginCredential(userName) {
    LocalStorage.multiRemove([`${AsyncConstants.loginCredential}_${userName}`]);
}

export async function clearLocalAuth(userName) {
    blockBiometricIDLogin(userName);
    clearLoginCredential(userName);
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
            onFinish && onFinish();
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
