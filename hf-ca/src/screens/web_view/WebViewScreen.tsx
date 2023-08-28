import { useState, useRef, useCallback } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";
import { StatusBar, setStatusBarStyle, setStatusBarBackgroundColor } from "expo-status-bar";

import CommonHeader from "../../components/CommonHeader";
import { SimpleDialog } from "../../components/Dialog";

import AppTheme from "../../assets/_default/AppTheme";
import { isAndroid } from "../../helper/AppHelper";
import type { AppNativeStackScreenProps } from "../../constants/Routers";

const originWhitelist = ["http://*", "https://*", "file://*", "data:*", "content:*"];

const styles = {
    content: {
        flex: 1,
    },
    webview: {
        flex: 1,
        backgroundColor: AppTheme.colors.page_bg,
    },
};

interface WebViewScreenProps extends AppNativeStackScreenProps<"webViewScreen"> {}

function WebViewScreen(props: WebViewScreenProps) {
    const { navigation, route } = props;

    const webview = useRef(null);
    const [noConnectDialogVisible, setNoConnectDialogVisible] = useState(false);

    const url = route.params?.url ?? "";
    const title = route.params?.title ?? "";

    const onBackButtonPress = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleError = useCallback(() => {
        setNoConnectDialogVisible(true);
    }, []);

    const handleLoadStart = useCallback(() => {
        setStatusBarStyle("dark");
    }, []);

    const handleLoadEnd = useCallback(() => {
        [10, 50, 100, 500, 1000].forEach((timeout) => {
            setTimeout(() => {
                setStatusBarStyle("dark");
                if (isAndroid()) {
                    setStatusBarBackgroundColor(AppTheme.colors.page_bg, false);
                }
            }, timeout);
        });
    }, []);

    return (
        <View style={styles.content}>
            <StatusBar style={AppTheme.statusBarStyle} backgroundColor={AppTheme.colors.page_bg} />
            <CommonHeader
                rightIcon={false}
                title={title}
                onBackClick={() => {
                    onBackButtonPress();
                }}
            />
            <WebView
                ref={webview}
                startInLoadingState
                originWhitelist={originWhitelist}
                bounces={false}
                style={styles.webview}
                source={{ uri: url }}
                onLoadStart={handleLoadStart}
                onLoadEnd={handleLoadEnd}
                onError={handleError}
                onMessage={(event) => {
                    const message = event.nativeEvent.data;
                    console.log(message);
                }}
            />
            <SimpleDialog
                title="errMsg.networkErrorTitle"
                message="errMsg.networkErrorMsg"
                okText="common.gotIt"
                visible={noConnectDialogVisible}
                okAction={() => {
                    setNoConnectDialogVisible(false);
                    onBackButtonPress();
                }}
            />
        </View>
    );
}

export default WebViewScreen;
