import { checkMobileAccount, updateMobileAccountPasswordById } from "../helper/SQLitDBHelper";
import { getActiveUserID, setActiveUserID } from "../helper/AppHelper";
import MobileAppUsersAPIs, {
    sendMobileAppUsersValidationCodeByEmail,
    createMobileAppUser,
} from "../network/api_client/MobileAppUsersAPIs";
import { signIn, tokenRevocation } from "../network/identityAPI";
import { instance } from "../network/AxiosClient";
import { handleError } from "../network/APIUtil";
import { clearToken } from "../network/tokenUtil";
import { globalDataForAPI } from "../network/commonUtil";
import { restBiometricLoginDataByUserId } from "../helper/LocalAuthHelper";

async function verifyPassword(accountPassword: string) {
    if (!accountPassword) return "failed: password is empty";

    return "passed";
}

async function deleteCurrentAccount(accountPassword: string, { dispatch }) {
    try {
        const verifyPasswordResult = await verifyPassword(accountPassword);

        if (verifyPasswordResult === "passed") {
            const result = await handleError<ReturnType<typeof MobileAppUsersAPIs.deleteMobileAppUser>>(
                MobileAppUsersAPIs.deleteMobileAppUser({
                    password: accountPassword,
                }),
                { dispatch, showLoading: true }
            );

            console.log({ deleteMobileAppUserResult: result });

            const { success, data } = result;

            if (success) {
                const { isValidResponse } = data.data;

                if (isValidResponse) {
                    const userID = await getActiveUserID();
                    restBiometricLoginDataByUserId(userID);
                    await clearAppData(dispatch);
                    return "succeeded";
                }
            }
        }
    } catch (error) {
        return "failed";
    }

    return "failed";
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
    verifyPassword,
    deleteCurrentAccount,
    isMobileAccountExisted,
    updateMobileAccountPasswordByUserId,
    authSignIn,
    signOut,
    clearAppData,
};
