import React, { useEffect } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import AppTheme from "../../assets/_default/AppTheme";
import SplitLine from "../../components/SplitLine";

import PrimaryBtn from "../../components/PrimaryBtn";
import OutlinedBtn from "../../components/OutlinedBtn";

import { genTestId } from "../../helper/AppHelper";
import { startBiometricAuth, setLastBiometricLoginUser, getAuthType } from "../../helper/LocalAuthHelper";
import i18n from "../../localization/i18n";

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    titleView: {
        marginHorizontal: 35,
        marginTop: 50,
    },
    title: {
        ...AppTheme.typography.primary_heading,
        color: AppTheme.colors.font_color_1,
        marginBottom: 10,
        textAlign: "center",
    },
    subTitle: {
        ...AppTheme.typography.sub_text,
        color: AppTheme.colors.font_color_2,
        marginTop: 12,
        marginBottom: 10,
        textAlign: "center",
    },
    locationView: {
        justifyContent: "center",
        flex: 1,
    },
    locationIcon: {
        backgroundColor: AppTheme.colors.font_color_4,
        width: 226,
        height: 226,
        borderRadius: 113,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },
    confirmView: {
        marginTop: 10,
        marginBottom: 20,
        marginHorizontal: 35,
    },
});

const biometricImage = require("../../assets/_default/images/biometric_id.png");

export default function OnboardingBiometricIDScreen(props) {
    const { onFinish, userName } = props;
    const [authType, setTypeName] = React.useState("");

    const defaultSubTitle = i18n.t("auth.permissionDescription", {
        authType,
    });
    const useAuthStr = `${i18n.t("auth.use")} ${authType}`;

    const { t } = useTranslation();
    const safeArea = useSafeAreaInsets();

    useEffect(() => {
        const action = async () => {
            const type = await getAuthType();
            setTypeName(type);
        };
        action();
    }, []);

    return (
        <View style={styles.content}>
            <View style={styles.titleView}>
                <View style={{ justifyContent: "center" }}>
                    <Text style={styles.title}>{useAuthStr}</Text>
                    <SplitLine style={{ alignSelf: "center", backgroundColor: AppTheme.colors.font_color_1 }} />

                    <Text style={styles.subTitle}>{defaultSubTitle}</Text>
                </View>
            </View>

            <View style={styles.locationView}>
                <View style={styles.locationIcon}>
                    <Image
                        source={biometricImage}
                        style={{
                            width: 80,
                            height: 80,
                        }}
                    />
                </View>
            </View>

            <View style={{ ...styles.confirmView, marginBottom: safeArea.bottom + 20 }}>
                <PrimaryBtn
                    testID={genTestId("useBiometricBtn")}
                    label={useAuthStr}
                    onPress={() => {
                        startBiometricAuth(userName, () => {
                            onFinish?.(true);
                        });
                    }}
                />
                <OutlinedBtn
                    style={{ marginTop: 10 }}
                    testID={genTestId("notNowBtn")}
                    label={t("onboarding.location.notNow")}
                    onPress={() => {
                        console.log("clear biometric login info");
                        setLastBiometricLoginUser(null);
                        onFinish?.(false);
                    }}
                />
            </View>
        </View>
    );
}
