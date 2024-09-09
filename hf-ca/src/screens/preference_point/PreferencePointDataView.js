import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppTheme from "../../assets/_default/AppTheme";
import { DEFAULT_MARGIN, SCREEN_HEIGHT } from "../../constants/Dimension";
import { genTestId } from "../../helper/AppHelper";

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 20,
        paddingLeft: 20,
    },
    cell: {
        flex: 1,
    },
    text: {
        ...AppTheme.typography.overlay_sub_text,
        color: AppTheme.colors.font_color_1,
        paddingRight: 20,
    },
    headerText: {
        ...AppTheme.typography.card_title,
    },
    bottomLine: {
        margin: StyleSheet.hairlineWidth,
        height: StyleSheet.hairlineWidth,
        backgroundColor: AppTheme.colors.divider,
    },
    tableContainer: {
        ...AppTheme.shadow,
        marginHorizontal: 14,
        marginBottom: 10,
        borderRadius: 20,
        paddingBottom: 30,
        maxHeight: "100%",
        backgroundColor: AppTheme.colors.font_color_4,
    },
});

function ItemRow({ rowData = [], textStyles = {}, testIds, rowId }) {
    return (
        <View style={{ flexDirection: "column" }}>
            <View style={styles.rowContainer}>
                {rowData.map((item, index) => (
                    <View style={styles.cell} key={item}>
                        <Text
                            style={[styles.text, textStyles]}
                            testID={testIds && testIds[index] ? genTestId(testIds[index], rowId) : undefined}
                        >
                            {item}{" "}
                        </Text>
                    </View>
                ))}
            </View>

            <View style={styles.bottomLine} />
        </View>
    );
}

function PreferencePointDataView({ data = [] }) {
    const { t } = useTranslation();
    const inset = useSafeAreaInsets();

    const headers = [
        t("preferencePoint.drawType"),
        t("preferencePoint.currentPoint"),
        t("preferencePoint.lastYearApplied"),
    ];

    return (
        <View style={{ maxHeight: SCREEN_HEIGHT - DEFAULT_MARGIN * 4 - inset.top * 2 }}>
            <View style={styles.tableContainer}>
                <ItemRow rowData={headers} textStyles={styles.headerText} />

                <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
                    {data.map((item = {}) => (
                        <ItemRow
                            key={`${item.huntTypeName}_${item.lastParticipationLicenseYear}`}
                            rowData={[
                                item.huntTypeName,
                                item.currentPreferencePoints,
                                item.lastParticipationLicenseYear,
                            ]}
                            testIds={[
                                `preferencePointDrawType`,
                                `preferencePointCurrentPoints`,
                                `preferencePointLastYearApplied`,
                            ]}
                            rowId={item.pk}
                        />
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}

export default PreferencePointDataView;
