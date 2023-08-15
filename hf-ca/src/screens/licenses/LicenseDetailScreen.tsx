import { View, Text, StyleSheet, ScrollView } from "react-native";
import Barcode from "@kichiyaki/react-native-barcode-generator";
import { useTranslation, Trans } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppNativeStackScreenProps } from "../../constants/Routers";

import PrimaryBtn from "../../components/PrimaryBtn";
import { genTestId } from "../../helper/AppHelper";

import AppTheme from "../../assets/_default/AppTheme";
import { DEFAULT_MARGIN, PAGE_MARGIN_BOTTOM, SCREEN_WIDTH } from "../../constants/Dimension";

import Page from "../../components/Page";
import CommonHeader from "../../components/CommonHeader";

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
    sectionContent: {
        marginTop: 26,
        marginHorizontal: DEFAULT_MARGIN,
        ...AppTheme.shadow,
        backgroundColor: AppTheme.colors.font_color_4,
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
    sectionTitle: {
        ...AppTheme.typography.section_header,
        color: AppTheme.colors.font_color_1,
        textAlignVertical: "center",
        marginHorizontal: DEFAULT_MARGIN,
        marginTop: 26,
        marginBottom: 10,
    },
});

interface LicenseDetailScreenProps extends AppNativeStackScreenProps<"licenseDetail"> {
    //
}

function LicenseDetailScreen(props: LicenseDetailScreenProps) {
    const { route } = props;
    const { licenseData } = route.params;

    const { t } = useTranslation();
    const safeAreaInsets = useSafeAreaInsets();

    const { notification, basicInformation, licenseOwner, GOID, validFrom, validTo, stateID, name, documentNumber } =
        licenseData;
    const { DOB, gender, hair, eyes, height, weight, resident } = basicInformation;

    const licenseDocumentBasicInformation = [
        [
            { label: t("licenseDetails.licenseOwner"), content: licenseOwner },
            { label: t("licenseDetails.GOID"), content: GOID },
        ],
        [
            { label: t("licenseDetails.validFrom"), content: validFrom },
            { label: t("licenseDetails.validTo"), content: validTo },
        ],
        [{ label: t("licenseDetails.stateID"), content: stateID }],
    ];

    const basicInformationArray = [
        [
            { label: t("licenseDetails.DOB"), content: DOB },
            { label: t("licenseDetails.Gender"), content: gender },
        ],
        [
            { label: t("licenseDetails.Hair"), content: hair },
            { label: t("licenseDetails.Eyes"), content: eyes },
        ],
        [
            { label: t("licenseDetails.Height"), content: height },
            { label: t("licenseDetails.Weight"), content: weight },
        ],
        [{ label: t("licenseDetails.Resident"), content: resident }],
    ];

    return (
        <Page style={styles.container}>
            <CommonHeader rightIcon={false} title={t("licenseDetails.licenseDetails")} />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={{ paddingBottom: safeAreaInsets.bottom + PAGE_MARGIN_BOTTOM }}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    <View style={{ alignItems: "center" }}>
                        <View style={styles.titleContainer}>
                            <Text
                                numberOfLines={0}
                                style={[
                                    styles.title,
                                    {
                                        width: SCREEN_WIDTH - 2 * DEFAULT_MARGIN,
                                        paddingHorizontal: DEFAULT_MARGIN,
                                    },
                                ]}
                            >
                                {name}
                            </Text>
                        </View>
                        <View style={{ marginTop: 13, marginBottom: 10 }}>
                            <Barcode
                                format="CODE39"
                                value={documentNumber}
                                text={documentNumber}
                                textStyle={{ fontWeight: "bold" }}
                                width={240}
                                height={63}
                                maxWidth={SCREEN_WIDTH - 4 * DEFAULT_MARGIN}
                            />
                        </View>
                    </View>
                    <View style={{ width: "100%", marginBottom: 10 }}>
                        {licenseDocumentBasicInformation.map((rowItem) => {
                            return (
                                <View key={rowItem[0].label} style={[styles.licenseInfo, { marginTop: 10 }]}>
                                    {rowItem.map((item, index) => (
                                        <View
                                            key={item.label}
                                            style={[{ flex: 1 }, index === 1 && { marginLeft: DEFAULT_MARGIN }]}
                                        >
                                            <Text style={styles.labelText}>{item.label}</Text>
                                            <Text style={styles.valueText}>{item.content}</Text>
                                        </View>
                                    ))}
                                </View>
                            );
                        })}
                    </View>
                </View>

                <View style={[styles.sectionContent]}>
                    <Text style={[styles.sectionTitle]}>
                        <Trans i18nKey="licenseDetails.Notification" />
                    </Text>
                    <View style={styles.licenseInfo}>
                        <View>
                            <Text style={{ marginTop: -10, marginBottom: 13 }}>{notification.text}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.sectionContent}>
                    <Text numberOfLines={0} style={[styles.sectionTitle]}>
                        <Trans i18nKey="licenseDetails.BasicInformation" />
                    </Text>
                    <View style={{ width: "100%", marginBottom: 10 }}>
                        {basicInformationArray.map((rowItem) => {
                            return (
                                <View key={rowItem[0].label} style={[styles.licenseInfo, { marginTop: 10 }]}>
                                    {rowItem.map((item, index) => (
                                        <View
                                            key={item.label}
                                            style={[{ flex: 1 }, index === 1 && { marginLeft: DEFAULT_MARGIN }]}
                                        >
                                            <Text style={styles.labelText}>{item.label}</Text>
                                            <Text style={styles.valueText}>{item.content}</Text>
                                        </View>
                                    ))}
                                </View>
                            );
                        })}
                    </View>
                </View>
                <PrimaryBtn
                    testID={genTestId("SubmitHarvestReportButton ")}
                    style={{ marginHorizontal: DEFAULT_MARGIN, marginTop: 26 }}
                    onPress={() => console.log("Submit Harvest Report Button Pressed")}
                    label={t("licenseDetails.SubmitHarvestReport")}
                />
            </ScrollView>
        </Page>
    );
}

export default LicenseDetailScreen;
