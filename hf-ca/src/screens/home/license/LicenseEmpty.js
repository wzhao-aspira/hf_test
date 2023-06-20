import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Trans, useTranslation } from "react-i18next";
import PrimaryBtn from "../../../components/PrimaryBtn";
import AppTheme from "../../../assets/_default/AppTheme";
import { DEFAULT_MARGIN, DEFAULT_RADIUS } from "../../../constants/Dimension";
import { genTestId } from "../../../helper/AppHelper";

const styles = StyleSheet.create({
    card: {
        ...AppTheme.shadow,
        backgroundColor: AppTheme.colors.font_color_4,
        height: 160,
        borderRadius: DEFAULT_RADIUS,
        padding: 20,
        marginTop: 3,
        marginBottom: 15,
    },
    noLicenseContainer: {
        marginHorizontal: DEFAULT_MARGIN,
        backgroundColor: AppTheme.colors.page_bg,
        borderStyle: "dashed",
        borderColor: AppTheme.colors.primary_2,
        borderWidth: 1,
        shadowColor: AppTheme.colors.shadow,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
        alignItems: "center",
        justifyContent: "space-between",
    },
    noLicenseTitle: {
        ...AppTheme.typography.card_title,
        color: AppTheme.colors.font_color_1,
        alignSelf: "center",
        textAlign: "center",
    },
    noLicenseIntro: {
        marginTop: 5,
        ...AppTheme.typography.card_small_r,
        color: AppTheme.colors.font_color_2,
        textAlign: "center",
        alignSelf: "center",
    },
});

const HomeLicenseSection = () => {
    const { t } = useTranslation();
    return (
        <View style={[styles.card, styles.noLicenseContainer]}>
            <View>
                <Text testID={genTestId("noLicenseTitle")} style={styles.noLicenseTitle}>
                    <Trans i18nKey="license.noLicenseTitle" />
                </Text>
                <Text testID={genTestId("noLicenseIntroduction")} style={styles.noLicenseIntro}>
                    <Trans i18nKey="license.noLicenseIntroduction" />
                </Text>
            </View>
            <PrimaryBtn
                testID={genTestId("purchaseOnline")}
                style={{ margin: 20 }}
                onPress={() => console.log("PurchaseOnline")}
                label={t("license.purchaseLicense")}
            />
        </View>
    );
};

export default HomeLicenseSection;
