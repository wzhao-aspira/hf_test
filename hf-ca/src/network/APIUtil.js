/* eslint-disable import/no-mutable-exports */
import { isEmpty } from "lodash";
import moment from "moment";
import { actions as appActions } from "../redux/AppSlice";
import { retrieveItem, storeItem } from "../helper/StorageHelper";

export const clientSecret = "6C89A8AF-6CDE-4500-B1C9-C59D876FF3AF";
export const clientId = "aspira.ca.api";
export const timeLead = 60;

export const globalDataForAPI = {
    lastPromise: "",
    jwtToken: {
        access_token: null,
        refresh_token: null,
        expires_in: null,
        updateTime: null,
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
        console.log(error);
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

function updateGlobalToken(token) {
    if (token) {
        globalDataForAPI.jwtToken.access_token = token.access_token;
        globalDataForAPI.jwtToken.refresh_token = token.refresh_token;
        globalDataForAPI.jwtToken.expires_in = token.expires_in;
        globalDataForAPI.jwtToken.updateTime = token.updateTime;
    }
}

export async function clearToken(tokenKey) {
    globalDataForAPI.jwtToken.access_token = null;
    globalDataForAPI.jwtToken.refresh_token = null;
    globalDataForAPI.jwtToken.expires_in = null;
    globalDataForAPI.jwtToken.updateTime = null;
    return storeItem(getTokenKey(tokenKey), null);
}

export async function writeToken(tokenKey, token) {
    updateGlobalToken(token);
    return storeItem(getTokenKey(tokenKey), token);
}

export async function restoreToken(tokenKey) {
    const tokenObj = await retrieveItem(getTokenKey(tokenKey));
    if (isEmpty(tokenObj)) {
        console.log("read token FromStorage got null！");
        return false;
    }

    updateGlobalToken(tokenObj);
    return true;
}

export function needRefreshToken() {
    let result = false;

    if (globalDataForAPI.jwtToken.expires_in) {
        const { updateTime } = globalDataForAPI.jwtToken;
        const duration = moment().unix() - updateTime;
        console.log(`jwt duration:${duration}`);
        if (duration > globalDataForAPI.jwtToken.expires_in - timeLead) {
            result = true;
        }
    }
    return result;
}

export const saveJwtToken = (apiResult, username) => {
    if (apiResult.success) {
        writeToken(username, { ...apiResult.data, updateTime: moment().unix() });
    }
};
