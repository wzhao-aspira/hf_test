import axios from "axios";
import { startsWith } from "lodash";
import { getBaseURL } from "../helper/AppHelper";

const instance = axios.create({
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

// instance.interceptors.request.use(async (cfg) => {
//     /**
//      * change config in here
//      * eg：cfg.defaults.header.token = "xxx"
//      */
//     const config = cfg;
//     const { url } = cfg;
//     if (url.includes("authentication") || url.includes("kiosk") || url.includes("owp-webclient")) {
//         return config;
//     }
//     config.headers["X-Brand-Name"] = Global.Config.brandName;
//     return config;
// });

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
    },
    (error) => {
        console.log(error);
        // status out of 2xx
        // Object.assign(result, error);
        const result = {
            success: false,
            error,
        };

        return result;
    }
);

export default request;
