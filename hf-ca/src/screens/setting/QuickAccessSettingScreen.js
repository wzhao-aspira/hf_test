import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import Page from "../../components/Page";

import CommonHeader from "../../components/CommonHeader";
import AppTheme from "../../assets/_default/AppTheme";
import SVGIcon, { pathList } from "../../components/SVGIcon";
import {
    updateAuthInfo,
    startBiometricAuth,
    setLastBiometricLoginUser,
    saveOnboardingPageAppear,
    getPasswordChangeInd,
} from "../../helper/LocalAuthHelper";
import QuickAccessChecker from "../../components/QuickAccessChecker";
import { DEFAULT_MARGIN } from "../../constants/Dimension";
import { genTestId, getActiveUserID } from "../../helper/AppHelper";
import DialogHelper from "../../helper/DialogHelper";

const styles = StyleSheet.create({
    page: {
        backgroundColor: AppTheme.colors.font_color_4,
    },
    itemContainer: {
        paddingHorizontal: DEFAULT_MARGIN,
        paddingTop: 32,
    },
    itemTitle: {
        ...AppTheme.typography.card_title,
        color: AppTheme.colors.font_color1,
    },
    itemLabel: {
        ...AppTheme.typography.card_small_r,
        color: AppTheme.colors.font_color2,
        marginTop: 5,
    },
    line: {
        backgroundColor: AppTheme.colors.divider,
        height: 1,
        marginTop: 18,
    },
    touchable: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
});

function SettingItem({ title, label, enable = true, checked = false, onPress, testId }) {
    if (!enable) {
        return null;
    }

    return (
        <View style={styles.itemContainer}>
            <TouchableOpacity style={styles.touchable} onPress={onPress} testID={genTestId(testId)}>
                <View>
                    <Text style={styles.itemTitle}>{title}</Text>
                    <Text style={styles.itemLabel}>{label}</Text>
                </View>
                <SVGIcon pathList={checked ? pathList.circleChecked : pathList.circleUnchecked} />
            </TouchableOpacity>
            <View style={styles.line} />
        </View>
    );
}

export default function QuickAccessMethodsScreen() {
    const [accessType, setAccessType] = useState(0);
    const [biometricSupported, setSupported] = useState(true);
    const [authType, setAuthType] = useState("None");
    const { t } = useTranslation();

    return (
        <Page style={styles.page}>
            <CommonHeader title={t("auth.quickAccessMethods")} />
            <View>
                <SettingItem
                    title={authType}
                    label={t("auth.useQuickAuth", { authType })}
                    onPress={async () => {
                        if (accessType === 1) return;
                        const userID = await getActiveUserID();
                        const isPasswordChanged = await getPasswordChangeInd(userID);
                        if (isPasswordChanged != null && isPasswordChanged && accessType === 0) {
                            DialogHelper.showSimpleDialog({
                                title: "common.reminder",
                                message: "auth.passwordChangeCanNotChangeBiometric",
                                okText: "common.gotIt",
                            });
                        } else {
                            startBiometricAuth(
                                userID,
                                () => {
                                    saveOnboardingPageAppear(userID);
                                    setLastBiometricLoginUser(userID);
                                    setAccessType(1);
                                },
                                () => {
                                    console.log("error");
                                }
                            );
                        }
                    }}
                    checked={accessType === 1}
                    enable={biometricSupported}
                    testId="useQuickAcceessBtn"
                />
                <SettingItem
                    title={t("common.none")}
                    label={t("auth.usePassword")}
                    checked={accessType === 0}
                    onPress={async () => {
                        const userID = await getActiveUserID();
                        updateAuthInfo(false, userID);
                        setLastBiometricLoginUser(null);
                        setAccessType(0);
                    }}
                    testId="usePwdBtn"
                />
                <QuickAccessChecker
                    onChange={({ available, typeName, enable }) => {
                        setSupported(available);
                        setAuthType(typeName);
                        if (enable) {
                            setAccessType(1);
                        } else {
                            setAccessType(0);
                        }
                    }}
                />
            </View>
        </Page>
    );
}
