import * as Location from "expo-location";
import { getDistance, convertDistance } from "geolib";
import { isEmpty } from "lodash";
import { getCurrentLocationByText, getLocationByText } from "../network/API";
import { NETWORK_REQUEST_FAILED } from "../constants/Constants";
import salesAgents from "./mock_data/sales_agents.json";

export async function getCurrentLocation() {
    const result = { success: false, value: null, coordinates: [] };
    const permission = await Location.getForegroundPermissionsAsync();
    if (permission && permission.status == "granted") {
        try {
            const lastKnownPosition = await Location.getLastKnownPositionAsync();
            console.log("Sales Agent service --- lastKnownPosition:", lastKnownPosition);
            if (lastKnownPosition) {
                const location = await getCurrentLocationByText(
                    `${lastKnownPosition.coords.longitude},${lastKnownPosition.coords.latitude}`
                );
                console.log("Sales Agent service --- current location:", location);
                if (location.success) {
                    return location;
                }
            }
        } catch (error) {
            console.log("Sales Agent service --- get error:", error);
            result.success = false;
            result.value = error;
            result.coordinates = [];
        }
    } else {
        console.log("Sales Agent service --- Can not get the location info, no permission allowed");
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

export async function getSuggestionSalesAgentsFromService(currentCoordinate) {
    const currentLongitude = currentCoordinate[0];
    const currentLatitude = currentCoordinate[1];
    const startCoordinate = { latitude: currentLatitude, longitude: currentLongitude };

    const result = { success: false, agents: [] };
    if (salesAgents) {
        result.success = true;
        salesAgents.forEach((salesAgent) => {
            const { longitude } = salesAgent;
            const { latitude } = salesAgent;
            if (!isEmpty(longitude) && !isEmpty(latitude)) {
                const endCoordinate = { latitude, longitude };
                const distance = getDistance(startCoordinate, endCoordinate);
                const distanceInMiles = convertDistance(distance, "mi");
                if (distanceInMiles <= 40) {
                    const agent = {
                        id: salesAgent.id,
                        name: salesAgent.agentName,
                        address: salesAgent.address,
                        city: salesAgent.city,
                        zip: salesAgent.zip,
                        phoneNumber: salesAgent.phoneNum,
                        distance: distanceInMiles.toFixed(2),
                        distanceUnit: "mile",
                        coor: [parseFloat(salesAgent.longitude), parseFloat(salesAgent.latitude)],
                    };
                    result.agents.push(agent);
                }
            }
        });
    }
    return new Promise((res) => {
        setTimeout(() => {
            res(result);
        }, 3000);
    });
}
