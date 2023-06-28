import React, { useEffect, useImperativeHandle } from "react";
import { useSelector } from "react-redux";
import { checkAuthAvailable, getAuthInfo } from "../helper/LocalAuthHelper";
import { selectUsername } from "../redux/AppSlice";
import useAppState from "../hooks/useAppState";

const QuickAccessChecker = React.forwardRef((props, ref) => {
    const { onHardwareInfo, onAuthTypeChange, children } = props;

    const userName = useSelector(selectUsername);

    const checkAccessMethods = async () => {
        const hardwareAvailable = await checkAuthAvailable();
        onHardwareInfo && onHardwareInfo(hardwareAvailable);
        let typeName = "None";
        if (hardwareAvailable) {
            const authInfo = await getAuthInfo(userName);
            if (authInfo) {
                typeName = authInfo.typeName;
            }
        } else {
            // Do nothing
        }
        onAuthTypeChange && onAuthTypeChange(typeName);
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
