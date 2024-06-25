import * as React from "react";
import { CommonActions, StackActions } from "@react-navigation/native";
import Routers from "../constants/Routers";

export const navigationRef = React.createRef();

function navigate(name, params) {
    var result = navigationRef.current?.navigate(name, params);
    /**
     * Raynor Chen @ Jun.24th, 2024:
     * In most of case, navigating to home router means go to the first screen of the home route.
     * Profile update rely on the "Go to Home Screen" to dowload profile.
     * "CDFW Alerts" list forbids app from navigate to home screen.
     * So just make a special check in here.
     * Related issue: AFB-35211
     */
    if (name === Routers.home) {
        navigationRef.current?.dispatch(StackActions.popToTop());
    }

    return result;
}

function back() {
    return navigationRef.current?.dispatch(CommonActions.goBack());
}

function push(name, params) {
    return navigationRef.current?.dispatch(StackActions.push(name, params));
}

export default {
    navigate,
    back,
    push,
};
