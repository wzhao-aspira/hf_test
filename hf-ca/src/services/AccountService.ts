import { getActiveUserID, setActiveUserID } from "../helper/AppHelper";
import { isEmpty } from "lodash";
import MobileAppUsersAPIs, {
    sendMobileAppUsersValidationCodeByEmail,
    createMobileAppUser,
    sendValidationCodeForForgotPassword,
    forgotPasswordValidationCodeValidation,
    resetPasswordWhenForgot,
    changeUserPassword,
    postMobileAppUsersLoginAudit,
} from "../network/api_client/MobileAppUsersAPIs";
import { signIn, tokenRevocation } from "../network/identityAPI";
import { instance, clearLastUpdateDate } from "../network/AxiosClient";
import { handleError } from "../network/APIUtil";
import { clearToken, restoreToken } from "../network/tokenUtil";
import { globalDataForAPI } from "../network/commonUtil";
import { restBiometricLoginDataByUserId } from "../helper/LocalAuthHelper";
import { MobileAppUserResetPasswordCommand, PasswordChangeVM } from "../network/generated";
import {
    clearProfileSummaryFromDB,
    deleteDrawApplicationDataFromDB,
    removeAccessPermitFromDB,
    removeLicenseListData,
    removePreferencePointListFromDB,
} from "../db";
import { clearIsEmptyOnlineDataCachedInd } from "./PreferencePointService";
import { removeMobileAppAlertData } from "../db/MobileAppAlert";
import { syncMobileAppAlertReadStatusIfNecessary } from "./MobileAppAlertService";

async function verifyPassword(accountPassword: string) {
    if (!accountPassword) {
        return "failed: password is empty";
    }

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

async function authSignIn(userID, password) {
    const response = await signIn(instance, userID, password);
    return response;
}

async function sendEmailValidationCode(emailAddress) {
    const ret = await sendMobileAppUsersValidationCodeByEmail({ emailAddress });
    return ret?.data?.isValidResponse;
}

async function forgotPasswordSendCode(emailAddress: string) {
    const response = await sendValidationCodeForForgotPassword({ emailAddress });
    return response;
}

async function forgotPasswordValidation(emailAddress: string, validationCode: string) {
    const response = await forgotPasswordValidationCodeValidation(emailAddress, validationCode);
    return response;
}

async function forgotAndResetPassword(params: MobileAppUserResetPasswordCommand) {
    const response = await resetPasswordWhenForgot(params);
    return response;
}

async function changePassword(params: PasswordChangeVM) {
    const response = await changeUserPassword(params);
    return response;
}

async function createMobileAccount(userID: string, validationCode: string, password: string) {
    const ret = await createMobileAppUser({ emailAddress: userID, validationCode, password });
    return ret?.data.result;
}

async function synchronizeDataBeforeSignOut() {
    try {
        await syncMobileAppAlertReadStatusIfNecessary();
    } catch (e) {
        console.warn("Error when synchronizing data before logout");
        console.warn(e);
    }
}

async function signOut() {
    await synchronizeDataBeforeSignOut();
    const response = await tokenRevocation(instance, globalDataForAPI.jwtToken.refresh_token);
    return response;
}

async function uploadDeviceInfo(loginType: number) {
    if (__DEV__) {
        return;
    }
    const res = await hasAccessToken();
    // console.log("uploadDeviceInfo", JSON.stringify(res) + ",loginType, " + loginType);
    if (res.success) {
        handleError(postMobileAppUsersLoginAudit({ loginType: loginType }), {
            showError: false,
            dispatch: null,
        });
    }
}

async function hasAccessToken() {
    const lastUsedMobileAccountId = await getActiveUserID();
    if (!isEmpty(lastUsedMobileAccountId)) {
        const hasToken = await restoreToken(lastUsedMobileAccountId);
        return { success: !!hasToken, lastUsedMobileAccountId: lastUsedMobileAccountId };
    }
    return { success: false };
}

async function clearAppData(dispatch) {
    // clear up redux
    dispatch({ type: "USER_LOGOUT" });
    const userID = await getActiveUserID();
    await setActiveUserID(null);
    await clearLastUpdateDate();
    clearToken(userID);
    // clear local DB data
    await clearProfileSummaryFromDB();
    await removePreferencePointListFromDB();
    await clearIsEmptyOnlineDataCachedInd();
    await removeAccessPermitFromDB();
    await removeLicenseListData();
    await removeMobileAppAlertData();
    await deleteDrawApplicationDataFromDB();
    //
}

export default {
    sendEmailValidationCode,
    createMobileAccount,
    verifyPassword,
    deleteCurrentAccount,
    authSignIn,
    signOut,
    clearAppData,
    forgotPasswordSendCode,
    forgotPasswordValidation,
    forgotAndResetPassword,
    changePassword,
    uploadDeviceInfo,
    hasAccessToken,
};
