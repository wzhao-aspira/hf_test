import Constants from "expo-constants";
import { Platform } from "react-native";
import { instance } from "../AxiosClient";
import getAPIConfig from "../APIConfig";
import AppContract from "../../assets/_default/AppContract";

import { MiscellaneousApi } from "../generated";

function checkTokenAPI() {
    const api = new MiscellaneousApi(getAPIConfig(), null, instance);

    return api.v1MiscellaneousTokenCheckGet();
}

function checkNewVersionAPI() {
    const api = new MiscellaneousApi(getAPIConfig(), null, instance);

    /**
     *  "2023.1.5.1234" no update
     *  "2023.1.6.1234" force update
     *  "2023.1.7.1234" optional update
     */
    const version = Constants.expoConfig?.ios?.buildNumber;

    const clientType = Platform.OS == "android" ? "Android" : "Ios";

    const { appId } = AppContract;

    return api.v1MiscellaneousAppVersionUpdateGet(appId, clientType, version);
}

export default { checkTokenAPI, checkNewVersionAPI };
