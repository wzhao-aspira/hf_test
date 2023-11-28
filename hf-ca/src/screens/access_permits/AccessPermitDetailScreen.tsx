import { View, Text, StyleSheet, ScrollView } from "react-native";
import Barcode from "@kichiyaki/react-native-barcode-generator";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppNativeStackScreenProps } from "../../constants/Routers";
import { genTestId } from "../../helper/AppHelper";

import AppTheme from "../../assets/_default/AppTheme";
import { DEFAULT_MARGIN, PAGE_MARGIN_BOTTOM, SCREEN_WIDTH } from "../../constants/Dimension";

import Page from "../../components/Page";
import CommonHeader from "../../components/CommonHeader";
import NotificationAndAttachment from "../../components/notificationAndAttachment/NotificationAndAttachment";
import useTitle from "../../hooks/useTitle";

const styles = StyleSheet.create({
    container: {
        paddingBottom: 0,
    },
    scrollView: {
        width: "100%",
        height: "100%",
    },
    content: {
        marginTop: 26,
        marginHorizontal: DEFAULT_MARGIN,
        ...AppTheme.shadow,
        backgroundColor: AppTheme.colors.font_color_4,
        paddingTop: 20,
        paddingBottom: 10,
        borderRadius: 14,
    },
    title: {
        ...AppTheme.typography.section_header,
        color: AppTheme.colors.font_color_1,
        textAlign: "center",
        textAlignVertical: "center",
    },
    titleContainer: {
        paddingVertical: 10,
    },
    licenseInfo: {
        flexDirection: "row",
        marginHorizontal: DEFAULT_MARGIN,
        alignItems: "flex-start",
        marginTop: 10,
    },
    labelText: {
        ...AppTheme.typography.card_small_r,
        color: AppTheme.colors.font_color_2,
    },
    valueText: {
        ...AppTheme.typography.card_title,
        color: AppTheme.colors.font_color_1,
        textAlignVertical: "center",
    },
});

interface AccessPermitDetailScreenProps extends AppNativeStackScreenProps<"accessPermitDetail"> {
    //
}

export const folderName = "access_permit_files";

function AccessPermitDetailScreen(props: AccessPermitDetailScreenProps) {
    const { route } = props;
    const { document } = route.params;

    const { t } = useTranslation();
    const safeAreaInsets = useSafeAreaInsets();
    const headerTitleComponent = useTitle("accessPermits.PermitDetails", "accessPermits.PermitDetails");

    const {
        title,
        barcode,
        huntDate,
        huntName,
        reservationNumber,
        name,
        address,
        fileInfoList,
        isGeneratedDraw,
        huntCode,
        huntRange,
        isDisplayReservation,
    } = document;

    const accessPermitDocumentBasicInformation = isGeneratedDraw
        ? [
              { label: t("accessPermits.HuntDate"), content: huntDate },
              { label: t("accessPermits.HuntName"), content: huntName },
              isDisplayReservation && { label: t("accessPermits.Reservation#"), content: reservationNumber },
              { label: t("accessPermits.Name"), content: name },
              { label: t("accessPermits.Address"), content: address },
          ]
        : [
              { label: t("accessPermits.HuntRange"), content: huntRange },
              { label: t("accessPermits.HuntName"), content: huntName },
              { label: t("accessPermits.huntCode"), content: huntCode },
              { label: t("accessPermits.Name"), content: name },
              { label: t("accessPermits.Address"), content: address },
          ];

    return (
        <Page style={styles.container}>
            <CommonHeader titleComponent={headerTitleComponent} />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={{ paddingBottom: safeAreaInsets.bottom + PAGE_MARGIN_BOTTOM }}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    <View style={{ alignItems: "center" }}>
                        <View style={styles.titleContainer}>
                            <Text
                                testID={genTestId(`permitInfoTitle`)}
                                numberOfLines={0}
                                style={[
                                    styles.title,
                                    {
                                        width: SCREEN_WIDTH - 2 * DEFAULT_MARGIN,
                                        paddingHorizontal: DEFAULT_MARGIN,
                                    },
                                ]}
                            >
                                {title}
                            </Text>
                        </View>
                        <View style={{ marginTop: 13, marginBottom: 10 }}>
                            <Barcode
                                format="CODE39"
                                value={barcode}
                                text={barcode}
                                textStyle={{ fontFamily: "Lato_Bold" }}
                                width={240}
                                height={63}
                                maxWidth={SCREEN_WIDTH - 4 * DEFAULT_MARGIN}
                            />
                        </View>
                    </View>
                    <View style={{ width: "100%", marginBottom: 10 }}>
                        {accessPermitDocumentBasicInformation
                            .filter((item) => item.label)
                            .map((item) => {
                                const { label, content } = item;

                                return (
                                    <View key={label} style={[styles.licenseInfo, { marginTop: 10 }]}>
                                        <View style={[{ flex: 1 }]}>
                                            <Text
                                                testID={genTestId(`permitInfoLabel${label}`)}
                                                style={styles.labelText}
                                            >
                                                {label}
                                            </Text>
                                            <Text
                                                testID={genTestId(`permitInfoLabel${label}Content`)}
                                                style={styles.valueText}
                                            >
                                                {content}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })}
                    </View>
                </View>
                <NotificationAndAttachment folderName={folderName} fileInfoList={fileInfoList} />
            </ScrollView>
        </Page>
    );
}

export default AccessPermitDetailScreen;
