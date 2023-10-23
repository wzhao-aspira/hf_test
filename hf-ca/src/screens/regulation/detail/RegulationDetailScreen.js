import { View, StyleSheet, useWindowDimensions, Text, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import RenderHtml from "react-native-render-html";
import { isEmpty } from "lodash";
import AppTheme from "../../../assets/_default/AppTheme";
import { DEFAULT_MARGIN } from "../../../constants/Dimension";
import { genTestId, openLink } from "../../../helper/AppHelper";
import CommonHeader from "../../../components/CommonHeader";
import PrimaryBtn from "../../../components/PrimaryBtn";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppTheme.colors.page_bg,
    },
    content: {
        ...AppTheme.shadow,
        marginHorizontal: 14,
        marginTop: 26,
        marginBottom: 10,
        borderRadius: 20,
        paddingBottom: 28,
        maxHeight: "100%",
        backgroundColor: AppTheme.colors.font_color_4,
    },
    title: {
        marginHorizontal: DEFAULT_MARGIN,
        minHeight: 260,
    },
    title_label: {
        ...AppTheme.typography.section_header,
        color: AppTheme.colors.font_color_2,
        marginTop: 30,
        marginBottom: 5,
    },
    additionalText: {
        ...AppTheme.typography.card_title,
        color: AppTheme.colors.font_color_2,
    },
    button: {
        marginTop: 23,
    },
});

export default function RegulationDetailScreen(props) {
    const { t } = useTranslation();
    const { width } = useWindowDimensions();
    const { route } = props;
    const { regulation } = route.params;
    const { regulationTitle, regulationDetail, regulationSize, fileFormat, regulationUrl } = regulation;

    return (
        <View style={styles.container}>
            <CommonHeader title={t("regulation.detailTitle")} />

            <ScrollView>
                <View style={styles.content}>
                    <View style={styles.title}>
                        <Text testID={genTestId("regulationTitle")} style={styles.title_label}>
                            {regulationTitle}
                        </Text>
                        {!isEmpty(regulationDetail) && (
                            <RenderHtml
                                testID={genTestId("regulationDetails")}
                                source={{
                                    html: regulationDetail,
                                }}
                                contentWidth={width}
                            />
                        )}
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "center" }}>
                        <Text style={styles.additionalText}>
                            Format: {isEmpty(fileFormat) ? "N/A" : fileFormat.toUpperCase()}
                        </Text>
                        <Text style={[styles.additionalText, { marginLeft: 20 }]}>
                            Size: {regulationSize || "N/A"}KB
                        </Text>
                    </View>
                    <View style={{ marginHorizontal: DEFAULT_MARGIN, marginTop: 10 }}>
                        <PrimaryBtn
                            style={styles.button}
                            testID="downloadBtn"
                            label={t("regulation.download")}
                            onPress={() => {}}
                        />
                        {!isEmpty(regulationUrl) && (
                            <PrimaryBtn
                                style={styles.button}
                                testID="viewFromWebBtn"
                                label={t("regulation.viewFromWeb")}
                                onPress={() => {
                                    if (!isEmpty(regulationUrl)) {
                                        openLink(regulationUrl);
                                    }
                                }}
                            />
                        )}
                        <PrimaryBtn
                            style={styles.button}
                            testID="viewFromDownloadBtn"
                            label={t("regulation.viewFromDownload")}
                            onPress={() => {}}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
