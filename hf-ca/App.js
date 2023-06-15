import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { I18nextProvider } from "react-i18next";
import RootScreen from "./src/screens/RootScreen";
import store from "./src/redux/Store";
import AppContract from "./src/assets/_default/AppContract";
import { initAppConfig } from "./src/services/AppConfigService";
import i18n from "./src/localization/i18n";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
    const [appReady, setAppReady] = useState(false);

    useEffect(() => {
        const hideScreen = async () => {
            await Font.loadAsync(AppContract.fonts);
            // await getConfig1();
            // await getConfig2();
            await initAppConfig();
            setAppReady(true);
            await SplashScreen.hideAsync();
        };
        hideScreen();
    }, []);

    if (!appReady) {
        return null;
    }
    return (
        <I18nextProvider i18n={i18n}>
            <Provider store={store}>
                <RootScreen />
            </Provider>
        </I18nextProvider>
    );
}
