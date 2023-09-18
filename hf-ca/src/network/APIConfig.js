import { globalDataForAPI, deployPath } from "./commonUtil";
import { Configuration } from "./generated";
import { getBaseURL } from "../helper/AppHelper";

const getConfig = (needAuthorization = true) => {
    let baseOptions = {};
    if (globalDataForAPI.jwtToken.access_token) {
        baseOptions = { headers: { Authorization: `Bearer ${globalDataForAPI.jwtToken.access_token}` } };
    }
    if (needAuthorization) {
        return new Configuration({ baseOptions, basePath: `${getBaseURL()}${deployPath}/api` });
    }
    return new Configuration({ basePath: `${getBaseURL()}${deployPath}/api` });
};

export default getConfig;
