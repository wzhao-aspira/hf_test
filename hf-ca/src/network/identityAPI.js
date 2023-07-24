import { instance } from "./AxiosClient";
import { clientSecret, clientId, writeToken } from "./APIUtil";
import { getBaseURL } from "../helper/AppHelper";

const url = "/Prod/identity/v1/connect/token";

const saveJwtToken = (apiResult, username) => {
    if (apiResult.success) {
        writeToken(username, apiResult.data);
    }
};

export async function signIn(username, password) {
    const data = { client_secret: clientSecret, grant_type: "password", client_id: clientId, username, password };
    const result = await instance.request({
        method: "post",
        url,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        baseURL: getBaseURL(),
        data,
    });

    saveJwtToken(result, username);
    return result;
}

export async function refreshToken(refresh_token, userName) {
    const data = { client_secret: clientSecret, grant_type: "refresh_token", client_id: clientId, refresh_token };
    const result = await instance.request({
        method: "post",
        url,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        baseURL: getBaseURL(),
        data,
    });
    await saveJwtToken(result, userName);

    return result;
}
