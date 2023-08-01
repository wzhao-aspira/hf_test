import { globalDataForAPI } from "./APIUtil";
import { Configuration } from "./generated";
import { getBaseURL } from "../helper/AppHelper";

const getConfig = () => {
    let baseOptions = {};
    if (globalDataForAPI.jwtToken.access_token) {
        baseOptions = { headers: { Authorization: `Bearer ${globalDataForAPI.jwtToken.access_token}` } };
    }
    return new Configuration({ baseOptions, basePath: `${getBaseURL()}Prod/api` });
};

export const getNormalConfig = () => {
    return new Configuration({ basePath: `${getBaseURL()}Prod/api` });
};

export default getConfig;
