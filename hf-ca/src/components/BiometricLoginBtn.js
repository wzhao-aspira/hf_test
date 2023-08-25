import React, { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { isEmpty } from "lodash";
import {
    startBiometricAuth,
    getLoginCredential,
    getAuthInfo,
    getLastBiometricLoginUser,
    resetOnboardingPage,
    getPasswordChangeInd,
    updateAuthInfo,
    setLastBiometricLoginUser,
} from "../helper/LocalAuthHelper";
import AppContract from "../assets/BaseContract";
import QuickAccessChecker from "./QuickAccessChecker";
import OutlinedBtn from "./OutlinedBtn";
import DialogHelper from "../helper/DialogHelper";

export default function BiometricLoginBtn({ onAuthSuccess }) {
    const { t } = useTranslation();
    const [showBtn, setShowBtn] = React.useState(false);
    const [type, setTypeName] = React.useState("");
    const quickAccessChecker = useRef();
    const useAuthStr = `${t("auth.use")} ${type}`;

    const startAuth = async (onSuccess, onError) => {
        const userID = await getLastBiometricLoginUser();
        startBiometricAuth(
            userID,
            async () => {
                const userInfo = await getLoginCredential(userID);
                if (isEmpty(userInfo)) {
                    return;
                }
                console.log(userInfo);
                // Check if the user password changed
                const isPasswordChanged = await getPasswordChangeInd(userID);
                if (isPasswordChanged != null && isPasswordChanged) {
                    DialogHelper.showSimpleDialog({
                        title: "common.reminder",
                        message: "auth.passwordChangeNeedLoginManually",
                        okText: "common.gotIt",
                        okAction: () => {
                            setShowBtn(false);
                            resetOnboardingPage(userID);
                            updateAuthInfo(false, userID);
                            setLastBiometricLoginUser("");
                        },
                    });
                } else {
                    onSuccess(userInfo);
                }
            },
            (res) => {
                if (res.error != "user_cancel") {
                    onError();
                }
            }
        );
    };

    const checkBiometricLogin = useCallback(
        async (startAuthenticate) => {
            const { biometric_enabled: biometricEnabled } = AppContract.function;
            if (!biometricEnabled) {
                return;
            }
            const userID = await getLastBiometricLoginUser();
            if (isEmpty(userID)) {
                return;
            }
            const { available, enable, typeName } = await getAuthInfo(userID);
            setTypeName(typeName);
            setShowBtn(available && enable);
            if (available && enable && startAuthenticate) {
                startAuth(onAuthSuccess, () => setShowBtn(false));
            }
        },
        [onAuthSuccess]
    );
    useEffect(() => {
        checkBiometricLogin(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {showBtn && (
                <OutlinedBtn
                    style={{ marginTop: 20 }}
                    testID="useBiometricBtn"
                    label={useAuthStr}
                    onPress={() => {
                        startAuth(onAuthSuccess, () => setShowBtn(false));
                    }}
                />
            )}
            <QuickAccessChecker
                ref={quickAccessChecker}
                onChange={({ available, typeName, enable }) => {
                    setShowBtn(available && enable);
                    setTypeName(typeName);
                }}
            />
        </>
    );
}
