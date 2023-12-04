import { configure } from "@react-native-community/netinfo";
import { getBaseURL } from "../helper/AppHelper";
import { deployPath } from "../network/commonUtil";

const apiHealthCheckUrl = `${getBaseURL()}${deployPath}/api/v1/Health`;

export default function configureNetworkDetect() {
    configure({
        reachabilityUrl: apiHealthCheckUrl,
        reachabilityMethod: "GET",
        reachabilityTest: async (response) => {
            const { status } = response;
            console.log(`API health:${status}`);
            return status == 200;
        },
        reachabilityLongTimeout: 60 * 1000, // 60s
        reachabilityShortTimeout: 60 * 1000, // 60s
        reachabilityRequestTimeout: 15 * 1000, // 15s
        reachabilityShouldRun: () => true,
        shouldFetchWiFiSSID: false, // met iOS requirements to get SSID. Will leak memory if set to true without meeting requirements.
        useNativeReachability: false,
    });
}
