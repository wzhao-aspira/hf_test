/* eslint-disable react/style-prop-object */
import "react-native-url-polyfill/auto";
import { decode, encode } from "base-64";
import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import * as SplashScreen from "expo-splash-screen";

import { I18nextProvider } from "react-i18next";
import { isEmpty } from "lodash";
import { View } from "react-native";
import RootScreen from "./src/screens/RootScreen";
import store from "./src/redux/Store";
import i18n from "./src/localization/i18n";
import { updateLoginStep } from "./src/redux/AppSlice";
import appThunkActions from "./src/redux/AppThunk";
import LoginStep from "./src/constants/LoginStep";
import { getActiveUserID } from "./src/helper/AppHelper";
import ProfileThunk from "./src/redux/ProfileThunk";
import { restoreToken } from "./src/network/tokenUtil";
import RenderSplash from "./src/components/AppSplash";

SplashScreen.preventAutoHideAsync().catch((e) => console.log(e));

if (!global.btoa) {
    global.btoa = encode;
}

if (!global.atob) {
    global.atob = decode;
}

if (__DEV__) {
    import("./ReactotronConfig").then(() => console.log("Reactotron Configured"));
}

function RenderContent() {
    const checkLogin = async () => {
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
        checkLogin();
    }, []);
    return <RootScreen />;
}
export default function App() {
    const [showSplash, setShowSplash] = useState(true);
    const [showContent, setShowContent] = useState(false);

    return (
        <I18nextProvider i18n={i18n}>
            <Provider store={store}>
                <View style={{ flex: 1 }}>
                    {showContent && <RenderContent />}
                    {showSplash && (
                        <RenderSplash
                            onContentReady={() => setShowContent(true)}
                            onHide={() => {
                                setShowSplash(false);
                            }}
                        />
                    )}
                </View>
            </Provider>
        </I18nextProvider>
    );
}
