import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import RootScreen from "./src/screens/RootScreen";
import store from "./src/redux/Store";
import AppContract from "./src/assets/_default/AppContract";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
    const [appReady, setAppReady] = useState(false);

    useEffect(() => {
        const hideScreen = async () => {
            await Font.loadAsync(AppContract.fonts);
            // await getConfig1();
            // await getConfig2();
            setAppReady(true);
            await SplashScreen.hideAsync();
        };
        hideScreen();
    }, []);

    if (!appReady) {
        return null;
    }
    return (
        <Provider store={store}>
            <RootScreen />
        </Provider>
    );
}
