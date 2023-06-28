import React, { useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useDispatch, useSelector } from "react-redux";
import AppNavigator from "../navigation/AppNavigator";
import {
    hideSelectDialog,
    hideSimpleDialog,
    selectIndicator,
    selectLoginStep,
    selectSelectDialog,
    selectSimpleDialog,
    setLocalAuth,
} from "../redux/AppSlice";
import LoginStep from "../constants/LoginStep";
import { Indicator, SelectDialog, SimpleDialog } from "../components/Dialog";
import { genTestId } from "../helper/AppHelper";
import { getAuthInfo } from "../helper/LocalAuthHelper";

export default function RootScreen() {
    const dispatch = useDispatch();
    const loginStep = useSelector(selectLoginStep);
    const simpleDialog = useSelector(selectSimpleDialog);
    const selectDialog = useSelector(selectSelectDialog);
    const indicator = useSelector(selectIndicator);

    useEffect(() => {
        const getLocalAuthInfo = async () => {
            // todo get active userId from db or localStorage
            const userName = "wzhao1";
            const authInfo = await getAuthInfo(userName);
            dispatch(setLocalAuth(authInfo));
        };
        getLocalAuthInfo();
    }, []);

    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={{ flex: 1 }}
                edges={loginStep !== LoginStep.login ? null : ["left", "right"]}
                accessible
            >
                <StatusBar translucent />
                <AppNavigator />
                <SimpleDialog
                    {...simpleDialog}
                    testID={genTestId("simpleDialog")}
                    okAction={() => {
                        dispatch(hideSimpleDialog());
                        simpleDialog?.okAction && simpleDialog.okAction();
                    }}
                />
                <SelectDialog
                    {...selectDialog}
                    testID={genTestId("selectDialog")}
                    okAction={() => {
                        dispatch(hideSelectDialog());
                        selectDialog.okAction && selectDialog.okAction();
                    }}
                    cancelAction={() => {
                        dispatch(hideSelectDialog());
                        selectDialog.cancelAction && selectDialog.cancelAction();
                    }}
                />
                <Indicator testID={genTestId("appIndicator")} visible={indicator} />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
