import { StyleSheet, View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import AppTheme from "../../../assets/_default/AppTheme";
import { DEFAULT_MARGIN } from "../../../constants/Dimension";
import { genTestId } from "../../../helper/AppHelper";

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
            </View>
        </View>
    );
}

export default AccessPermitListEmpty;
