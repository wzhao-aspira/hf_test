export const url = "/Prod/identity/v1/connect/token";
export const signOutURL = "/prod/identity/v1/connect/revocation";
export const clientId = "aspira.ca.api";
export const clientSecret = "6C89A8AF-6CDE-4500-B1C9-C59D876FF3AF";

export interface GlobalDataForAPI {
    lastPromise: string | Promise<unknown>;
    networkErrorByDialog: boolean;
    jwtToken: {
        access_token: null | string;
        refresh_token: null | string;
        expires_in: null | number;
        updateTime: null | number;
    };
}

export const globalDataForAPI: GlobalDataForAPI = {
    lastPromise: "",
    networkErrorByDialog: true,
    jwtToken: {
        access_token: null,
        refresh_token: null,
        expires_in: null,
        updateTime: null,
    },
};

const isErrorCode = (error, errorCode) => {
    if (error.status) {
        return error.status === errorCode;
    }
    if (error.response) {
        return error.response?.status === errorCode;
    }
    return false;
};

export const isNoAuthorization = (error) => {
    if (
        isErrorCode(error, 400) &&
        error.config?.url?.startsWith(url) &&
        error.config?.data?.includes("grant_type=refresh_token")
    ) {
        console.log("refresh token timeout");
        return true;
    }
    return isErrorCode(error, 401) && globalDataForAPI.jwtToken.access_token;
};

export const isConnectError = (error) => {
    return isErrorCode(error, 500) || error.code === "ERR_NETWORK";
};
