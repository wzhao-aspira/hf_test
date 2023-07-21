import { useState, useEffect } from "react";
import { Text, View, StyleSheet, DeviceEventEmitter, TouchableWithoutFeedback, Pressable } from "react-native";
import NetInfo from "@react-native-community/netinfo";

import * as FileSystem from "expo-file-system";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEllipsisH } from "@fortawesome/pro-regular-svg-icons";

import { Trans, useTranslation } from "react-i18next";

import { SimpleDialog, SelectDialog } from "../../components/Dialog";
import SeparateLine from "../../components/SeparateLine";
import PrimaryBtn from "../../components/PrimaryBtn";
import OutlinedBtn from "../../components/OutlinedBtn";
import AppTheme from "../../assets/_default/AppTheme";

import { getDownloadFileName } from "../../utils/GenUtil";
import { isIos, genTestId } from "../../helper/AppHelper";
import { DEFAULT_MARGIN, DEFAULT_RADIUS } from "../../constants/Dimension";
import { usefulLinksPDFPath } from "./UsefulLinksHelper";

import type { UsefulLinkData } from "../../types/usefulLink";

const ingString = "_ing";

const downloadSuccessKey = "downloadSuccess";
const downloadFailKey = "downloadFail";
const downloadCompleteKey = "downloadComplete";
const downloadProgressKey = "downloadProgress";

export const hideDropdownKey = "hideDropdownKey";

