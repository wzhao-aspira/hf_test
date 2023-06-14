import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useDispatch, useSelector } from "react-redux";
import AppNavigator from "../navigation/AppNavigator";
import { hideSimpleDialog, selectLoginStep, selectSimpleDialog } from "../redux/AppSlice";
import LoginStep from "../constants/LoginStep";
import { SimpleDialog } from "../components/Dialog";
import { genTestId } from "../helper/AppHelper";

export default function RootScreen() {
    const dispatch = useDispatch();
    const loginStep = useSelector(selectLoginStep);
    const simpleDialog = useSelector(selectSimpleDialog);
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
                        if (simpleDialog?.okAction) {
                            simpleDialog.okAction();
                        }
                    }}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
