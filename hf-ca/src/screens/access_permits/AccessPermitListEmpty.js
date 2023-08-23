import { StyleSheet, View, Text, Pressable } from "react-native";
import { Trans, useTranslation } from "react-i18next";
import AppTheme from "../../assets/_default/AppTheme";
import { DEFAULT_MARGIN } from "../../constants/Dimension";
import { genTestId, showNotImplementedFeature } from "../../helper/AppHelper";

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

function AccessPermitListEmpty() {
    const { t } = useTranslation();
    const defaultTitle = t("accessPermits.noAccessPermits");

    return (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyArea}>
                <Text testID={genTestId("noAccessPermits")} style={styles.emptyTitle}>
                    {defaultTitle}
                </Text>
                <Pressable
                    style={styles.emptyButton}
                    testID={genTestId("purchaseAccessPermitButton")}
                    onPress={() => {
                        showNotImplementedFeature();
                    }}
                >
                    <Text testID={genTestId("purchaseAccessPermit")} style={styles.emptyButtonTitle}>
                        <Trans i18nKey="accessPermits.purchaseAccessPermit" />
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

export default AccessPermitListEmpty;
