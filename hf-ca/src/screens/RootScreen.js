import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useSelector } from "react-redux";
import AppNavigator from "../navigation/AppNavigator";
import { selectLoginStep } from "../redux/AppSlice";
import LoginStep from "../constants/LoginStep";

export default function RootScreen() {
    const loginStep = useSelector(selectLoginStep);
    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={{ flex: 1 }}
                edges={loginStep !== LoginStep.login ? null : ["left", "right"]}
                accessible
            >
                <StatusBar translucent />
                <AppNavigator />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
