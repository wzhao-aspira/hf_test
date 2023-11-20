/* eslint-disable react/style-prop-object */
import React, { useEffect, useRef } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useSelector } from "react-redux";
import AppNavigator from "../navigation/AppNavigator";
import { selectIndicator, selectLoginStep } from "../redux/AppSlice";
import LoginStep from "../constants/LoginStep";
import { Indicator } from "../components/Dialog";
import { genTestId } from "../helper/AppHelper";
import AppTheme from "../assets/_default/AppTheme";
import useErrorHandling from "../hooks/useErrorHandling";
import PrimaryProfileInactiveDialog from "./profile/manage_profile/PrimaryProfileInactiveDialog";
import { checkVersion } from "../services/VersionCheckService";
import AppStateManager from "../helper/AppStateManager";
import { RootModal } from "../components/dialog/index";

export default function RootScreen() {
    const loginStep = useSelector(selectLoginStep);
    const indicator = useSelector(selectIndicator);
    const appState = useRef(null);
    const isLogin = loginStep == LoginStep.login;

    useErrorHandling();
    useEffect(() => {
        AppStateManager.addAppStateListener((state) => {
            console.log(state);
            if (appState.current?.match("inactive|background")) {
                if (state == "active") {
                    console.log("App has come to the foreground!");
                    checkVersion();
                }
            }
            appState.current = state;
        });
        checkVersion();
    }, []);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }} edges={!isLogin ? null : ["left", "right"]}>
                <StatusBar
                    translucent={isLogin}
                    style="dark"
                    backgroundColor={isLogin ? AppTheme.colors.transparent : AppTheme.colors.page_bg}
                />
                <AppNavigator />
                <PrimaryProfileInactiveDialog />
                <RootModal />
                <Indicator testID={genTestId("appIndicator")} visible={indicator} />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
