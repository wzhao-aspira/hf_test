import * as Location from "expo-location";
import { getCurrentLocationByText } from "../network/API";

export default async function getCurrentLocationWithoutPopup() {
    const result = { success: false, value: null, coordinates: [] };
    const permission = await Location.getForegroundPermissionsAsync();
    if (permission && permission.granted) {
        try {
            const lastKnownPosition = await Location.getLastKnownPositionAsync();
            console.log("Location helper --- lastKnownPosition:", lastKnownPosition);
            if (lastKnownPosition) {
                const location = getCurrentLocationByText(
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
