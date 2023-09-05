import { instance } from "../AxiosClient";
import getAPIConfig from "../APIConfig";

import { MobileAppUsersApi } from "../generated";
import type { MobileAppUserDeletionCommand } from "../generated";

export async function sendMobileAppUsersValidationCodeByEmail(mobileAppUserSendValidationCommand) {
    const api = new MobileAppUsersApi(getAPIConfig(), null, instance);
    return api.v1MobileAppUsersValidationCodePost(mobileAppUserSendValidationCommand);
}

export async function createMobileAppUser(mobileAppUserSendValidationCommand) {
    const api = new MobileAppUsersApi(getAPIConfig(), null, instance);
    return api.v1MobileAppUsersPost(mobileAppUserSendValidationCommand);
}

function deleteMobileAppUser({ password }: MobileAppUserDeletionCommand) {
    const api = new MobileAppUsersApi(getAPIConfig(), null, instance);
    return api.v1MobileAppUsersDelete({ password });
}

export default { deleteMobileAppUser };
