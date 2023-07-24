import * as React from "react";
import { CommonActions, StackActions } from "@react-navigation/native";

export const navigationRef = React.createRef();

function navigate(name, params) {
    return navigationRef.current?.navigate(name, params);
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
