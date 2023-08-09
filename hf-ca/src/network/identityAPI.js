import { clientSecret, clientId, saveJwtToken, globalDataForAPI } from "./APIUtil";
import { getBaseURL } from "../helper/AppHelper";

export const url = "/Prod/identity/v1/connect/token";
export const signOutURL = "/prod/identity/v1/connect/revocation";

export async function signIn(instance, username, password) {
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

export async function refreshToken(instance, username) {
    const token = globalDataForAPI.jwtToken.refresh_token;
    const data = {
        client_secret: clientSecret,
        grant_type: "refresh_token",
        client_id: clientId,
        refresh_token: token,
    };
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

export async function tokenRevocation(instance, token) {
    const data = { client_secret: clientSecret, client_id: clientId, token };
    const result = await instance.request({
        method: "post",
        url: signOutURL,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        baseURL: getBaseURL(),
        data,
    });
    return result;
}
