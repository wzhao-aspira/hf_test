import { instance } from "../AxiosClient";
import { getNormalConfig as getNormalAPIConfig } from "../APIConfig";

import { MobileAppUsersApi } from "../generated";

export async function sendMobileAppUsersValidationCodeByEmail(mobileAppUserSendValidationCommand) {
    const api = new MobileAppUsersApi(getNormalAPIConfig(), null, instance);
    return api.v1MobileAppUsersValidationCodePost(mobileAppUserSendValidationCommand);
}

export async function createMobileAppUser(mobileAppUserSendValidationCommand) {
    const api = new MobileAppUsersApi(getNormalAPIConfig(), null, instance);
    return api.v1MobileAppUsersPost(mobileAppUserSendValidationCommand);
}
