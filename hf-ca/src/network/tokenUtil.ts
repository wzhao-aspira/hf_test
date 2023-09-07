import moment from "moment";
import { isEmpty } from "lodash";
import { retrieveItem, storeItem } from "../helper/StorageHelper";
import { globalDataForAPI } from "./commonUtil";

export const timeLead = 60;

function updateGlobalToken(token) {
    if (token) {
        globalDataForAPI.jwtToken.access_token = token.access_token;
        globalDataForAPI.jwtToken.refresh_token = token.refresh_token;
        globalDataForAPI.jwtToken.expires_in = token.expires_in;
        globalDataForAPI.jwtToken.updateTime = token.updateTime;
    }
}

function getTokenKey(tokenKey) {
    return `jwt_token_${tokenKey}`;
}

export async function clearToken(tokenKey) {
    globalDataForAPI.jwtToken.access_token = null;
    globalDataForAPI.jwtToken.refresh_token = null;
    globalDataForAPI.jwtToken.expires_in = null;
    globalDataForAPI.jwtToken.updateTime = null;
    return storeItem(getTokenKey(tokenKey), null);
}

async function writeToken(tokenKey, token) {
    updateGlobalToken(token);
    return storeItem(getTokenKey(tokenKey), token);
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

export async function restoreToken(tokenKey) {
    const tokenObj = await retrieveItem(getTokenKey(tokenKey));
    if (isEmpty(tokenObj)) {
        console.log("read token FromStorage got null！");
        return false;
    }

    updateGlobalToken(tokenObj);
    return true;
}

export function retrieveAccessToken() {
    return globalDataForAPI?.jwtToken?.access_token;
}
