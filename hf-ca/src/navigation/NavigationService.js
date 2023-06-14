import * as React from "react";
import { CommonActions } from "@react-navigation/native";

export const navigationRef = React.createRef();

function navigate(name, params) {
    return navigationRef.current?.navigate(name, params);
}

function back() {
    return navigationRef.current?.dispatch(CommonActions.goBack());
}

export default {
    navigate,
    back,
};
