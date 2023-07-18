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

export default function RootScreen() {
    const loginStep = useSelector(selectLoginStep);
    const indicator = useSelector(selectIndicator);
    const isLogin = loginStep == LoginStep.login;
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }} edges={!isLogin ? null : ["left", "right"]} accessible>
                <StatusBar
                    translucent={isLogin}
                    style="dark"
                    backgroundColor={isLogin ? AppTheme.colors.transparent : AppTheme.colors.page_bg}
                />
                <AppNavigator />
                <Indicator testID={genTestId("appIndicator")} visible={indicator} />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
