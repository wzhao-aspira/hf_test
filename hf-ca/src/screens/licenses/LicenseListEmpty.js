import { StyleSheet, View, Text, Pressable } from "react-native";
import { Trans, useTranslation } from "react-i18next";
import AppTheme from "../../assets/_default/AppTheme";
import useNavigateToISPurchaseLicense from "./hooks/useNavigateToISPurchaseLicense";

import { DEFAULT_MARGIN } from "../../constants/Dimension";
import { genTestId } from "../../helper/AppHelper";

export const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        marginHorizontal: DEFAULT_MARGIN,
        justifyContent: "center",
    },
    emptyArea: {
        marginTop: -100,
        width: "100%",
    },
    emptyTitle: {
        ...AppTheme.typography.section_header,
        color: AppTheme.colors.font_color_1,
        textAlign: "center",
    },
    emptyDescription: {
        marginTop: 8,
        ...AppTheme.typography.card_small_r,
        color: AppTheme.colors.font_color_2,
        textAlign: "center",
    },
    emptyButton: {
        marginTop: 22,
        backgroundColor: AppTheme.colors.primary_2,
        width: "100%",
        height: 52,
        borderRadius: 5,
        justifyContent: "center",
    },
    emptyButtonTitle: {
        ...AppTheme.typography.card_title,
        color: AppTheme.colors.font_color_4,
        textAlign: "center",
    },
});

function LicenseListEmpty({ title, subtitle, showPurchase = true }) {
    const { t } = useTranslation();
    const { navigateToIS } = useNavigateToISPurchaseLicense();

    const defaultTitle = t("license.noLicenseTitle");
    const defaultSubTitle = t("license.noLicenseIntroduction");

    return (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyArea}>
                <Text testID={genTestId("noLicenses")} style={styles.emptyTitle}>
                    {title || defaultTitle}
                </Text>
                {showPurchase && (
                    <>
                        <Text testID={genTestId("licIntroduction")} style={styles.emptyDescription}>
                            {subtitle || defaultSubTitle}
                        </Text>
                        <Pressable
                            style={styles.emptyButton}
                            testID={genTestId("purchaseLicenseButton")}
                            onPress={() => {
                                navigateToIS();
                            }}
                        >
                            <Text testID={genTestId("purchaseLicense")} style={styles.emptyButtonTitle}>
                                <Trans i18nKey="license.purchaseLicense" />
                            </Text>
                        </Pressable>
                    </>
                )}
            </View>
        </View>
    );
}

export default LicenseListEmpty;
