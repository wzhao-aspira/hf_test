import { useState } from "react";
import { View, Text, StyleSheet, Pressable, TouchableWithoutFeedback } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEllipsisH } from "@fortawesome/pro-regular-svg-icons/faEllipsisH";
import { useTranslation, Trans } from "react-i18next";

import AppTheme from "../../assets/_default/AppTheme";
import { DEFAULT_MARGIN, DEFAULT_RADIUS } from "../../constants/Dimension";

import PrimaryBtn from "../PrimaryBtn";

import { genTestId } from "../../helper/AppHelper";
import DialogHelper from "../../helper/DialogHelper";

import type { FileInfo } from "../../types/notificationAndAttachment";

import useFileOperations from "./hooks/useFileOperations";

const styles = StyleSheet.create({
    licenseInfo: {
        flexDirection: "row",
        marginHorizontal: DEFAULT_MARGIN,
        alignItems: "flex-start",
        marginTop: 10,
    },
    sectionContainer: {
        marginTop: 26,
        marginHorizontal: DEFAULT_MARGIN,
        ...AppTheme.shadow,
        backgroundColor: AppTheme.colors.font_color_4,
        paddingBottom: 10,
        borderRadius: 14,
    },
    sectionTitle: {
        ...AppTheme.typography.section_header,
        color: AppTheme.colors.font_color_1,
        textAlignVertical: "center",
        marginHorizontal: DEFAULT_MARGIN,
        marginTop: 26,
        marginBottom: 10,
    },
    topRightBtn: {
        width: 30,
        height: 20,
        marginRight: 2,
        position: "absolute",
        right: 10,
        top: 25,
    },
    dropdownItemContainer: {
        height: 65,
        width: "100%",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    dropdownItemTitle: {
        ...AppTheme.typography.card_title,
    },
});

interface FileProps {
    fileInfo: FileInfo;
    folderName: string;
    cardMarginHorizontal?: number;
}

function File(props: FileProps) {
    const { fileInfo, folderName, cardMarginHorizontal } = props;
    const { id, type, name, title, description, available, downloadId } = fileInfo;

    const { t } = useTranslation();
    const { downloadFile, openFile, deleteFile, status } = useFileOperations({
        fileID: id,
        fileType: type,
        fileName: name,
        folderName,
        downloadID: downloadId,
    });

    const [shouldShowDropdown, setShouldShowDropdown] = useState(false);

    const isNotDownloaded = status === "not downloaded yet";
    const isDownloading = status === "downloading";
    const isDownloaded = status === "downloaded";
    const shouldShowDropdownToggleButton = isDownloaded;
    const shouldShowFile = available || isDownloaded;

    if (!shouldShowFile) return null;

    const Dropdown = (
        <View
            style={{
                zIndex: 10,
                position: "absolute",
                top: 20,
                right: 10,
                ...AppTheme.shadow,
                width: 182,
                backgroundColor: AppTheme.colors.font_color_4,
                borderRadius: DEFAULT_RADIUS,
            }}
        >
            {isDownloaded && (
                <View>
                    <View>
                        <Pressable
                            onPress={() => {
                                DialogHelper.showSelectDialog({
                                    title: "notificationAndAttachment.deleteFile",
                                    message: "notificationAndAttachment.deleteFileMessage",
                                    okText: "common.yes",
                                    okAction: () => {
                                        deleteFile();
                                        setShouldShowDropdown(false);
                                    },
                                    cancelText: "common.no",
                                    cancelAction: () => {
                                        setShouldShowDropdown(false);
                                    },
                                });
                            }}
                        >
                            <View style={styles.dropdownItemContainer}>
                                <Text style={styles.dropdownItemTitle}>
                                    <Trans i18nKey="notificationAndAttachment.deleteDownloaded" />
                                </Text>
                            </View>
                        </Pressable>
                    </View>
                </View>
            )}
        </View>
    );

    return (
        <TouchableWithoutFeedback
            accessible={false}
            onPress={() => {
                setShouldShowDropdown(false);
            }}
        >
            <View
                style={[styles.sectionContainer, !!cardMarginHorizontal && { marginHorizontal: cardMarginHorizontal }]}
            >
                <Text style={[styles.sectionTitle]} testID={genTestId(`notificationOrAttachmentFileName${title}`)}>
                    {title}
                </Text>
                {!!description && (
                    <View style={styles.licenseInfo}>
                        <Text
                            testID={genTestId(`notificationOrAttachmentFileName${title}Description`)}
                            style={{ marginTop: -10, marginBottom: 13 }}
                        >
                            {description}
                        </Text>
                    </View>
                )}
                <View style={{ marginHorizontal: DEFAULT_MARGIN, marginBottom: 16, flexDirection: "row" }}>
                    {isNotDownloaded && available && (
                        <PrimaryBtn
                            testID={genTestId(`notificationOrAttachmentFileName${title}ActionButton`)}
                            label={t("notificationAndAttachment.Download")}
                            onPress={() => {
                                downloadFile();
                            }}
                        />
                    )}
                    {isDownloading && (
                        <PrimaryBtn
                            testID={genTestId(`notificationOrAttachmentFileName${title}ActionButton`)}
                            label={t("notificationAndAttachment.Downloading")}
                            disabled
                            onPress={() => {
                                console.log(`downloading ${title}`);
                            }}
                        />
                    )}
                    {isDownloaded && (
                        <PrimaryBtn
                            testID={genTestId(`notificationOrAttachmentFileName${title}ActionButton`)}
                            label={t("notificationAndAttachment.Open")}
                            onPress={() => {
                                openFile();
                            }}
                        />
                    )}
                </View>
                {shouldShowDropdown && Dropdown}
                {shouldShowDropdownToggleButton && (
                    <Pressable
                        accessibilityLabel="dropdown toggle button"
                        style={styles.topRightBtn}
                        onPress={() => setShouldShowDropdown(true)}
                    >
                        <FontAwesomeIcon icon={faEllipsisH} size={15} color={AppTheme.colors.primary_2} />
                    </Pressable>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
}

interface FileListProps {
    folderName: string;
    fileInfoList: [FileInfo, FileInfo];
    cardMarginHorizontal?: number;
}

function NotificationAndAttachment(props: FileListProps) {
    const { folderName, fileInfoList, cardMarginHorizontal } = props;

    const [notification, attachment] = fileInfoList;

    console.log(fileInfoList);

    return (
        <>
            {notification && (
                <File folderName={folderName} fileInfo={notification} cardMarginHorizontal={cardMarginHorizontal} />
            )}
            {attachment && (
                <File folderName={folderName} fileInfo={attachment} cardMarginHorizontal={cardMarginHorizontal} />
            )}
        </>
    );
}

export default NotificationAndAttachment;
