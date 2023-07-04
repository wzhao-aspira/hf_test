import React, { useEffect, useImperativeHandle } from "react";
import { getAuthInfo, getLastBiometricLoginUser } from "../helper/LocalAuthHelper";
import useAppState from "../hooks/useAppState";

const QuickAccessChecker = React.forwardRef((props, ref) => {
    const { onChange, children } = props;

    const checkAccessMethods = async () => {
        const userID = await getLastBiometricLoginUser();
        const info = await getAuthInfo(userID);
        onChange(info);
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
