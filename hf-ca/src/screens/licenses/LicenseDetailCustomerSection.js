import { View, Text, StyleSheet } from "react-native";
import { useTranslation, Trans } from "react-i18next";
import { useSelector } from "react-redux";
import moment from "moment";

import { genTestId } from "../../helper/AppHelper";
import AppTheme from "../../assets/_default/AppTheme";
import { DEFAULT_MARGIN } from "../../constants/Dimension";

import { selectors } from "../../redux/ProfileSlice";
import { PROFILE_TYPE_IDS } from "../../constants/Constants";
import { getHeight, getWeight } from "../profile/profile_details/ProfileDetailsUtils";

import profileSelectors from "../../redux/ProfileSelector";

const styles = StyleSheet.create({
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

const selectResidentMethodTypeById = (residentMethodTypes, residentMethodTypeId) => {
    return residentMethodTypes?.find((item) => item.residentMethodTypeId === residentMethodTypeId) || {};
};

function renderInfoSection(sectionName, sectionInformation) {
    return sectionInformation?.map((rowItem) => {
        return rowItem && rowItem[0] ? (
            <View key={`${sectionName}_${rowItem[0].label}_Wrapper`} style={[styles.licenseInfo, { marginTop: 10 }]}>
                {rowItem.map((item, index) => (
                    <View
                        key={`${sectionName}_${item.label}_kv`}
                        style={[{ flex: 1 }, index === 1 && { marginLeft: DEFAULT_MARGIN }]}
                    >
                        <Text style={styles.labelText} testID={genTestId(item.label)}>
                            {item.label}
                        </Text>
                        {item.content ? (
                            <Text
                                style={item.label ? styles.valueText : styles.labelText}
                                testID={genTestId(`${item.label}Value`)}
                            >
                                {item.content}
                            </Text>
                        ) : (
                            <Text style={styles.valueText} testID={genTestId(`${item.label}Value`)}>
                                {item.label && <Trans i18nKey="common.na" />}
                            </Text>
                        )}
                    </View>
                ))}
            </View>
        ) : null;
    });
}

function RenderVesselCustomerSection({ profileDetails }) {
    const {
        goIDNumber,
        vesselName,
        fgNumber,
        homePort,
        hullNumber,
        yearBuilt,
        displayGrossTonnage,
        displayNetTonnage,
        displayLength,
        displayBreadth,
        displayDepth,
        vesselCustomerDocumentIdentityFieldName,
        vesselCustomerDocumentIdentityDisplayValue,
        ownerOfficialDocumentFieldName,
        ownerOfficialDocumentDisplayValue,
        ownerName,
        ownerGOIDNumber,
        ownerSimplePhysicalAddress,
        ownerResidentMethodTypeId,
    } = profileDetails;

    const { t } = useTranslation();
    const residentMethodTypes = useSelector(profileSelectors.residentMethodTypes);
    const ownerResidentMethodTypeData = selectResidentMethodTypeById(residentMethodTypes, ownerResidentMethodTypeId);
    const { residentMethodType: ownerResidentMethodType } = ownerResidentMethodTypeData;

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
            { label: t("licenseDetails.grossTonnage"), content: displayGrossTonnage },
            { label: t("licenseDetails.netTonnage"), content: displayNetTonnage },
        ],
        [
            { label: t("licenseDetails.length"), content: displayLength },
            { label: t("licenseDetails.breadth"), content: displayBreadth },
        ],
        [{ label: t("licenseDetails.depth"), content: displayDepth }],
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
}

function RenderIndividualCustomerSection({ profileDetails }) {
    const { t } = useTranslation();
    const {
        displayName,
        goIDNumber,
        genderShortForm,
        hair,
        eye,
        height,
        weight,
        dateOfBirth,
        simplePhysicalAddress,
        individualCustomerOfficialDocumentFieldName,
        individualCustomerOfficialDocumentDisplayValue,
        residentMethodTypeId,
    } = profileDetails;

    const residentMethodTypes = useSelector(profileSelectors.residentMethodTypes);
    const residentMethodTypeData = selectResidentMethodTypeById(residentMethodTypes, residentMethodTypeId);
    const { printDescription } = residentMethodTypeData;

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

    return (
        <View style={{ alignItems: "center", paddingVertical: 10 }} testID={genTestId("individualCustomerSection")}>
            {renderInfoSection("individualCustomerBasicInfo", individualCustomerBasicInfo)}
            <View style={styles.line} />
            {renderInfoSection("individualCustomerAttributeInfo", individualCustomerAttributeInfo)}
        </View>
    );
}

function RenderBusinessCustomerSection({ profileDetails }) {
    const { t } = useTranslation();
    const { goIDNumber, businessName, simplePhysicalAddress, residentMethodTypeId } = profileDetails;
    const residentMethodTypes = useSelector(profileSelectors.residentMethodTypes);
    const residentMethodTypeData = selectResidentMethodTypeById(residentMethodTypes, residentMethodTypeId);
    const { residentMethodType } = residentMethodTypeData;

    const businessCustomerBaseInfo = [
        [
            { label: t("licenseDetails.dba"), content: businessName },
            { label: t("licenseDetails.goID"), content: goIDNumber },
        ],
        [{ label: t("licenseDetails.address"), content: simplePhysicalAddress }],
        residentMethodType ? [{ label: "", content: residentMethodType }] : null,
    ];

    return (
        <View style={{ alignItems: "center" }} testID={genTestId("businessCustomerSection")}>
            {renderInfoSection("businessCustomerBaseInfo", businessCustomerBaseInfo)}
        </View>
    );
}

function LicenseDetailCustomerSection() {
    const currentInUseProfileId = useSelector(selectors.selectCurrentInUseProfileID);
    const profileDetails = useSelector(selectors.selectProfileDetailsById(currentInUseProfileId));
    const { profileType: customerTypeId } = profileDetails;

    return (
        <>
            {(PROFILE_TYPE_IDS.adult === customerTypeId || PROFILE_TYPE_IDS.youth === customerTypeId) && (
                <RenderIndividualCustomerSection profileDetails={profileDetails} />
            )}
            {PROFILE_TYPE_IDS.business == customerTypeId && (
                <RenderBusinessCustomerSection profileDetails={profileDetails} />
            )}
            {PROFILE_TYPE_IDS.vessel == customerTypeId && (
                <RenderVesselCustomerSection profileDetails={profileDetails} />
            )}
        </>
    );
}

export default LicenseDetailCustomerSection;
