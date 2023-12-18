import { useNetInfo } from "@react-native-community/netinfo";
import { useCallback, useEffect, useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import { debounce } from "lodash";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { selectors, actions as appActions } from "../../redux/AppSlice";
import AppTheme from "../../assets/_default/AppTheme";
import { SCREEN_WIDTH } from "../../constants/Dimension";
import { OFFLINE_BAR_SHOW_TWO_LINES_BREAK_POINT } from "../../constants/Constants";

import useLastUpdateDate from "./hooks/useLastUpdateDate";

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
let recoverColorOffline;
let recoverColorOnline;

export default function NetInfoBar() {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const errorIsNetError = useSelector(selectors.selectErrorIsNetError);
    const showNetErrorByDialog = useSelector(selectors.selectShowNetErrorByDialog);

    const [netConnected, setNetConnected] = useState(true);
    const [showNetInfo, setShowNetInfo] = useState(false);
    const [showNetError, setShowNetError] = useState(false);

    const lastUpdateDate = useLastUpdateDate(showNetInfo);

    const netInfo = useNetInfo() || {};
    if (netInfo.isInternetReachable == null) {
        netInfo.isInternetReachable = true;
    }

    const { isInternetReachable = true } = netInfo;
    const refreshedOnText = t("netStatus.refreshedOn");
    const text = netConnected ? t("netStatus.backOnline") : t("netStatus.offline");

    let backgroundColor = netConnected ? AppTheme.colors.success : AppTheme.colors.font_color_2;
    backgroundColor = showNetError ? AppTheme.colors.error : backgroundColor;

    const toggleNetBar = () => {
        clearTimeout(dismissNetInfo);
        setNetConnected(isInternetReachable);
        setShowNetInfo(true);
        if (isInternetReachable) {
            dismissNetInfo = setTimeout(() => {
                setShowNetInfo(false);
            }, 5000);
        }
    };

    const detectNetChange = () => {
        if (netConnected == isInternetReachable) {
            // no change
            return;
        }
        toggleNetBar();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceDetect = useCallback(debounce(detectNetChange, 200), [netConnected, isInternetReachable]);

    useEffect(() => {
        debounceDetect();
    }, [debounceDetect]);

    useEffect(() => {
        if (errorIsNetError) {
            setShowNetError(true);
            if (!isInternetReachable) {
                // device is offline mode, just clear error
                clearTimeout(recoverColorOffline);
                recoverColorOffline = setTimeout(() => {
                    setShowNetError(false);
                    if (!showNetErrorByDialog) {
                        dispatch(appActions.clearError());
                    }
                }, 1000);
            } else {
                // device is online mode
                // NetInfo bar show offline state
                setShowNetInfo(true);
                setNetConnected(false);

                // clear error and close NetInfo bar after 1 second
                clearTimeout(recoverColorOnline);
                recoverColorOnline = setTimeout(() => {
                    setShowNetError(false);
                    if (!showNetErrorByDialog) {
                        dispatch(appActions.clearError());
                    }
                    // setShowNetInfo(false);
                }, 1000);
            }
        }
    }, [dispatch, errorIsNetError, isInternetReachable, showNetErrorByDialog]);

    if (!showNetInfo) {
        return null;
    }

    const renderOfflineWithLastUpdateTime = () => {
        return SCREEN_WIDTH < OFFLINE_BAR_SHOW_TWO_LINES_BREAK_POINT ? (
            <>
                <Text style={[styles.message]}>{text}</Text>
                <Text
                    style={[styles.message]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >{`${refreshedOnText} ${lastUpdateDate}`}</Text>
            </>
        ) : (
            <Text
                style={[styles.message]}
                numberOfLines={1}
                ellipsizeMode="tail"
            >{`${text} - ${refreshedOnText} ${lastUpdateDate}`}</Text>
        );
    };

    return (
        <View style={[styles.messageContainer, { backgroundColor }]}>
            {!netConnected && lastUpdateDate ? (
                renderOfflineWithLastUpdateTime()
            ) : (
                <Text style={[styles.message]}>{text}</Text>
            )}
        </View>
    );
}
