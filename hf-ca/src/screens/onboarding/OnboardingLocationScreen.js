import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import * as Location from "expo-location";
import { useTranslation } from "react-i18next";
import AppTheme from "../../assets/_default/AppTheme";
import SplitLine from "../../components/SplitLine";
import { storeItem } from "../../helper/StorageHelper";
import { KEY_CONSTANT } from "../../constants/Constants";
import PrimaryBtn from "../../components/PrimaryBtn";
import OutlinedBtn from "../../components/OutlinedBtn";
import { getLocationImage } from "../../helper/ImgHelper";

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: AppTheme.colors.page_bg,
    },
    titleView: {
        marginHorizontal: 40,
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
        marginHorizontal: 40,
    },
});

export default function OnboardingLocationScreen(props) {
    const { onFinish } = props;
    const { t } = useTranslation();

    return (
        <View style={styles.content}>
            <View style={styles.titleView}>
                <View style={{ justifyContent: "center" }}>
                    <Text style={styles.title}>{t("onboarding.location.title")}</Text>
                    <SplitLine style={{ alignSelf: "center", backgroundColor: AppTheme.colors.font_color_1 }} />
                    <Text style={styles.subTitle}>{t("onboarding.location.subTitle")}</Text>
                </View>
            </View>

            <View style={styles.locationView}>
                <View style={styles.locationIcon}>
                    <Image
                        source={getLocationImage()}
                        style={{
                            width: 70,
                            height: 79,
                        }}
                    />
                </View>
            </View>

            <View style={styles.confirmView}>
                <PrimaryBtn
                    testID="onboardingLocationTurnOnLocationBtn"
                    label={t("onboarding.location.turnOnLocation")}
                    onPress={() => {
                        storeItem(KEY_CONSTANT.keyOnboardingLocation, { result: true });
                        Location.requestForegroundPermissionsAsync()
                            .finally(() => {
                                onFinish && onFinish();
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    }}
                />
                <OutlinedBtn
                    style={{ marginTop: 10 }}
                    testID="onboardingLocationNotNowBtn"
                    label={t("onboarding.location.notNow")}
                    onPress={() => {
                        storeItem(KEY_CONSTANT.keyOnboardingLocation, { result: true });
                        onFinish && onFinish();
                    }}
                />
            </View>
        </View>
    );
}
