import { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl } from "react-native";
import Barcode from "@kichiyaki/react-native-barcode-generator";
import { useTranslation, Trans } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import RenderHtml from "react-native-render-html";
import moment from "moment";
import PrimaryBtn from "../../components/PrimaryBtn";
import { genTestId } from "../../helper/AppHelper";

import AppTheme from "../../assets/_default/AppTheme";
import { DEFAULT_MARGIN, PAGE_MARGIN_BOTTOM, SCREEN_WIDTH } from "../../constants/Dimension";

import Page from "../../components/Page";
import CommonHeader from "../../components/CommonHeader";
import { selectors } from "../../redux/ProfileSlice";
import ProfileThunk from "../../redux/ProfileThunk";
import { PROFILE_TYPE_IDS, REQUEST_STATUS } from "../../constants/Constants";
import { getHeight, getWeight } from "../profile/profile_details/ProfileDetailsUtils";
import { selectLicenseForList } from "../../redux/LicenseSelector";
import { getLicense } from "../../redux/LicenseSlice";
import useFocus from "../../hooks/useFocus";
import useNavigateToISSubmitHarvestReport from "./hooks/useNavigateToISSubmitHarvestReport";
import LicenseDetailLoading from "./LicenseDetailLoading";
import { appConfig } from "../../services/AppConfigService";
import useNavigateToISViewHarvestReport from "./hooks/useNavigateToISViewHarvestReport";

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

function renderInfoSection(sectionName, sectionInformation) {
    return sectionInformation?.map((rowItem) => {
        return rowItem && rowItem[0] ? (
            <View key={`${sectionName}_${rowItem[0].label}_Wrapper`} style={[styles.licenseInfo, { marginTop: 10 }]}>
                {rowItem.map((item, index) => (
                    <View
                        key={`${sectionName}_${item.label}_kv`}
                        style={[{ flex: 1 }, index === 1 && { marginLeft: DEFAULT_MARGIN }]}
                    >
                        <Text style={styles.labelText}>{item.label}</Text>
                        {item.content ? (
                            <Text style={item.label ? styles.valueText : styles.labelText}>{item.content}</Text>
                        ) : (
                            <Text style={styles.valueText}>{item.label && <Trans i18nKey="common.na" />}</Text>
                        )}
                    </View>
                ))}
            </View>
        ) : null;
    });
}

const selectLicenseById = (id, licenseState) => {
    const licenseData = licenseState.data;
    let selectedLicense = {};
    licenseData?.forEach((group) => {
        const item = group?.data?.find((license) => license.id === id);
        if (item) {
            selectedLicense = item;
        }
    });
    return selectedLicense;
};

