import { globalDataForAPI } from "./APIUtil";
import { Configuration } from "./generated";
import { getBaseURL } from "../helper/AppHelper";

let config = null;

// TDOD: reset config
export const resetConfig = () => {
    config = null;
};

const getConfig = () => {
    if (!config) {
        let baseOptions = {};
        if (globalDataForAPI.jwtToken.access_token) {
            baseOptions = { headers: { Authorization: `Bearer ${globalDataForAPI.jwtToken.access_token}` } };
        }
        config = new Configuration({ baseOptions, basePath: `${getBaseURL()}Prod/api` });
    }

    return config;
};
export const getNormalConfig = () => {
    return new Configuration({ basePath: `${getBaseURL()}Prod/api` });
};
export default getConfig;
