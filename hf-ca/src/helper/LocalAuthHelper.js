import { isEmpty } from "lodash";
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isIos } from "./AppHelper";
import { retrieveItem, storeItem } from "./StorageHelper";
import { KEY_CONSTANT } from "../constants/Constants";

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
};

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
    console.log(`localAuth available:${available}`);
    return available;
}

export async function getAuthInfo() {
    let authInfo = false;
    const available = await checkAuthAvailable();
    if (available) {
        const userName = await getUserName();
        if (userName) {
            const biometricIDSwitch = await LocalStorage.get(AsyncConstants.biometricIDSwitch + userName, false);
            const isBlock = await checkBlockBiometricIDLogin();

            authInfo = !isBlock && biometricIDSwitch;
        }
    }

    console.log(`auth info:${authInfo}`);

    return authInfo === true;
}

export async function getCurrentAuthTypeName() {
    let result = null;
    const authType = await getAuthType();
    if (authType != null) {
        result = authType;
        if (authType == "Fingerprint" && isIos()) {
            result = "Touch ID";
        }

        return result;
    }

    return result;
}

export async function getAuthType() {
    let authType = null;
    const supportedAuthentication = await LocalAuthentication.supportedAuthenticationTypesAsync();

    if (supportedAuthentication.includes(2) && supportedAuthentication.includes(1)) {
        authType = "Biometric ID";
    } else if (supportedAuthentication.includes(2)) {
        authType = "Face ID";
    } else if (supportedAuthentication.includes(1)) {
        authType = "Fingerprint";
    }

    console.log(`supportedAuthentication:${supportedAuthentication}`);

    return authType;
}

async function getUserName() {
    // Get mobile account id from the local storage
    return retrieveItem(KEY_CONSTANT.keyLastUsedMobileAccountId);
}

export async function checkBlockBiometricIDLogin() {
    let result = false;
    const userName = await getUserName();
    if (userName) {
        result = await LocalStorage.get(AsyncConstants.biometricIDSwitchBlock + userName, false);
    }

    return result;
}