function LicenseDetailScreen(props) {
    const { t } = useTranslation();
    const safeAreaInsets = useSafeAreaInsets();
    const dispatch = useDispatch();

    const reduxData = useSelector(selectLicenseForList);
    const licenseRefreshing = reduxData.requestStatus === REQUEST_STATUS.pending;

    const { route } = props;
    const { licenseData: license } = route.params;
    const { id } = license;
    const licenseData = selectLicenseById(id, reduxData);
    const {
        name,
        documentCode,
        validityCornerTitle,
        altTextValidFromTo,
        lePermitTypeName,
        lePermitId,
        printedDescriptiveText,
        duplicateWatermark,
        amount,
        documentNumber,
        mobileAppNeedPhysicalDocument,
        itemName,
        additionalValidityText,
        isHarvestReportSubmissionAllowed,
        isHarvestReportSubmissionEnabled,
        isHarvestReportSubmitted,
        licenseReportId,
    } = licenseData || {};

    console.log(`license data:${JSON.stringify(licenseData)}`);

    const { navigateToSubmitHarvestReport } = useNavigateToISSubmitHarvestReport(id);
    const { navigateToViewHarvestReport } = useNavigateToISViewHarvestReport(licenseReportId);
    const currentInUseProfileId = useSelector(selectors.selectCurrentInUseProfileID);
    const profileDetails = useSelector(selectors.selectProfileDetailsById(currentInUseProfileId));
    const {
        profileType: customerTypeId,
        displayName,
        goIDNumber,
        genderShortForm,
        hair,
        eye,
        height,
        weight,
        dateOfBirth,
        businessName,
        simplePhysicalAddress,
        vesselName,
        fgNumber,
        homePort,
        hullNumber,
        yearBuilt,
        grossTonnage,
        netTonnage,
        length,
        breadth,
        depth,
        individualCustomerOfficialDocumentFieldName,
        individualCustomerOfficialDocumentDisplayValue,
        vesselCustomerDocumentIdentityFieldName,
        vesselCustomerDocumentIdentityDisplayValue,
        ownerOfficialDocumentFieldName,
        ownerOfficialDocumentDisplayValue,
        residentMethodTypeId,
        ownerName,
        ownerGOIDNumber,
        ownerSimplePhysicalAddress,
        ownerResidentMethodTypeId,
    } = profileDetails;

    const residentMethodTypeData = useSelector(selectors.selectResidentMethodTypeById(residentMethodTypeId));
    const { residentMethodType, printDescription } = residentMethodTypeData;
    const ownerResidentMethodTypeData = useSelector(selectors.selectResidentMethodTypeById(ownerResidentMethodTypeId));
    const { residentMethodType: ownerResidentMethodType } = ownerResidentMethodTypeData;
    const individualCustomerBasicInfo = [
        [
            { label: t("licenseDetails.name"), content: displayName },
            { label: t("licenseDetails.goID"), content: goIDNumber },
        ],
        [
            {
                label: individualCustomerOfficialDocumentFieldName,
                content: individualCustomerOfficialDocumentDisplayValue,
            },
            { label: t("licenseDetails.address"), content: simplePhysicalAddress },
        ],
    ];

    const individualCustomerAttributeInfo = [
        [
            { label: t("licenseDetails.gender"), content: genderShortForm },

            { label: t("licenseDetails.hair"), content: hair },
        ],
        [
            { label: t("licenseDetails.eyes"), content: eye },
            { label: t("licenseDetails.height"), content: getHeight(height) },
        ],
        [
            { label: t("licenseDetails.weight"), content: getWeight(weight) },
            { label: t("licenseDetails.dob"), content: moment(dateOfBirth).format("MM/DD/YYYY") },
        ],
        printDescription ? [{ label: "", content: printDescription }] : null,
    ];

    const businessCustomerBaseInfo = [
        [
            { label: t("licenseDetails.dba"), content: businessName },
            { label: t("licenseDetails.goID"), content: goIDNumber },
        ],
        [{ label: t("licenseDetails.address"), content: simplePhysicalAddress }],
        residentMethodType ? [{ label: "", content: residentMethodType }] : null,
    ];

    const vesselCustomerBasicInfo = [
        [
            { label: t("licenseDetails.vesselName"), content: vesselName },
            { label: t("licenseDetails.goID"), content: goIDNumber },
        ],
        [
            { label: vesselCustomerDocumentIdentityFieldName, content: vesselCustomerDocumentIdentityDisplayValue },
            { label: t("licenseDetails.fgNumber"), content: fgNumber },
        ],
        [{ label: t("licenseDetails.homePort"), content: homePort }],
    ];

    const vesselCustomerAttributeInfo = [
        [
            { label: t("licenseDetails.hullNumber"), content: hullNumber },
            { label: t("licenseDetails.yearBuilt"), content: yearBuilt },
        ],
        [
            { label: t("licenseDetails.grossTonnage"), content: grossTonnage },
            { label: t("licenseDetails.netTonnage"), content: netTonnage },
        ],
        [
            { label: t("licenseDetails.length"), content: length },
            { label: t("licenseDetails.breadth"), content: breadth },
        ],
        [{ label: t("licenseDetails.depth"), content: depth }],
    ];

    const vesselCustomerOwnerBaseInfo = [
        [
            { label: t("licenseDetails.owner"), content: ownerName },
            { label: t("licenseDetails.goID"), content: ownerGOIDNumber },
        ],
        ownerOfficialDocumentFieldName
            ? [
                  { label: ownerOfficialDocumentFieldName, content: ownerOfficialDocumentDisplayValue },
                  { label: t("licenseDetails.address"), content: ownerSimplePhysicalAddress },
              ]
            : [{ label: t("licenseDetails.address"), content: ownerSimplePhysicalAddress }],
        ownerResidentMethodType ? [{ label: "", content: ownerResidentMethodType }] : null,
    ];

    const renderIndividualCustomerSection = () => {
        return (
            <View style={{ alignItems: "center", paddingVertical: 10 }} testID={genTestId("individualCustomerSection")}>
                {renderInfoSection("individualCustomerBasicInfo", individualCustomerBasicInfo)}
                <View style={styles.line} />
                {renderInfoSection("individualCustomerAttributeInfo", individualCustomerAttributeInfo)}
            </View>
        );
    };

    const renderBusinessCustomerSection = () => {
        return (
            <View style={{ alignItems: "center" }} testID={genTestId("businessCustomerSection")}>
                {renderInfoSection("businessCustomerBaseInfo", businessCustomerBaseInfo)}
            </View>
        );
    };

    const renderVesselCustomerSection = () => {
        return (
            <View style={{ alignItems: "center", paddingVertical: 10 }} testID={genTestId("vesselCustomerSection")}>
                {renderInfoSection("vesselCustomerBasicInfo", vesselCustomerBasicInfo)}
                <View style={styles.line} />
                {renderInfoSection("vesselCustomerAttributeInfo", vesselCustomerAttributeInfo)}
                <View style={styles.line} />
                <View style={{ width: "100%", paddingHorizontal: DEFAULT_MARGIN, marginTop: 10 }}>
                    <Text style={[styles.valueText, { textDecorationLine: "underline" }]}>
                        <Trans i18nKey="licenseDetails.vesselOwnerInformation" />
                    </Text>
                </View>
                {renderInfoSection("vesselCustomerOwnerBaseInfo", vesselCustomerOwnerBaseInfo)}
            </View>
        );
    };

    const renderCustomerSection = () => {
        return (
            <>
                {(PROFILE_TYPE_IDS.adult === customerTypeId || PROFILE_TYPE_IDS.youth === customerTypeId) &&
                    renderIndividualCustomerSection()}
                {PROFILE_TYPE_IDS.business == customerTypeId && renderBusinessCustomerSection()}
                {PROFILE_TYPE_IDS.vessel == customerTypeId && renderVesselCustomerSection()}
            </>
        );
    };

    const renderFeeSection = () => {
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
    };

    const getLicenseOfActiveProfile = (isForce) => {
        dispatch(getLicense({ isForce, searchParams: { activeProfileId: currentInUseProfileId } }));
        dispatch(ProfileThunk.initProfileDetails(currentInUseProfileId));
        dispatch(ProfileThunk.initProfileCommonData());
    };

    useFocus(() => {
        getLicenseOfActiveProfile(false);
    });

    useEffect(() => {
        getLicenseOfActiveProfile(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const harvestReportButtonEnable = () => {
        console.log(`isHarvestReportSubmissionAllowed:${isHarvestReportSubmissionAllowed}`);
        console.log(`isHarvestReportSubmissionEnabled:${isHarvestReportSubmissionEnabled}`);
        console.log(`isHarvestReportSubmitted:${isHarvestReportSubmitted}`);

        let result = false;

        if (isHarvestReportSubmissionAllowed && (isHarvestReportSubmissionEnabled || isHarvestReportSubmitted)) {
            result = true;
        }

        return result;
    };

    const harvestReportButtonDisplay = () => {
        return isHarvestReportSubmissionAllowed;
    };

    const shouldShowViewHarvestReportButton = () => {
        let result = false;
        if (isHarvestReportSubmissionAllowed && isHarvestReportSubmitted) {
            result = true;
        }

        return result;
    };

    const getHarvestReportButtonText = () => {
        let text = t("licenseDetails.submitHarvestReport");
        if (shouldShowViewHarvestReportButton()) {
            text = t("licenseDetails.viewHarvestReport");
        }

        return text;
    };

    return (
        <Page style={styles.container}>
            <CommonHeader rightIcon={false} title={t("licenseDetails.licenseDetails")} />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={{ paddingBottom: safeAreaInsets.bottom + PAGE_MARGIN_BOTTOM }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        colors={[AppTheme.colors.primary]}
                        tintColor={AppTheme.colors.primary}
                        refreshing={licenseRefreshing}
                        onRefresh={() => {
                            getLicenseOfActiveProfile(true);
                        }}
                    />
                }
            >
                {licenseRefreshing ? (
                    <LicenseDetailLoading />
                ) : (
                    <>
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
                                <Text
                                    testID={genTestId("documentCode")}
                                    style={[styles.title, { fontSize: 40, lineHeight: 40 }]}
                                >
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
                                        testID={genTestId("altTextValidFromTo")}
                                    >
                                        {altTextValidFromTo}
                                    </Text>
                                </View>
                                {!!additionalValidityText && (
                                    <View style={styles.titleContainer}>
                                        <Text numberOfLines={0} testID={genTestId("additionalValidityText")}>
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
                        <View style={styles.sectionContent}>{renderCustomerSection()}</View>
                        <View style={styles.sectionContent}>
                            {renderFeeSection()}
                            <View style={[styles.licenseInfo, { marginTop: 10 }]}>
                                <Text style={styles.labelText} testID={genTestId("feeNotice")}>
                                    <Trans i18nKey="licenseDetails.feeNotice" />
                                </Text>
                            </View>
                        </View>
                        {mobileAppNeedPhysicalDocument && (
                            <View style={[styles.sectionContent]}>
                                <View style={[styles.licenseInfo, { marginTop: 10 }]}>
                                    <View>
                                        <Text testID={genTestId("documentRequiredReminder")}>
                                            {appConfig.data.documentRequiredReminder}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )}
                        {!!printedDescriptiveText && (
                            <View style={[styles.sectionContent]}>
                                <View
                                    style={[styles.licenseInfo, { marginTop: 10 }]}
                                    testID={genTestId("printedDescriptiveText")}
                                >
                                    <RenderHtml
                                        contentWidth={SCREEN_WIDTH}
                                        source={{
                                            html: printedDescriptiveText,
                                        }}
                                    />
                                </View>
                            </View>
                        )}
                        {harvestReportButtonDisplay() && (
                            <PrimaryBtn
                                disabled={!harvestReportButtonEnable()}
                                testID={genTestId("SubmitHarvestReportButton ")}
                                style={{ marginHorizontal: DEFAULT_MARGIN, marginTop: 26 }}
                                onPress={() => {
                                    if (shouldShowViewHarvestReportButton()) {
                                        navigateToViewHarvestReport();
                                    } else {
                                        navigateToSubmitHarvestReport();
                                    }
                                }}
                                label={getHarvestReportButtonText()}
                            />
                        )}
                    </>
                )}
            </ScrollView>
        </Page>
    );
}

export default LicenseDetailScreen;
