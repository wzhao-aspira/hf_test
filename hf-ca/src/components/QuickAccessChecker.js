import React, { useEffect, useImperativeHandle } from "react";
import { AppState } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { checkAuthAvailable, getAuthInfo, getCurrentAuthTypeName } from "../helper/LocalAuthHelper";

const QuickAccessChecker = React.forwardRef((props, ref) => {
    const { onHardwareInfo, onAuthTypeChange } = props;

    const checkAccessMethods = async () => {
        console.log("QuickAccessChecker : checkAccessMethods");
        const hardwareAvailable = await checkAuthAvailable();
        onHardwareInfo && onHardwareInfo(hardwareAvailable);
        let typeName = "None";
        if (hardwareAvailable) {
            const biometricAuthEnable = await getAuthInfo();
            if (biometricAuthEnable) {
                typeName = await getCurrentAuthTypeName();
            }
        } else {
            // Do nothing
        }
        onAuthTypeChange && onAuthTypeChange(typeName);
    };

    const handleAppStateChange = (nextAppState) => {
        if (nextAppState != "inactive" && nextAppState != "background") {
            checkAccessMethods();
        }
    };

    useEffect(() => {
        AppState.addEventListener("change", handleAppStateChange);
        checkAccessMethods();
    }, []);

    useFocusEffect(() => {
        checkAccessMethods();
    });

    useImperativeHandle(ref, () => ({
        doCheck: () => {
            checkAccessMethods();
        },
    }));

    return null;
});

export default QuickAccessChecker;
