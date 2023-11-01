/* eslint-disable react/style-prop-object */
import "react-native-url-polyfill/auto";
import { decode, encode } from "base-64";
import { Provider } from "react-redux";
import * as SplashScreen from "expo-splash-screen";
import { I18nextProvider } from "react-i18next";
import { useEffect, useState } from "react";
import { Image } from "expo-image";
import * as Font from "expo-font";
import * as ScreenOrientation from "expo-screen-orientation";
import { isEmpty } from "lodash";
import RootScreen from "./src/screens/RootScreen";
import store from "./src/redux/Store";
import i18n from "./src/localization/i18n";
import { fetchPicture, getAppConfigData, getLoadingSplashFromFile } from "./src/services/AppConfigService";
import AppContract from "./src/assets/_default/AppContract";
import { openRealm } from "./src/db";
import { getErrorMessage } from "./src/hooks/useErrorHandling";
import { getActiveUserID, showToast } from "./src/helper/AppHelper";
import { clearUnusedDownloadedFiles } from "./src/screens/useful_links_old/UsefulLinksHelper";
import { restoreToken } from "./src/network/tokenUtil";
import { updateLoginStep } from "./src/redux/AppSlice";
import LoginStep from "./src/constants/LoginStep";
import ProfileThunk from "./src/redux/ProfileThunk";
import appThunkActions from "./src/redux/AppThunk";

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
const defaultLoadingSplash = require("./src/assets/_default/images/splash.png");

const checkLogin = async () => {
    const lastUsedMobileAccountId = await getActiveUserID();
    if (!isEmpty(lastUsedMobileAccountId)) {
        const hasAccessToken = await restoreToken(lastUsedMobileAccountId);
        if (hasAccessToken) {
            await store.dispatch(appThunkActions.initUserData({ userID: lastUsedMobileAccountId }));
            await store.dispatch(ProfileThunk.initProfile(false, true));
            store.dispatch(updateLoginStep(LoginStep.home));
            return;
        }
    }
    store.dispatch(updateLoginStep(LoginStep.login));
};

export default function App() {
    const [isSplashReady, setIsSplashReady] = useState(false);
    const [cachedSplash, setCachedSplash] = useState();
    let hasError = false;
    let startTime = 1;

    const initApp = async () => {
        hasError = false;
        await Promise.all([
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP),
            Font.loadAsync(AppContract.fonts),
            openRealm(),
            getAppConfigData(),
        ]).catch((error) => {
            const errorMessage = getErrorMessage(error);
            console.log(errorMessage);

            showToast(errorMessage, { duration: 0, delay: false });
            hasError = true;
        });
        clearUnusedDownloadedFiles();
    };

    useEffect(() => {
        async function showSplash() {
            await SplashScreen.hideAsync().catch((e) => console.log(e));
            const uri = await getLoadingSplashFromFile();
            console.log(`uri:${JSON.stringify(uri)}`);
            if (uri) {
                setCachedSplash(uri);
            } else {
                setCachedSplash(defaultLoadingSplash);
            }
        }
        showSplash();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!isSplashReady) {
        return (
            <Image
                source={cachedSplash}
                contentFit="cover"
                style={{ flex: 1 }}
                onLoadEnd={async () => {
                    startTime = Date.now();
                    await initApp();
                    if (!hasError) {
                        fetchPicture();
                        const loadTime = Date.now() - startTime;
                        console.log("loadTime", loadTime);
                        setTimeout(async () => {
                            await checkLogin();
                            setIsSplashReady(true);
                        }, 3000 - loadTime);
                    }
                }}
            />
        );
    }
    return (
        <I18nextProvider i18n={i18n}>
            <Provider store={store}>
                <RootScreen />
            </Provider>
        </I18nextProvider>
    );
}
