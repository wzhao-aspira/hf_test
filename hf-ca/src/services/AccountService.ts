import {
    getMobileAccountById,
    deleteMobileAccount,
    checkMobileAccount,
    updateMobileAccountPasswordById,
} from "../helper/DBHelper";
import { getActiveUserID, setActiveUserID } from "../helper/AppHelper";
import { sendMobileAppUsersValidationCodeByEmail, createMobileAppUser } from "../network/api_client/MobileAppUsersApi";
import { signIn, tokenRevocation } from "../network/identityAPI";
import { instance } from "../network/AxiosClient";
import { clearToken, globalDataForAPI } from "../network/APIUtil";

async function verifyPassword(accountID: string, accountPassword: string) {
    try {
        if (accountID) {
            if (!accountPassword) return "failed: password is empty";

            const accountData = await getMobileAccountById(accountID);
            const password = accountData?.account?.password;

            if (accountPassword !== password) return "failed: password do not match";

            return "passed";
        }
    } catch (error) {
        return "failed";
    }

    return "failed";
}

async function verifyCurrentAccountPassword(currentAccountPassword) {
    const userID = await getActiveUserID();

    return verifyPassword(userID, currentAccountPassword);
}

async function deleteAccount(accountID: string, accountPassword: string) {
    try {
        const verifyPasswordResult = await verifyPassword(accountID, accountPassword);

        if (verifyPasswordResult === "passed") {
            const result = await deleteMobileAccount(accountID);

            if (result?.success) {
                await setActiveUserID(null);
                return "succeeded";
            }
        }
    } catch (error) {
        return "failed";
    }

    return "failed";
}

async function deleteCurrentAccount(currentAccountPassword) {
    const userID = await getActiveUserID();

    return deleteAccount(userID, currentAccountPassword);
}

async function isMobileAccountExisted(userID: string) {
    const result = await checkMobileAccount(userID);
    if (result.success && result.count > 0) {
        return true;
    }
    return false;
}

async function updateMobileAccountPasswordByUserId(userID: string, password: string) {
    return updateMobileAccountPasswordById(userID, password);
}

async function authSignIn(userID, password) {
    const response = await signIn(instance, userID, password);
    return response;
}

async function sendEmailValidationCode(emailAddress) {
    const ret = await sendMobileAppUsersValidationCodeByEmail({ emailAddress });
    return ret?.data?.isValidResponse;
}

async function createMobileAccount(userID: string, validationCode: string, password: string) {
    const ret = await createMobileAppUser({ emailAddress: userID, validationCode, password });
    return ret?.data.result;
}

async function signOut() {
    const response = await Promise.all([
        tokenRevocation(instance, globalDataForAPI.jwtToken.refresh_token),
        tokenRevocation(instance, globalDataForAPI.jwtToken.access_token),
    ]);
    return response;
}

async function clearAppData(dispatch) {
    // clear up redux
    dispatch({ type: "USER_LOGOUT" });
    const userID = await getActiveUserID();
    await setActiveUserID(null);
    clearToken(userID);
}

export default {
    sendEmailValidationCode,
    createMobileAccount,
    verifyCurrentAccountPassword,
    deleteCurrentAccount,
    isMobileAccountExisted,
    updateMobileAccountPasswordByUserId,
    authSignIn,
    signOut,
    clearAppData,
};
