import { View, StyleSheet, useWindowDimensions, Text, ScrollView, Pressable } from "react-native";
import { useTranslation, Trans } from "react-i18next";
import { isEmpty } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTrash } from "@fortawesome/pro-solid-svg-icons/faTrash";

import AppTheme from "../../../assets/_default/AppTheme";
import { DEFAULT_MARGIN } from "../../../constants/Dimension";
import { genTestId, openLink, isIos } from "../../../helper/AppHelper";
import DialogHelper from "../../../helper/DialogHelper";
import CommonHeader from "../../../components/CommonHeader";
import RenderHTML from "../../../components/RenderHTML";
import PrimaryBtn from "../../../components/PrimaryBtn";

import useFileOperations from "./hooks/useFileOperations";

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
        backgroundColor: AppTheme.colors.font_color_4,
    },
    title: {
        marginHorizontal: DEFAULT_MARGIN,
        minHeight: 260,
        marginBottom: 10,
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

export const folderName = "regulation_files";

export default function RegulationDetailScreen(props) {
    const { t } = useTranslation();
    const { width } = useWindowDimensions();
    const { route } = props;
    const { regulation } = route.params;
    const { regulationTitle, regulationDetail, regulationSize, fileFormat, regulationUrl } = regulation;

    const { downloadFile, openFile, status, deleteFile } = useFileOperations({
        downloadURL: regulationUrl,
        folderName,
    });
    const isNotDownloaded = status === "not downloaded yet";
    const isDownloading = status === "downloading";
    const isDownloaded = status === "downloaded";

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
                            <RenderHTML
                                testID={genTestId("regulationDetails")}
                                source={{
                                    html: regulationDetail,
                                }}
                                contentWidth={width}
                            />
                        )}
                    </View>
                    <View style={{ flexDirection: "row", marginHorizontal: DEFAULT_MARGIN }}>
                        <Text style={styles.additionalText}>
                            Format: {isEmpty(fileFormat) ? "N/A" : fileFormat.toUpperCase()}
                        </Text>
                        <Text style={[styles.additionalText, { marginLeft: 20 }]}>
                            Size: {regulationSize ? (regulationSize / 1024).toFixed(2) : "N/A"}MB
                        </Text>
                    </View>
                    <View style={{ marginHorizontal: DEFAULT_MARGIN, marginTop: 10 }}>
                        {!isEmpty(regulationUrl) && (
                            <>
                                {isDownloaded && (
                                    <Pressable
                                        testID={genTestId("delete button")}
                                        accessibilityLabel={t("regulation.clearDocument")}
                                        onPress={() => {
                                            DialogHelper.showSelectDialog({
                                                title: t("regulation.Reminder"),
                                                message: t("regulation.ClearExistingDocumentReminderMessage"),
                                                okAction: deleteFile,
                                            });
                                        }}
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignContent: "center",
                                            gap: 5,
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faTrash} size={22} />
                                        <Text
                                            style={{
                                                ...AppTheme.typography.hyperLink,
                                                lineHeight: 20,
                                                color: AppTheme.colors.font_color_2,
                                            }}
                                        >
                                            <Trans i18nKey="regulation.clearDocument" />
                                        </Text>
                                    </Pressable>
                                )}
                                {(isNotDownloaded || isDownloaded) && (
                                    <PrimaryBtn
                                        style={styles.button}
                                        testID="downloadBtn"
                                        label={t("regulation.download")}
                                        onPress={() => {
                                            if (isNotDownloaded) downloadFile();
                                            if (isDownloaded)
                                                DialogHelper.showSelectDialog({
                                                    title: t("regulation.Reminder"),
                                                    message: t("regulation.ReminderMessage"),
                                                    okAction: downloadFile,
                                                });
                                        }}
                                    />
                                )}
                                {isDownloading && (
                                    <PrimaryBtn
                                        style={styles.button}
                                        testID="downloadingBtn"
                                        label={t("regulation.downloading")}
                                        onPress={() => {}}
                                        disabled
                                    />
                                )}
                                {isDownloaded && (
                                    <PrimaryBtn
                                        style={styles.button}
                                        testID="viewFromDownloadBtn"
                                        label={t("regulation.viewFromDownload")}
                                        onPress={openFile}
                                    />
                                )}
                                {isIos() && (
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
                            </>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
