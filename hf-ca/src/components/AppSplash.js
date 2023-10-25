/* eslint-disable react/style-prop-object */
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Image } from "react-native";

import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import * as ScreenOrientation from "expo-screen-orientation";
import AppContract from "../assets/_default/AppContract";
import { openRealm } from "../db";
import { fetchPicture, getAppConfigData, getLoadingSplashFromFile } from "../services/AppConfigService";
import { getErrorMessage } from "../hooks/useErrorHandling";
import { showToast, SplashStatus } from "../helper/AppHelper";
import { clearUnusedDownloadedFiles } from "../screens/useful_links_old/UsefulLinksHelper";
import AppTheme from "../assets/_default/AppTheme";

const defaultLoadingSplash = require("../assets/_default/images/splash.png");

const styles = StyleSheet.create({
    splash: {
        flex: 1,
        width: "100%",
        height: "100%",
        position: "absolute",
        justifyContent: "flex-start",
        backgroundColor: AppTheme.colors.page_bg,
    },
});

export default function RenderSplash({ onHide, onContentReady }) {
    const [cachedSplash, setCachedSplash] = useState();
    const getConfigError = useRef(false);
    const startTime = useRef(0);

    const initApp = async () => {
        await Promise.all([
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP),
            Font.loadAsync(AppContract.fonts),
            openRealm(),
            getAppConfigData(),
        ]).catch((error) => {
            const errorMessage = getErrorMessage(error);
            console.log(errorMessage);

            showToast(errorMessage, { duration: 0, delay: false });
            getConfigError.current = true;
        });
        if (!getConfigError.current) {
            onContentReady?.();
            fetchPicture();
            const loadTime = Date.now() - startTime.current;
            if (loadTime >= 3000) {
                onHide?.();
                SplashStatus.show = false;
            } else {
                setTimeout(() => {
                    onHide?.();
                    SplashStatus.show = false;
                }, 3000 - loadTime);
            }
        }
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
            startTime.current = Date.now();
            await initApp();
        }
        showSplash();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!cachedSplash) {
        return <View style={{ position: "absolute", flex: 1 }} />;
    }
    return (
        <View style={styles.splash}>
            <StatusBar translucent style="dark" backgroundColor={AppTheme.colors.transparent} />
            <Image resizeMode="cover" style={styles.splash} source={cachedSplash} />
        </View>
    );
}
