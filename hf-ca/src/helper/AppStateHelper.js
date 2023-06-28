import * as Location from "expo-location";
// import { Camera } from "expo-camera";
import { AppState } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";

let requestingPermission = false;

const appStateListeners = [];

const permissionTemplate = async (method) => {
    requestingPermission = true;
    const res = await method();
    requestingPermission = false;
    return res;
};

const requestCurrentPosition = Location.getCurrentPositionAsync;
// eslint-disable-next-line no-import-assign
Location.getCurrentPositionAsync = async () => {
    return permissionTemplate(requestCurrentPosition);
};

const requestLocation = Location.requestForegroundPermissionsAsync;
// eslint-disable-next-line no-import-assign
Location.requestForegroundPermissionsAsync = async () => {
    return permissionTemplate(requestLocation);
};

// const requestCamera = Camera.requestCameraPermissionsAsync;
// Camera.requestCameraPermissionsAsync = async () => {
//     return permissionTemplate(requestCamera);
// };

const requestAuthenticate = LocalAuthentication.authenticateAsync;
// eslint-disable-next-line no-import-assign
LocalAuthentication.authenticateAsync = async () => {
    return permissionTemplate(requestAuthenticate);
};

AppState.addEventListener("change", (state) => {
    if (requestingPermission) {
        console.log(`is requesting Permission, ignore App state change: ${state}`);
        return;
    }
    appStateListeners.forEach((listener) => listener(state));
});

const AppManager = {
    addAppStateListener: (listener) => {
        appStateListeners.push(listener);
        return () => {
            appStateListeners.splice(appStateListeners.indexOf(listener), 1);
        };
    },
};

export default AppManager;
