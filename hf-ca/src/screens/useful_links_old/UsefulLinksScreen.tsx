import { useState, useEffect, useCallback } from "react";
import { FlatList, StyleSheet, DeviceEventEmitter, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import * as IntentLauncher from "expo-intent-launcher";
import * as FileSystem from "expo-file-system";
import * as WebBrowser from "expo-web-browser";

import { isEmpty } from "lodash";

import { useTranslation } from "react-i18next";

import Page from "../../components/Page";
import CommonHeader from "../../components/CommonHeader";
import UsefulLinksCell, { hideDropdownKey } from "./UsefulLinksCell";
import { SimpleDialog } from "../../components/Dialog";

import { DEFAULT_MARGIN, PAGE_MARGIN_BOTTOM } from "../../constants/Dimension";
import { getDownloadedCountAsync, usefulLinksPDFPath, checkIfNewVersionAdded } from "./UsefulLinksHelper";
import { isAndroid } from "../../helper/AppHelper";
import AppTheme from "../../assets/_default/AppTheme";
import Routers from "../../constants/Routers";
import type { AppNativeStackScreenProps } from "../../constants/Routers";

import usefulLinksService from "../../services/UsefulLinksService";

import type { UsefulLinkData } from "../../types/usefulLink";

const styles = StyleSheet.create({
    container: {
        paddingBottom: 0,
        backgroundColor: AppTheme.colors.page_bg,
    },
    titleLabel: {
        ...AppTheme.typography.section_header,
        marginTop: DEFAULT_MARGIN,
        marginLeft: DEFAULT_MARGIN,
        marginBottom: 10,
    },
});

interface UsefulLinksScreenProps extends AppNativeStackScreenProps<"webViewScreen"> {}

function UsefulLinksScreen(props: UsefulLinksScreenProps) {
    const { navigation } = props;

    const { t } = useTranslation();

    const safeAreaInsets = useSafeAreaInsets();

    const [downloadedNumber, setDownloadedNumber] = useState(null);
    const [errorDialogVisible, setErrorDialogVisible] = useState(false);
    const [documentUpdatedDialogVisible, setDocumentUpdatedDialogVisible] = useState(false);
    const [downloadErrMsg, setDownloadErrMsg] = useState("");
    const [DATA, setDATA] = useState<UsefulLinkData[]>([]);

    const getDownloadedCount = useCallback(async () => {
        const filePath = usefulLinksPDFPath;
        const data = await usefulLinksService.getUsefulLinksData();

        getDownloadedCountAsync(filePath, data).then((count) => {
            console.log({ count });
            setDownloadedNumber(count);
        });
    }, []);

    useEffect(() => {
        const focusListener = navigation.addListener("focus", () => {
            (async () => {
                getDownloadedCount();
                try {
                    checkIfNewVersionAdded((result) => {
                        if (!isEmpty(result)) {
                            console.log({ result });

                            setDocumentUpdatedDialogVisible(true);
                        }
                    });
                } catch (error) {
                    // handle error here
                    console.log(error);
                }
            })();
        });

        usefulLinksService.getUsefulLinksData().then((data) => {
            setDATA(data);
        });

        return () => {
            navigation.removeListener("focus", focusListener);
        };
    }, [getDownloadedCount, navigation]);

    const onCellViewOnlineBtnPress = (item) => {
        if (!item?.url) {
            return;
        }

        const itemUrl = item.url;

        WebBrowser.openBrowserAsync(itemUrl).catch((error) => {
            // handle error
            console.log(error);
        });
    };

    const onCellRightOpenBtnPress = (filePath: string) => {
        if (!filePath) {
            return;
        }

        if (isAndroid()) {
            FileSystem.getContentUriAsync(filePath).then((cUri) => {
                console.log(cUri);
                IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
                    data: cUri,
                    // https://developer.android.com/reference/android/content/Intent#FLAG_GRANT_READ_URI_PERMISSION
                    // flag 1: FLAG_GRANT_READ_URI_PERMISSION
                    flags: 1,
                }).catch((error) => {
                    console.log(`startActivityAsync error:${error}`);
                });
            });
        } else {
            navigation.navigate(Routers.webView, {
                url: filePath,
                title: t("usefulLinks.usefulLinks"),
            });
        }
    };

    function onDownloadError(error) {
        console.log(error);

        setDownloadErrMsg(error);
        setErrorDialogVisible(true);
    }

    function onDeleteFile() {
        getDownloadedCount();
    }

    function onDownloadComplete() {
        getDownloadedCount();
    }

    const hasPdf = (usefulLinksDataArray: UsefulLinkData[]) => {
        let result = false;

        if (usefulLinksDataArray?.length <= 0) {
            return result;
        }

        usefulLinksDataArray.forEach((usefulLinkData) => {
            if (usefulLinkData?.isPDF) {
                result = true;
            }
        });

        return result;
    };

    const renderItem = ({ item }: { item: UsefulLinkData }) => {
        return (
            <UsefulLinksCell
                onReviewOnlineBtnPress={(theItem) => {
                    onCellViewOnlineBtnPress(theItem);
                }}
                onRightOpenBtnPress={(filePath) => {
                    onCellRightOpenBtnPress(filePath);
                }}
                onDownloadError={(error) => {
                    onDownloadError(error);
                }}
                onDeleteFile={() => {
                    onDeleteFile();
                }}
                onDownloadComplete={() => {
                    onDownloadComplete();
                }}
                cellData={item}
            />
        );
    };

    const downloadStr =
        downloadedNumber >= 0 && hasPdf(DATA) ? t("usefulLinks.downloadedNumber", { number: downloadedNumber }) : "";
    const titleStr = t("usefulLinks.usefulLinks");

    return (
        <Page style={styles.container}>
            <CommonHeader title={titleStr} />
            <FlatList
                onScrollBeginDrag={() => {
                    DeviceEventEmitter.emit(hideDropdownKey);
                }}
                ListHeaderComponent={
                    <Text style={styles.titleLabel}>{`${DATA.length} ${titleStr} ${downloadStr}`}</Text>
                }
                data={DATA}
                renderItem={renderItem}
                keyExtractor={(item) => `${item.description}${item.url}`}
                contentContainerStyle={{ paddingBottom: safeAreaInsets.bottom + PAGE_MARGIN_BOTTOM }}
            />
            <SimpleDialog
                title="usefulLinks.downloadFailed"
                message={downloadErrMsg}
                visible={errorDialogVisible}
                okText="common.gotIt"
                okAction={() => {
                    setErrorDialogVisible(false);
                }}
            />
            <SimpleDialog
                title="usefulLinks.documentUpdated"
                message="usefulLinks.documentUpdatedMessage"
                visible={documentUpdatedDialogVisible}
                okText="common.ok"
                okAction={() => {
                    setDocumentUpdatedDialogVisible(false);
                }}
            />
        </Page>
    );
}

export default UsefulLinksScreen;
