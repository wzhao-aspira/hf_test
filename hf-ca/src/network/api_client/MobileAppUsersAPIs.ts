import { instance } from "../AxiosClient";
import getAPIConfig from "../APIConfig";
import Constants from "expo-constants";

import { MobileAppUsersApi } from "../generated";
import type {
    ForgotPasswordSendValidationCommand,
    MobileAppUserDeletionVM,
    MobileAppUserLoginAuditVM,
    MobileAppUserResetPasswordCommand,
    PasswordChangeVM,
} from "../generated";
import { getDeviceInfo } from "../../helper/AppHelper";

export async function sendMobileAppUsersValidationCodeByEmail(mobileAppUserSendValidationCommand) {
    const api = new MobileAppUsersApi(getAPIConfig(false), null, instance);
    return api.v1MobileAppUsersValidationCodePost(mobileAppUserSendValidationCommand);
}

export async function sendValidationCodeForForgotPassword(forgotPasswordParams: ForgotPasswordSendValidationCommand) {
    const api = new MobileAppUsersApi(getAPIConfig(), null, instance);
    return api.v1MobileAppUsersForgotPasswordValidationCodePost(forgotPasswordParams);
}

export async function forgotPasswordValidationCodeValidation(emailAddress?: string, validationCode?: string) {
    const api = new MobileAppUsersApi(getAPIConfig(), null, instance);
    return api.v1MobileAppUsersForgotPasswordValidationCodeValidationGet(emailAddress, validationCode);
}

export async function resetPasswordWhenForgot(params: MobileAppUserResetPasswordCommand) {
    const api = new MobileAppUsersApi(getAPIConfig(), null, instance);
    return api.v1MobileAppUsersPasswordPost(params);
}

export async function changeUserPassword(params: PasswordChangeVM) {
    const api = new MobileAppUsersApi(getAPIConfig(), null, instance);
    return api.v1MobileAppUsersPasswordPut(params);
}

export async function createMobileAppUser(mobileAppUserSendValidationCommand) {
    const api = new MobileAppUsersApi(getAPIConfig(false), null, instance);
    return api.v1MobileAppUsersPost(mobileAppUserSendValidationCommand);
}

function deleteMobileAppUser({ password }: MobileAppUserDeletionVM) {
    const api = new MobileAppUsersApi(getAPIConfig(), null, instance);
    return api.v1MobileAppUsersDelete({ password });
}

export async function postMobileAppUsersLoginAudit(params: MobileAppUserLoginAuditVM) {
    const api = new MobileAppUsersApi(getAPIConfig(), null, instance);
    return api.v1MobileAppUsersLoginAuditPost(params, {
        headers: {
            "Device-Info": getDeviceInfo(),
            "App-Version": Constants.expoConfig?.version,
        },
    });
}

export default { deleteMobileAppUser };
