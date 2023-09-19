import { useNetInfo } from "@react-native-community/netinfo";
import React, { useCallback, useEffect, useState } from "react";
import { Text, StyleSheet } from "react-native";
import { debounce } from "lodash";
import { useTranslation } from "react-i18next";
import AppTheme from "../assets/_default/AppTheme";

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
});

let dismissNetInfo;

export default function NetInfoBar() {
    const { t } = useTranslation();
    const [netConnected, setNetConnected] = useState(true);
    const [showNetInfo, setShowNetInfo] = useState(false);
    const netInfo = useNetInfo() || {};
    if (netInfo.isConnected == null) {
        netInfo.isConnected = true;
    }
    const { isConnected = true } = netInfo;

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

    return <Text style={[styles.message, { backgroundColor }]}>{text}</Text>;
}
