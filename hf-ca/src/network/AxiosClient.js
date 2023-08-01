import axios from "axios";
import { startsWith } from "lodash";
import { getBaseURL, getActiveUserID } from "../helper/AppHelper";
import { needRefreshToken, globalDataForAPI } from "./APIUtil";
import { refreshToken, url } from "./identityAPI";

export const instance = axios.create({
    timeout: 60000,
    headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
    },
});

async function request(endpoint, options = { method: "get" }) {
    instance.defaults.baseURL = getBaseURL();
    console.log("url", endpoint);
    if (startsWith(endpoint, "https://")) {
        instance.defaults.baseURL = null;
    }
    const requestBody = { ...options, url: endpoint };
    return instance.request(requestBody);
}

instance.interceptors.request.use(async (cfg) => {
    if (needRefreshToken() && !cfg.url?.startsWith(url)) {
        const userId = await getActiveUserID();
        await refreshToken(instance, userId);
        const config = {
            ...cfg,
            headers: {
                ...cfg.headers,
                Authorization: `Bearer ${globalDataForAPI.jwtToken.access_token}`,
            },
        };
        return config;
    }
    return cfg;
});

instance.interceptors.response.use(
    (response) => {
        // console.log("response data ====,", response);
        // status 2xx
        const result = {
            success: true,
            data: response.data,
        };
        /**
         * do some things for business error
         * like: if (response.data.code != 1) return Promise.reject(customerError)
         */
        return result;
    }
    // (error) => {
    //     // dispatch(appActions.setError(error));
    //     console.log(error);
    //     // status out of 2xx
    //     // Object.assign(result, error);
    //     const result = {
    //         success: false,
    //         error,
    //     };

    //     return result;
    // }
);

export default request;
