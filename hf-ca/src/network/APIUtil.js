/* eslint-disable import/no-mutable-exports */
import { actions as appActions } from "../redux/AppSlice";
import { retrieveItem, storeItem } from "../helper/StorageHelper";

export const clientSecret = "6C89A8AF-6CDE-4500-B1C9-C59D876FF3AF";
export const clientId = "aspira.ca.api";

export const globalDataForAPI = {
    lastPromise: "",
    jwtToken: {
        access_token: "",
        refresh_token: "",
        expires_in: "",
    },
};

export function clearLastPromise() {
    globalDataForAPI.lastPromise = null;
}

export async function handleError(
    requestPromise,
    { showError = true, showLoading = false, retry = false, dispatch } = {}
) {
    try {
        globalDataForAPI.lastPromise = null;
        if (retry) {
            globalDataForAPI.lastPromise = requestPromise;
        }
        if (showLoading) {
            dispatch(appActions.toggleIndicator(true));
        }
        const response = await requestPromise;
        return { success: true, data: response };
    } catch (error) {
        if (showError) dispatch(appActions.setError(error));
        console.log(JSON.stringify(error));
        return { success: false };
    } finally {
        if (showLoading) {
            dispatch(appActions.toggleIndicator(false));
        }
    }
}

function getTokenKey(tokenKey) {
    return `jwt_token_${tokenKey}`;
}

export function updateGlobalToken(token) {
    if (token) {
        globalDataForAPI.jwtToken.access_token = token.access_token;
        globalDataForAPI.jwtToken.refresh_token = token.refresh_token;
        globalDataForAPI.jwtToken.expires_in = token.expires_in;
    }
}

export async function writeToken(tokenKey, token) {
    updateGlobalToken(token);
    return storeItem(getTokenKey(tokenKey), token);
}

export async function readToken(tokenKey) {
    const token = await retrieveItem(getTokenKey(tokenKey));
    updateGlobalToken(token);
    return token;
}
