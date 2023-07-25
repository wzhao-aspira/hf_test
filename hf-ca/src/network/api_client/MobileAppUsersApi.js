import { instance } from "../AxiosClient";
import getAPIConfig from "../APIConfig";

import { MobileAppUsersApi } from "../generated";

const api = new MobileAppUsersApi(getAPIConfig(), null, instance);
export async function sendMobileAppUsersValidationCodeByEmail(mobileAppUserSendValidationCommand) {
    return api.v1MobileAppUsersValidationCodePost(mobileAppUserSendValidationCommand);
}

export async function createMobileAppUser(mobileAppUserSendValidationCommand) {
    return api.v1MobileAppUsersPost(mobileAppUserSendValidationCommand);
}
