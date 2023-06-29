import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { I18nextProvider } from "react-i18next";
import { isEmpty } from "lodash";
import RootScreen from "./src/screens/RootScreen";
import store from "./src/redux/Store";
import AppContract from "./src/assets/_default/AppContract";
import { initAppConfig } from "./src/services/AppConfigService";
import i18n from "./src/localization/i18n";
import { dbCreate, getMobileAccountById } from "./src/helper/DBHelper";
import { setLocalAuth, updateLoginStep } from "./src/redux/AppSlice";
import LoginStep from "./src/constants/LoginStep";
import { getAuthInfo } from "./src/helper/LocalAuthHelper";
import { getActiveUserID } from "./src/helper/AppHelper";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
    const [appReady, setAppReady] = useState(false);

    const getMobileAccountInfoFromDB = async () => {
        const lastUsedMobileAccountId = await getActiveUserID();
        const authInfo = await getAuthInfo(lastUsedMobileAccountId);
        store.dispatch(setLocalAuth(authInfo));
        if (!isEmpty(lastUsedMobileAccountId)) {
            // store.getState().app.loginStep = LoginStep.home;
            const dbResult = await getMobileAccountById(lastUsedMobileAccountId);
            if (dbResult.success) {
                const mobileAccountInfo = dbResult.account;
                if (!isEmpty(mobileAccountInfo)) {
                    // TODO:
                    // Set profiles to redux based on the profileIds
                    // dispatch(setProfileList());
                    // Update the current in use profile based on the currentInUseProfileId
                    // dispatch(updateActiveProfileByID());
                }
            }
            // TODO:
            // dispatch(updateUsername(lastUsedMobileAccountId));
            store.dispatch(updateLoginStep(LoginStep.home));
        }
    };

    useEffect(() => {
        const hideScreen = async () => {
            await Font.loadAsync(AppContract.fonts);
            // await getConfig1();
            // await getConfig2();
            await initAppConfig();
            await dbCreate();
            await getMobileAccountInfoFromDB();
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
