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
        height: 14,
        lineHeight: 14,
        color: AppTheme.colors.font_color_4,
        verticalAlign: "middle",
        ...AppTheme.typography.button_text,
    },
    messageContainer: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        backgroundColor: AppTheme.colors.font_color_2,
        height: 36,
        lineHeight: 36,
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
            <>
                <Text style={[styles.message]}>{text}</Text>
                <Text
                    style={[styles.message]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >{`${licenseRefreshedOnText} ${lastUpdateTimeFromServer}`}</Text>
            </>
        ) : (
            <Text
                style={[styles.message]}
                numberOfLines={1}
                ellipsizeMode="tail"
            >{`${text} - ${licenseRefreshedOnText} ${lastUpdateTimeFromServer}`}</Text>
        );
    };

    return (
        <View style={[styles.messageContainer, { backgroundColor }]}>
            {!netConnected && Routers.home === currentRouter ? (
                renderOfflineWithLicenseLastUpdateTime()
            ) : (
                <Text style={[styles.message]}>{text}</Text>
            )}
        </View>
    );
}
