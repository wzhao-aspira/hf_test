import React, { useEffect, useRef, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { useAppSelector as useSelector } from "../hooks/redux";
import { selectIndicator, selectLoginStep } from "../redux/AppSlice";

import LoginStep from "../constants/LoginStep";

import AppNavigator from "../navigation/AppNavigator";
import { Indicator } from "../components/Dialog";
import { genTestId } from "../helper/AppHelper";
import AppTheme from "../assets/_default/AppTheme";
import useErrorHandling from "../hooks/useErrorHandling";
import PrimaryProfileInactiveDialog from "./profile/manage_profile/PrimaryProfileInactiveDialog";
import { checkVersion } from "../services/VersionCheckService";
import AppStateManager from "../helper/AppStateManager";
import { RootModal } from "../components/dialog/index";
import { checkRegulationUpdate } from "../components/RegulationUpdateChecker";
import { registerNotifeeEvent } from "../helper/NotifeeHelper";
import { reDownloadFailedRegulations } from "../services/RegulationService";

export default function RootScreen() {
    const loginStep = useSelector(selectLoginStep);
    const indicator = useSelector(selectIndicator);
    const appState = useRef(null);
    const isLogin = loginStep == LoginStep.login;
    const isHome = loginStep == LoginStep.home;
    const [version, setVersion] = useState(0);

    useErrorHandling();
    useEffect(() => {
        AppStateManager.addAppStateListener((state) => {
            console.log(state);
            if (appState.current?.match("inactive|background")) {
                if (state == "active") {
                    console.log("App has come to the foreground!");
                    checkVersion();
                    if (isHome) {
                        reDownloadFailedRegulations();
                    }
                }
            }
            appState.current = state;
        });

        registerNotifeeEvent();
        checkVersion();
    }, []);

    useEffect(() => {
        if (isLogin) {
            setVersion((v) => v + 1);
        }
    }, [isLogin]);

    useEffect(() => {
        if (isHome) {
            checkRegulationUpdate();
        }
    }, [isHome]);

    return (
        <SafeAreaProvider>
            <SafeAreaView key={version} style={{ flex: 1 }} edges={!isLogin ? null : ["left", "right"]}>
                <StatusBar
                    translucent={isLogin}
                    style="dark"
                    backgroundColor={isLogin ? AppTheme.colors.transparent : AppTheme.colors.page_bg}
                />
                <AppNavigator />
                <PrimaryProfileInactiveDialog />
                {indicator && <Indicator testID={genTestId("appIndicator")} visible={indicator} />}
                <RootModal />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
