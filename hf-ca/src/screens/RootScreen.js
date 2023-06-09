import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AppNavigator from "../navigation/AppNavigator";

export default function RootScreen() {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }} accessible>
                <StatusBar translucent />
                <AppNavigator />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
