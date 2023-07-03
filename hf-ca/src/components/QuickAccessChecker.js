import React, { useEffect, useImperativeHandle } from "react";
import { checkAuthAvailable, getAuthType } from "../helper/LocalAuthHelper";
import useAppState from "../hooks/useAppState";

const QuickAccessChecker = React.forwardRef((props, ref) => {
    const { onHardwareInfo, onAuthTypeChange, children } = props;

    const checkAccessMethods = async () => {
        const hardwareAvailable = await checkAuthAvailable();
        onHardwareInfo?.(hardwareAvailable);
        let typeName = "None";
        if (hardwareAvailable) {
            typeName = await getAuthType();
        }
        onAuthTypeChange?.(typeName);
    };

    useAppState((nextAppState) => {
        if (nextAppState != "inactive" && nextAppState != "background") {
            checkAccessMethods();
        }
    });

    useEffect(() => {
        checkAccessMethods();
    }, []);

    useImperativeHandle(ref, () => ({
        doCheck: () => {
            checkAccessMethods();
        },
    }));

    return <>{children}</>;
});

export default QuickAccessChecker;
