import "react-native-url-polyfill/auto";
import { decode, encode } from "base-64";
import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import * as SplashScreen from "expo-splash-screen";
import * as ScreenOrientation from "expo-screen-orientation";
import * as Font from "expo-font";
import { I18nextProvider } from "react-i18next";
import { isEmpty } from "lodash";
import RootScreen from "./src/screens/RootScreen";
import store from "./src/redux/Store";
import AppContract from "./src/assets/_default/AppContract";
import { fetchAppConfig, initAppLocalConfig } from "./src/services/AppConfigService";
import i18n from "./src/localization/i18n";
import { updateLoginStep } from "./src/redux/AppSlice";
import appThunkActions from "./src/redux/AppThunk";
import LoginStep from "./src/constants/LoginStep";
import { getActiveUserID } from "./src/helper/AppHelper";
import { clearUnusedDownloadedFiles } from "./src/screens/useful_links/UsefulLinksHelper";
import ProfileThunk from "./src/redux/ProfileThunk";
import { restoreToken } from "./src/network/tokenUtil";
import { openRealm } from "./src/db";

if (!global.btoa) {
    global.btoa = encode;
}

if (!global.atob) {
    global.atob = decode;
}

if (__DEV__) {
    import("./ReactotronConfig").then(() => console.log("Reactotron Configured"));
}

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
    const [appReady, setAppReady] = useState(false);

    const initAppData = async () => {
        const lastUsedMobileAccountId = await getActiveUserID();
        if (!isEmpty(lastUsedMobileAccountId)) {
            const hasAccessToken = await restoreToken(lastUsedMobileAccountId);
            if (hasAccessToken) {
                await store.dispatch(appThunkActions.initUserData({ userID: lastUsedMobileAccountId }));
                await store.dispatch(ProfileThunk.initProfile(false, true));
                store.dispatch(updateLoginStep(LoginStep.home));
            }
        }
    };

    useEffect(() => {
        const hideScreen = async () => {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            await Font.loadAsync(AppContract.fonts);
            await initAppLocalConfig();
            fetchAppConfig();
            await openRealm();
            await initAppData();
            setAppReady(true);
            await SplashScreen.hideAsync();
        };
        hideScreen();
    }, []);

    useEffect(() => {
        clearUnusedDownloadedFiles();
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
