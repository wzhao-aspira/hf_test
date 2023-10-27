/* eslint-disable react/style-prop-object */
import React from "react";
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

export default function RootScreen() {
    const loginStep = useSelector(selectLoginStep);
    const indicator = useSelector(selectIndicator);
    useErrorHandling();

    const isLogin = loginStep == LoginStep.login || loginStep == LoginStep.splash;
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }} edges={!isLogin ? null : ["left", "right"]} accessible>
                <StatusBar
                    translucent={isLogin}
                    style="dark"
                    backgroundColor={isLogin ? AppTheme.colors.transparent : AppTheme.colors.page_bg}
                />
                <AppNavigator />
                <PrimaryProfileInactiveDialog />
                <Indicator testID={genTestId("appIndicator")} visible={indicator} />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
