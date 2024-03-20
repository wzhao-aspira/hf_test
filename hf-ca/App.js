import "react-native-url-polyfill/auto";
import { decode, encode } from "base-64";
import { Provider } from "react-redux";
import * as SplashScreen from "expo-splash-screen";
import { I18nextProvider } from "react-i18next";
import { useEffect, useState } from "react";
import * as Font from "expo-font";
import * as ScreenOrientation from "expo-screen-orientation";
import * as Sentry from "@sentry/react-native";
import { Image, LogBox } from "react-native";
import RootScreen from "./src/screens/RootScreen";
import store from "./src/redux/Store";
import i18n from "./src/localization/i18n";
import { fetchPicture, getAppConfigData, getLoadingSplashFromFile } from "./src/services/AppConfigService";
import AppContract from "./src/assets/_default/AppContract";
import { openRealm } from "./src/db";
import { getErrorMessage } from "./src/hooks/useErrorHandling";
import { showToast, enabledSentry } from "./src/helper/AppHelper";
import { clearUnusedDownloadedFiles } from "./src/screens/useful_links_old/UsefulLinksHelper";
import { updateLoginStep } from "./src/redux/AppSlice";
import LoginStep from "./src/constants/LoginStep";
import ProfileThunk from "./src/redux/ProfileThunk";
import appThunkActions from "./src/redux/AppThunk";
import AppAnalyticsHelper from "./src/helper/AppAnalyticsHelper";
import { DialogProvider } from "./src/components/dialog/index";
import configureNetworkDetect from "./src/services/ApiHealthService";
import AccountService from "./src/services/AccountService";
import { LOGIN_TYPE } from "./src/constants/Constants";

LogBox.ignoreLogs(["Found screens with the same name nested inside one another."]);

Sentry.init({
    enabled: enabledSentry(),
    dsn: "https://d55674d518ec65559ec0c4353f7fe43c@o368395.ingest.sentry.io/4506278491979776",
});

SplashScreen.preventAutoHideAsync().catch((e) => console.log(e));

configureNetworkDetect();

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
    const res = await AccountService.hasAccessToken();
    if (res.success) {
        await store.dispatch(appThunkActions.initUserData({ userID: res.lastUsedMobileAccountId }));
        await store.dispatch(ProfileThunk.initProfile(false));
        store.dispatch(updateLoginStep(LoginStep.home));
        return;
    }
    store.dispatch(updateLoginStep(LoginStep.login));
};

function App() {
    const [isSplashReady, setIsSplashReady] = useState(false);
    const [cachedSplash, setCachedSplash] = useState();
    let hasError = false;
    let startTime = 1;

    const initApp = async () => {
        hasError = false;
        await Promise.all([
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP),
            Font.loadAsync(AppContract.fonts),
            AppAnalyticsHelper.init(),
            openRealm(),
            getAppConfigData(),
        ]).catch((error) => {
            const errorMessage = getErrorMessage(error);
            console.log(errorMessage);

            showToast(errorMessage, { duration: 0, delay: 0 });
            Sentry.captureException(error);
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
        AccountService.uploadDeviceInfo(LOGIN_TYPE.Reopen);
    }, []);

    if (!isSplashReady) {
        return (
            <Image
                source={cachedSplash ?? defaultLoadingSplash}
                resizeMode="cover"
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
                <DialogProvider>
                    <RootScreen />
                </DialogProvider>
            </Provider>
        </I18nextProvider>
    );
}

export default Sentry.wrap(App);
