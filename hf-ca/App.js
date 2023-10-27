/* eslint-disable react/style-prop-object */
import "react-native-url-polyfill/auto";
import { decode, encode } from "base-64";
import { Provider } from "react-redux";
import * as SplashScreen from "expo-splash-screen";
import { I18nextProvider } from "react-i18next";
import RootScreen from "./src/screens/RootScreen";
import store from "./src/redux/Store";
import i18n from "./src/localization/i18n";

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

export default function App() {
    return (
        <I18nextProvider i18n={i18n}>
            <Provider store={store}>
                <RootScreen />
            </Provider>
        </I18nextProvider>
    );
}
