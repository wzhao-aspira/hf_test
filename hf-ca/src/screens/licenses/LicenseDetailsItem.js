import { View, Text, StyleSheet } from "react-native";
import Barcode from "@kichiyaki/react-native-barcode-generator";
import { useTranslation, Trans } from "react-i18next";

import PrimaryBtn from "../../components/PrimaryBtn";
import RenderHTML from "../../components/RenderHTML";
import { genTestId } from "../../helper/AppHelper";

import AppTheme from "../../assets/_default/AppTheme";
import { DEFAULT_MARGIN, SCREEN_WIDTH } from "../../constants/Dimension";

import useNavigateToISSubmitHarvestReport from "./hooks/useNavigateToISSubmitHarvestReport";
import { appConfig } from "../../services/AppConfigService";
import useNavigateToISViewHarvestReport from "./hooks/useNavigateToISViewHarvestReport";
import LicenseDetailCustomerSection from "./LicenseDetailCustomerSection";

const styles = StyleSheet.create({
    content: {
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
    subTitle: {
        ...AppTheme.typography.overlay_hyperLink,
        color: AppTheme.colors.font_color_1,
        textAlign: "center",
        textAlignVertical: "center",
    },
    titleContainer: {
        paddingVertical: 10,
    },
    subTitleContainer: {
        paddingVertical: 5,
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
        fontSize: 16,
    },
    valueText: {
        ...AppTheme.typography.card_title,
        color: AppTheme.colors.font_color_1,
        textAlignVertical: "center",
    },
    line: {
        width: "95%",
        borderColor: AppTheme.colors.divider,
        borderWidth: 1,
        borderStyle: "dashed",
        marginTop: 20,
        marginBottom: 10,
    },
});

const getHarvestReportButtonText = (shouldShowViewHarvestReportButton, t) => {
    let text = t("licenseDetails.submitHarvestReport");
    if (shouldShowViewHarvestReportButton) {
        text = t("licenseDetails.viewHarvestReport");
    }

    return text;
};

function RenderFeeSection({ licenseData }) {
    const { lePermitTypeName, lePermitId, amount, itemName } = licenseData || {};

    const { t } = useTranslation();
    const feeItems = [
        { label: t("licenseDetails.item"), content: itemName },
        { label: t("licenseDetails.fee"), content: `$${amount}` },
        { label: t("licenseDetails.lePermitType"), content: lePermitTypeName },
        { label: t("licenseDetails.lePermitId"), content: lePermitId },
    ];
    return feeItems.map((item) => {
        return (
            <View style={[styles.licenseInfo, { marginTop: 10 }]} key={item.label} testID={genTestId("feeSection")}>
                {!!item.content && (
                    <>
                        <Text style={[styles.labelText, { width: 100 }]}>{item.label}</Text>
                        <Text style={[styles.valueText, { width: SCREEN_WIDTH - 4 * DEFAULT_MARGIN - 100 }]}>
                            {item.content}
                        </Text>
                    </>
                )}
            </View>
        );
    });
}

function LicenseDetailsItem(props) {
    const { t } = useTranslation();

    const { licenseData } = props;
    const {
        id,
        name,
        documentCode,
        validityCornerTitle,
        altTextValidFromTo,
        printedDescriptiveText,
        duplicateWatermark,
        documentNumber,
        mobileAppNeedPhysicalDocument,
        additionalValidityText,
        isHarvestReportSubmissionAllowed,
        isHarvestReportSubmissionEnabled,
        isHarvestReportSubmitted,
        licenseNotInReportingPeriodAttention,
        licenseReportId,
        huntTagDescription,
    } = licenseData || {};

    const { navigateToSubmitHarvestReport } = useNavigateToISSubmitHarvestReport(id);
    const { navigateToViewHarvestReport } = useNavigateToISViewHarvestReport(licenseReportId);

    const harvestReportButtonEnable =
        isHarvestReportSubmissionAllowed && (isHarvestReportSubmissionEnabled || isHarvestReportSubmitted);
    const shouldShowViewHarvestReportButton = isHarvestReportSubmissionAllowed && isHarvestReportSubmitted;
    const harvestReportButtonText = getHarvestReportButtonText(shouldShowViewHarvestReportButton, t);

    return (
        <>
            {mobileAppNeedPhysicalDocument && (
                <View style={[styles.sectionContent, { marginTop: 0, marginBottom: 26 }]}>
                    <View style={[styles.licenseInfo, { marginTop: 10 }]}>
                        <Text
                            style={([styles.labelText], { color: AppTheme.colors.error, fontFamily: "Bold" })}
                            testID={genTestId("documentRequiredReminder")}
                        >
                            {appConfig.data.documentRequiredReminder}
                        </Text>
                    </View>
                </View>
            )}
            <View style={styles.content}>
                <View
                    style={{
                        flexDirection: "row",
                        marginHorizontal: DEFAULT_MARGIN,
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: 10,
                    }}
                >
                    <Text
                        style={[styles.title, { fontSize: 40, lineHeight: 40 }]}
                        testID={genTestId("validityCornerTitle")}
                    >
                        {validityCornerTitle}
                    </Text>
                    <Text style={{ lineHeight: 30 }} testID={genTestId("duplicateWatermark")}>
                        {duplicateWatermark}
                    </Text>
                    <Text testID={genTestId("documentCode")} style={[styles.title, { fontSize: 40, lineHeight: 40 }]}>
                        {documentCode}
                    </Text>
                </View>
                <View style={{ alignItems: "center" }}>
                    <View style={[styles.titleContainer]}>
                        <Text
                            numberOfLines={0}
                            style={[styles.title, { ...AppTheme.typography.sub_section }]}
                            testID={genTestId("stateOfCalifornia")}
                        >
                            <Trans i18nKey="licenseDetails.stateOfCalifornia" />
                        </Text>
                    </View>
                    <View style={[styles.titleContainer, { paddingTop: 0 }]}>
                        <Text
                            numberOfLines={0}
                            style={[styles.title, { ...AppTheme.typography.sub_section }]}
                            testID={genTestId("departmentOfFW")}
                        >
                            <Trans i18nKey="licenseDetails.departmentOfFW" />
                        </Text>
                    </View>
                    <View style={[styles.line, { marginTop: 0 }]} />
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
                            testID={genTestId("name")}
                        >
                            {name}
                        </Text>
                    </View>
                    {!!huntTagDescription && (
                        <View style={styles.subTitleContainer}>
                            <Text
                                numberOfLines={0}
                                style={[
                                    styles.subTitle,
                                    {
                                        width: SCREEN_WIDTH - 2 * DEFAULT_MARGIN,
                                        paddingHorizontal: DEFAULT_MARGIN,
                                    },
                                ]}
                                testID={genTestId("huntTagDescription")}
                            >
                                {huntTagDescription}
                            </Text>
                        </View>
                    )}
                    <View style={styles.subTitleContainer}>
                        <Text
                            numberOfLines={0}
                            style={[
                                styles.subTitle,
                                {
                                    width: SCREEN_WIDTH - 2 * DEFAULT_MARGIN,
                                    paddingHorizontal: DEFAULT_MARGIN,
                                },
                            ]}
                            testID={genTestId("altTextValidFromTo")}
                        >
                            {altTextValidFromTo}
                        </Text>
                    </View>
                    {!!additionalValidityText && (
                        <View style={styles.subTitleContainer}>
                            <Text
                                style={[
                                    styles.subTitle,
                                    {
                                        width: SCREEN_WIDTH - 2 * DEFAULT_MARGIN,
                                        paddingHorizontal: DEFAULT_MARGIN,
                                    },
                                ]}
                                numberOfLines={0}
                                testID={genTestId("additionalValidityText")}
                            >
                                {additionalValidityText}
                            </Text>
                        </View>
                    )}
                    <View style={{ marginTop: 13, marginBottom: 10 }} testID={genTestId("barCode")}>
                        {documentNumber && (
                            <Barcode
                                format="CODE39"
                                value={documentNumber}
                                text={documentNumber}
                                textStyle={{ fontFamily: "Lato_Bold" }}
                                width={240}
                                height={63}
                                maxWidth={SCREEN_WIDTH - 4 * DEFAULT_MARGIN}
                            />
                        )}
                    </View>
                </View>
            </View>
            <View style={styles.sectionContent}>
                <LicenseDetailCustomerSection />
            </View>
            <View style={styles.sectionContent}>
                <RenderFeeSection licenseData={licenseData} />
                <View style={[styles.licenseInfo, { marginTop: 10 }]}>
                    <Text style={styles.labelText} testID={genTestId("feeNotice")}>
                        <Trans i18nKey="licenseDetails.feeNotice" />
                    </Text>
                </View>
            </View>
            {!!printedDescriptiveText && (
                <View style={[styles.sectionContent]}>
                    <View
                        style={{ paddingTop: 10, paddingHorizontal: DEFAULT_MARGIN }}
                        testID={genTestId("printedDescriptiveText")}
                    >
                        <RenderHTML
                            contentWidth={SCREEN_WIDTH}
                            source={{
                                html: printedDescriptiveText,
                            }}
                        />
                    </View>
                </View>
            )}
            {isHarvestReportSubmissionAllowed && (
                <View>
                    <PrimaryBtn
                        disabled={!harvestReportButtonEnable}
                        testID={genTestId("SubmitHarvestReportButton ")}
                        style={{ marginHorizontal: DEFAULT_MARGIN, marginTop: 26 }}
                        onPress={() => {
                            if (shouldShowViewHarvestReportButton) {
                                navigateToViewHarvestReport();
                            } else {
                                navigateToSubmitHarvestReport();
                            }
                        }}
                        label={harvestReportButtonText}
                    />
                    {!harvestReportButtonEnable && !!licenseNotInReportingPeriodAttention && (
                        <Text
                            style={[styles.valueText, { marginHorizontal: DEFAULT_MARGIN, marginTop: 10 }]}
                            testID={genTestId("reportingPeriodAttention")}
                        >
                            {licenseNotInReportingPeriodAttention}
                        </Text>
                    )}
                </View>
            )}
        </>
    );
}

export default LicenseDetailsItem;
