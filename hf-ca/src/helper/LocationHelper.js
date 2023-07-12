import * as Location from "expo-location";
import { getCurrentLocationByText, getLocationByText } from "../network/API";
import { NETWORK_REQUEST_FAILED } from "../constants/Constants";

export async function getCurrentLocation() {
    const result = { success: false, value: null, coordinates: [] };
    const permission = await Location.getForegroundPermissionsAsync();
    if (permission && permission.status == "granted") {
        try {
            const lastKnownPosition = await Location.getLastKnownPositionAsync();
            console.log("Location helper --- lastKnownPosition:", lastKnownPosition);
            if (lastKnownPosition) {
                const location = await getCurrentLocationByText(
                    `${lastKnownPosition.coords.longitude},${lastKnownPosition.coords.latitude}`
                );
                console.log("Location helper --- current location:", location);
                if (location.success) {
                    return location;
                }
            }
        } catch (error) {
            console.log("Location helper --- get error:", error);
            result.success = false;
            result.value = error;
            result.coordinates = [];
        }
    } else {
        console.log("Location helper --- Can not get the location info, no permission allowed");
    }
    return result;
}

export async function searchLocationByText(text) {
    const result = { success: false, title: "errMsg.commonErrorTitle", message: "errMsg.commonErrorMsg" };
    try {
        const apiRst = await getLocationByText(text);
        if (apiRst.success) {
            return apiRst;
        }
    } catch (error) {
        if (error.message == NETWORK_REQUEST_FAILED || error.status == NETWORK_REQUEST_FAILED) {
            result.title = "errMsg.networkErrorTitle";
            result.message = "errMsg.networkErrorMsg";
        } else {
            const errorSplits = error.message.split("|");
            if (errorSplits.length == 2) {
                const msg = JSON.parse(errorSplits[1]);
                result.message = msg.message;
            }
        }
    }
    return result;
}