const styles = StyleSheet.create({
    container: {
        ...AppTheme.shadow,
        backgroundColor: AppTheme.colors.font_color_4,
        borderRadius: DEFAULT_RADIUS,
        padding: 20,
        marginHorizontal: DEFAULT_MARGIN,
        marginVertical: 8,
        flexDirection: "row",
    },
    title: {
        ...AppTheme.typography.card_title,
        color: AppTheme.colors.font_color_1,
    },
    topRightBtn: {
        width: 30,
        height: 20,
        marginRight: 2,
        alignItems: "flex-end",
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
    description: {
        ...AppTheme.typography.overlay_sub_text,
        marginTop: 12,
        color: AppTheme.colors.font_color_2,
    },
    bottomBtnContainer: {
        flexDirection: "row",
        marginTop: 10,
    },
});

interface UsefulLinksCellProps {
    cellData: UsefulLinkData;
    onDownloadComplete: (item: UsefulLinkData) => void;
    onDownloadError: (error) => void;
    onReviewOnlineBtnPress: (item: UsefulLinkData) => void;
    onRightOpenBtnPress: (PDFFilePath: string) => void;
    onDeleteFile: () => void;
}

function UsefulLinksCell(props: UsefulLinksCellProps) {
    const { cellData, onDownloadComplete, onDownloadError, onReviewOnlineBtnPress, onRightOpenBtnPress, onDeleteFile } =
        props;

    const PDFFileFolderPath = usefulLinksPDFPath;

    const { t } = useTranslation();

    const [PDFFilePath, setPDFFilePath] = useState<string>("");
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState<boolean>(false);
    const [wifiDialogVisible, setWifiDialogVisible] = useState<boolean>(false);
    const [noConnectDialogVisible, setNoConnectDialogVisible] = useState<boolean>(false);

    useEffect(() => {
        // componentDidMount logic here
        // check exist files
        const { url, isPDF } = cellData;

        if (isPDF) {
            const filename = getDownloadFileName(url);
            const path = PDFFileFolderPath + filename;
            FileSystem.getInfoAsync(path)
                .then((tmp) => {
                    if (tmp.exists == true) {
                        setPDFFilePath(path);
                    }
                })
                .catch(() => {});
        }

        // add listener
        const hideDropdownListener = DeviceEventEmitter.addListener(hideDropdownKey, () => {
            setShowDropdown(false);
        });

        // @ts-expect-error
        const downloadSuccessListener = DeviceEventEmitter.addListener(downloadSuccessKey, (path, item) => {
            if (item.url == cellData.url) {
                console.log("receive download success!");
                const finalPath = path.split(ingString)[0];
                console.log(`final path is: ${finalPath}`);
                const options = {
                    from: path,
                    to: finalPath,
                };
                FileSystem.moveAsync(options)
                    .then(() => {
                        console.log("rename complete!");

                        setPDFFilePath(finalPath);
                        setIsDownloading(false);

                        onDownloadComplete(item);
                    })
                    .catch(() => {
                        console.log("move PDF failed!");
                    });
            }
        });

        // @ts-expect-error
        const downloadFailListener = DeviceEventEmitter.addListener(downloadFailKey, (error, item) => {
            console.log(`download error: ${error} item url: ${item.url}`);

            setIsDownloading(false);
            onDownloadError(error);
        });

        const downloadCompleteListener = DeviceEventEmitter.addListener(downloadCompleteKey, (item) => {
            if (item.url == cellData.url) {
                console.log("receive download complete!");
            }
        });
        const downloadProgressListener = DeviceEventEmitter.addListener(downloadProgressKey, (item) => {
            if (item.url == cellData.url) {
                setIsDownloading(true);
            }
        });
        return () => {
            // componentWillUnmount logic here
            downloadSuccessListener.remove();
            downloadCompleteListener.remove();
            downloadFailListener.remove();
            downloadProgressListener.remove();
            hideDropdownListener.remove();
        };
    }, [PDFFileFolderPath, cellData, onDownloadComplete, onDownloadError]);

    const handleDeletePDFTapped = () => {
        console.log("RegulationPage item touched!");

        if (PDFFilePath) {
            setDeleteDialogVisible(true);
            setShowDropdown(false);
        }
    };

    const handleViewOnlineTapped = () => {
        setShowDropdown(false);

        NetInfo.fetch().then((state) => {
            console.log("Connection type", state.type);
            console.log("Is connected?", state.isConnected);
            if (!state.isConnected) {
                setNoConnectDialogVisible(true);
                return;
            }
            onReviewOnlineBtnPress(cellData);
        });
    };

    const toggleDropdown = (on) => {
        if (showDropdown == false && on == true) {
            setShowDropdown(true);
        }
        if (showDropdown == true && on == false) {
            setShowDropdown(false);
        }
    };

    const handleTopRightBtnTouched = () => {
        DeviceEventEmitter.emit(hideDropdownKey);
        toggleDropdown(true);
    };

    const downloadFile = () => {
        // get file name from url
        const item = { ...cellData };
        const filename = getDownloadFileName(item.url);
        const path = PDFFileFolderPath + filename + ingString; // _ing means downloading
        console.log(`local path:${path}`);

        const callback = (downloadProgress) => {
            const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
            DeviceEventEmitter.emit(downloadProgressKey, item, progress);
        };

        const downloadResumable = FileSystem.createDownloadResumable(item.url, path, {}, callback);

        FileSystem.makeDirectoryAsync(PDFFileFolderPath)
            .then(() => {
                console.log("create folder successful!");
            })
            .catch(() => {
                console.log("folder is exist!");
            })
            .finally(() => {
                (async () => {
                    try {
                        const downloadResponse = await downloadResumable.downloadAsync();

                        console.log("The response from the server: ", downloadResponse);

                        if (downloadResponse && downloadResponse.status === 200) {
                            DeviceEventEmitter.emit(downloadSuccessKey, path, item);
                        } else {
                            console.log(
                                "Incorrect status from the server, delete the temporary download file if existed"
                            );
                            const file = await FileSystem.getInfoAsync(path);
                            if (file.exists) {
                                await FileSystem.deleteAsync(path);
                            }
                            const errMsg = t("usefulLinks.downloadFailedLinkIssueMsg");
                            DeviceEventEmitter.emit(downloadFailKey, errMsg, item);
                        }
                    } catch (error) {
                        const errMsg = t("usefulLinks.downloadFailedMsg");
                        DeviceEventEmitter.emit(downloadFailKey, errMsg, item);
                    } finally {
                        DeviceEventEmitter.emit(downloadCompleteKey, item);
                    }
                })();
            });
    };

    const rightBtnPressed = (item) => {
        console.log("_downLoadBtnPressed!");
        if (!item.url) {
            throw new Error("url is blank!");
        }

        // if downloaded, open
        if (PDFFilePath) {
            onRightOpenBtnPress(PDFFilePath);
            return;
        }

        NetInfo.fetch().then((state) => {
            console.log("Connection type", state.type);
            console.log("Is connected?", state.isConnected);
            if (!state.isConnected) {
                setNoConnectDialogVisible(true);
                return;
            }
            if (state.type != "wifi") {
                setWifiDialogVisible(true);
                return;
            }

            // download
            downloadFile();

            setIsDownloading(true);
        });
    };

    const renderDropdown = () => {
        const { pdfViewOnlineEnable = true } = cellData;
        const isFileDownloaded = !!PDFFilePath;
        const onlineViewEnable = !isIos() || pdfViewOnlineEnable;

        return (
            <View
                style={{
                    zIndex: 10,
                    position: "absolute",
                    top: 20,
                    right: -45,
                    ...AppTheme.shadow,
                    width: 182,
                    backgroundColor: AppTheme.colors.font_color_4,
                    borderRadius: DEFAULT_RADIUS,
                }}
            >
                {onlineViewEnable && (
                    <View>
                        <Pressable
                            onPress={() => {
                                handleViewOnlineTapped();
                            }}
                        >
                            <View style={styles.dropdownItemContainer}>
                                <Text style={styles.dropdownItemTitle}>
                                    <Trans i18nKey="usefulLinks.viewOnline" />
                                </Text>
                            </View>
                        </Pressable>
                    </View>
                )}
                {isFileDownloaded && (
                    <View>
                        <SeparateLine />
                        <View>
                            <Pressable
                                onPress={() => {
                                    handleDeletePDFTapped();
                                }}
                            >
                                <View style={styles.dropdownItemContainer}>
                                    <Text style={styles.dropdownItemTitle}>
                                        <Trans i18nKey="usefulLinks.deleteDownloaded" />
                                    </Text>
                                </View>
                            </Pressable>
                        </View>
                    </View>
                )}
            </View>
        );
    };

    const { pdfViewOnlineEnable = true, isPDF } = cellData;

    const isFileDownloaded = !!PDFFilePath;
    const rightBtnDisplay = isPDF && (!isIos() || pdfViewOnlineEnable || isFileDownloaded);
    let downloadBtnTitle = isFileDownloaded ? t("usefulLinks.open") : t("usefulLinks.download");
    if (isDownloading) {
        downloadBtnTitle = t("usefulLinks.downloading");
    }

    const fileSize = (cellData.size / 1000000).toFixed(2);
    const fileSizeStr = ` (${fileSize} MB PDF)`;
    let titleStr = cellData.title;
    if (isPDF) {
        titleStr += fileSizeStr;
    }

    return (
        <TouchableWithoutFeedback
            onPress={() => {
                toggleDropdown(false);
                DeviceEventEmitter.emit(hideDropdownKey);
            }}
        >
            <View style={styles.container}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{titleStr}</Text>
                    <Text style={styles.description} numberOfLines={0}>
                        {cellData.description}
                    </Text>
                    <View style={styles.bottomBtnContainer}>
                        {isPDF ? (
                            <PrimaryBtn
                                testID={genTestId(`downloadButton`)}
                                label={downloadBtnTitle}
                                disabled={isDownloading}
                                onPress={() => rightBtnPressed(cellData)}
                            />
                        ) : null}
                        {!isPDF ? (
                            <OutlinedBtn
                                testID={genTestId(`viewOnlineButton`)}
                                label={t("usefulLinks.viewOnline")}
                                onPress={() => handleViewOnlineTapped()}
                            />
                        ) : null}
                    </View>
                    <SelectDialog
                        title="usefulLinks.deleteFile"
                        message="usefulLinks.deleteFileMessage"
                        visible={deleteDialogVisible}
                        okText="common.yes"
                        okAction={() => {
                            setDeleteDialogVisible(false);

                            FileSystem.deleteAsync(PDFFilePath);

                            setPDFFilePath("");
                            onDeleteFile();
                        }}
                        cancelText="common.no"
                        cancelAction={() => {
                            setDeleteDialogVisible(false);
                        }}
                    />
                    <SelectDialog
                        title="usefulLinks.downloadDocumentNoWiFi"
                        message={t("usefulLinks.downloadDocumentNoWiFiMessage", { fileSize })}
                        visible={wifiDialogVisible}
                        okText="usefulLinks.downloadNow"
                        okAction={() => {
                            setWifiDialogVisible(false);
                            setIsDownloading(true);
                            downloadFile();
                        }}
                        cancelText="common.noThanks"
                        cancelAction={() => {
                            setWifiDialogVisible(false);
                        }}
                    />
                    <SimpleDialog
                        title="usefulLinks.networkErrorTitle"
                        message="usefulLinks.networkErrorMsg"
                        visible={noConnectDialogVisible}
                        okText="common.gotIt"
                        okAction={() => {
                            setNoConnectDialogVisible(false);
                        }}
                    />
                    {showDropdown && renderDropdown()}
                </View>
                {rightBtnDisplay && (
                    <Pressable style={styles.topRightBtn} onPress={() => handleTopRightBtnTouched()}>
                        <FontAwesomeIcon icon={faEllipsisH} size={15} color={AppTheme.colors.primary_2} />
                    </Pressable>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
}

export default UsefulLinksCell;
