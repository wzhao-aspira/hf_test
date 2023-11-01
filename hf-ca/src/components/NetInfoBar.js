import { useNetInfo } from "@react-native-community/netinfo";
import React, { useCallback, useEffect, useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import { debounce } from "lodash";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectCurrentRouter } from "../redux/AppSlice";
import AppTheme from "../assets/_default/AppTheme";
import { selectLastUpdateTimeFromServer } from "../redux/LicenseSelector";
import Routers from "../constants/Routers";
import { SCREEN_WIDTH } from "../constants/Dimension";
import { OFFLINE_BAR_SHOW_TWO_LINES_BREAK_POINT } from "../constants/Constants";

const styles = StyleSheet.create({
    message: {
        height: 30,
        lineHeight: 30,
        width: "100%",
        backgroundColor: AppTheme.colors.font_color_2,
        color: AppTheme.colors.font_color_4,
        textAlign: "center",
        textAlignVertical: "center",
        ...AppTheme.typography.button_text,
    },
    messageContainer: {
        flexDirection: "column",
        justifyContent: "center",
        paddingVertical: 6,
    },
    messageWithUpdateTimeLines: {
        height: 14,
        lineHeight: 14,
    },
});

let dismissNetInfo;

export default function NetInfoBar() {
    const { t } = useTranslation();
    const [netConnected, setNetConnected] = useState(true);
    const [showNetInfo, setShowNetInfo] = useState(false);
    const currentRouter = useSelector(selectCurrentRouter);
    const netInfo = useNetInfo() || {};
    if (netInfo.isConnected == null) {
        netInfo.isConnected = true;
    }
    const { isConnected = true } = netInfo;
    const lastUpdateTimeFromServer = useSelector(selectLastUpdateTimeFromServer);
    const licenseRefreshedOnText = t("netStatus.licenseRefreshedOn");
    const text = netConnected ? t("netStatus.backOnline") : t("netStatus.offline");
    const backgroundColor = netConnected ? AppTheme.colors.success : AppTheme.colors.font_color_2;
    const detectNetChange = () => {
        if (netConnected && isConnected) {
            // no change
            return;
        }
        if (!netConnected && !isConnected) {
            // no change
            return;
        }
        // console.log(`net status changed:${isConnected}`);
        clearTimeout(dismissNetInfo);
        setNetConnected(isConnected);
        setShowNetInfo(true);
        if (isConnected) {
            dismissNetInfo = setTimeout(() => {
                setShowNetInfo(false);
            }, 5000);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceDetect = useCallback(debounce(detectNetChange, 200), [isConnected]);

    useEffect(() => {
        debounceDetect();
    }, [debounceDetect]);

    if (!showNetInfo) {
        return null;
    }

    const renderOfflineWithLicenseLastUpdateTime = () => {
        return SCREEN_WIDTH < OFFLINE_BAR_SHOW_TWO_LINES_BREAK_POINT ? (
            <View style={[styles.messageContainer, { backgroundColor }]}>
                <Text style={[styles.message, styles.messageWithUpdateTimeLines]}>{text}</Text>
                <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[styles.message, styles.messageWithUpdateTimeLines]}
                >{`${licenseRefreshedOnText} ${lastUpdateTimeFromServer}`}</Text>
            </View>
        ) : (
            <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[styles.message, { backgroundColor }]}
            >{`${text} - ${licenseRefreshedOnText} ${lastUpdateTimeFromServer}`}</Text>
        );
    };

    return !netConnected && Routers.home === currentRouter ? (
        renderOfflineWithLicenseLastUpdateTime()
    ) : (
        <Text style={[styles.message, { backgroundColor }]}>{text}</Text>
    );
}
