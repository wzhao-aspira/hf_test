import * as Location from "expo-location";
import { getCurrentLocationByText, getLocationByText } from "../network/API";
import LicenseAgentsAPIs from "../network/api_client/LicenseAgentsAPIs";
import { handleError } from "../network/APIUtil";

async function getPositionByPermission(permission) {
    const result = { success: false, value: null, coordinates: [] };
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

export async function getCurrentLocation() {
    const permission = await Location.requestForegroundPermissionsAsync();
    return getPositionByPermission(permission);
}

export async function getCurrentLocationWithoutPopup() {
    const permission = await Location.getForegroundPermissionsAsync();
    return getPositionByPermission(permission);
}

export async function searchLocationByText(text) {
    const result = await getLocationByText(text);
    return result;
}

export async function getSuggestionSalesAgentsFromService(currentCoordinate, { dispatch }) {
    const currentLongitude = currentCoordinate[0];
    const currentLatitude = currentCoordinate[1];

    const result = await handleError<ReturnType<typeof LicenseAgentsAPIs.getLicenseAgents>>(
        LicenseAgentsAPIs.getLicenseAgents({
            latitude: currentLatitude,
            longitude: currentLongitude,
        }),
        { dispatch }
    );

    const { success, data } = result;

    if (success) {
        const dataResult = data.data.result;

        if (dataResult.length >= 0) {
            return dataResult.map((item) => {
                const { id, name, displayAddress, city, zipCode, businesPhone, distance, latitude, longitude } = item;

                return {
                    id,
                    name,
                    address: displayAddress,
                    city,
                    zip: zipCode,
                    phoneNumber: businesPhone,
                    distance: distance?.toFixed(2),
                    distanceUnit: "mile",
                    coor: [parseFloat(longitude.toString()), parseFloat(latitude.toString())] as [number, number],
                };
            });
        }

        return [];
    }

    return null;
}

export type { LicenseAgentVM } from "../network/api_client/LicenseAgentsAPIs";
