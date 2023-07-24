import React, { useEffect, useImperativeHandle } from "react";
import { getAuthInfo, getLastBiometricLoginUser } from "../helper/LocalAuthHelper";
import useAppState from "../hooks/useAppState";

// TODO: The function looks like a custom hook instead a component.
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useImperativeHandle(ref, () => ({
        doCheck: () => {
            checkAccessMethods();
        },
    }));

    return children;
});

export default QuickAccessChecker;
