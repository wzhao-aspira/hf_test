import { View, StyleSheet, Text, Image } from "react-native";
import { Trans, useTranslation } from "react-i18next";
import AppTheme from "../../assets/_default/AppTheme";
import SplitLine from "../../components/SplitLine";
import { storeItem } from "../../helper/StorageHelper";
import { KEY_CONSTANT } from "../../constants/Constants";
import PrimaryBtn from "../../components/PrimaryBtn";
import OutlinedBtn from "../../components/OutlinedBtn";
import { getNotificationImage } from "../../helper/ImgHelper";
import notifee from "@notifee/react-native";

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
    notificationView: {
        justifyContent: "center",
        flex: 1,
    },
    notificationIcon: {
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

export default function OnboardingNotificationScreen(props) {
    const { onFinish } = props;
    const { t } = useTranslation();

    return (
        <View style={styles.content}>
            <View style={styles.titleView}>
                <View style={{ justifyContent: "center" }}>
                    <Text style={styles.title}>
                        <Trans i18nKey="onboarding.notification.title" />
                    </Text>
                    <SplitLine style={{ alignSelf: "center", backgroundColor: AppTheme.colors.font_color_1 }} />
                    <Text style={styles.subTitle}>
                        <Trans i18nKey="onboarding.notification.subTitle" />
                    </Text>
                </View>
            </View>

            <View style={styles.notificationView}>
                <View style={styles.notificationIcon}>
                    <Image
                        source={getNotificationImage()}
                        style={{
                            width: 80,
                            height: 80,
                        }}
                    />
                </View>
            </View>

            <View style={styles.confirmView}>
                <PrimaryBtn
                    testID="onboardingNotificationTurnOnNotificationBtn"
                    label={t("onboarding.notification.turnOnNotification")}
                    onPress={() => {
                        storeItem(KEY_CONSTANT.keyOnboardingNotificationPermission, 1);
                        notifee
                            .requestPermission()
                            .finally(() => {
                                if (onFinish) {
                                    onFinish();
                                }
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                    }}
                />
                <OutlinedBtn
                    style={{ marginTop: 10 }}
                    testID="onboardingNotificationNotNowBtn"
                    label={t("onboarding.notification.notNow")}
                    onPress={() => {
                        storeItem(KEY_CONSTANT.keyOnboardingNotificationPermission, 1);
                        if (onFinish) {
                            onFinish();
                        }
                    }}
                />
            </View>
        </View>
    );
}
