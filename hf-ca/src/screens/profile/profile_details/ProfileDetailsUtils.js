import { StyleSheet } from "react-native";
import { isEmpty } from "lodash";
import AppTheme from "../../../assets/BaseTheme";
import { PROFILE_TYPE_IDS } from "../../../constants/Constants";
import { DEFAULT_MARGIN } from "../../../constants/Dimension";
import { isIndividualProfile } from "../../../helper/ProfileHelper";

export const styles = StyleSheet.create({
    container: {
        backgroundColor: AppTheme.colors.page_bg,
        paddingBottom: 0,
    },
    contentContainerStyle: {
        paddingBottom: DEFAULT_MARGIN,
    },
    infoItem: {
        marginBottom: 15,
    },
    infoType: {
        ...AppTheme.typography.card_small_r,
        color: AppTheme.colors.font_color_2,
    },
    infoValue: {
        ...AppTheme.typography.card_title,
        color: AppTheme.colors.font_color_1,
        marginTop: 5,
    },
    headerContainer: {
        flexDirection: "column",
        paddingVertical: 22,
        paddingHorizontal: DEFAULT_MARGIN,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        backgroundColor: AppTheme.colors.font_color_4,
    },
    profileShortNameContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderColor: AppTheme.colors.secondary_900,
        borderWidth: 3,
        marginRight: 0,
    },
    profileTypeIconContainer: {
        width: 60,
        height: 60,
        marginRight: 0,
    },
    profileShortName: {
        ...AppTheme.typography.section_header,
    },
    profileDisplayName: {
        marginTop: 8,
        marginBottom: 6,
        textAlign: "center",
        ...AppTheme.typography.section_header,
        color: AppTheme.colors.font_color_1,
    },
    profileItemNumber: {
        ...AppTheme.typography.card_small_r,
        color: AppTheme.colors.font_color_2,
    },
    address: {
        ...AppTheme.typography.section_header,
        color: AppTheme.colors.font_color_1,
        marginBottom: 16,
    },
    infoBox: {
        paddingTop: 18,
        paddingHorizontal: 16,
        backgroundColor: AppTheme.colors.font_color_4,
        borderRadius: 20,
        ...AppTheme.shadow,
    },
    divider: {
        height: StyleSheet.hairlineWidth * 1.5,
        backgroundColor: AppTheme.colors.divider,
        marginHorizontal: -16,
        marginTop: 19,
    },
    bottomBtnBox: {
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: AppTheme.colors.font_color_4,
        alignItems: "center",
        marginTop: 20,
        paddingVertical: 27,
        borderRadius: 20,
        ...AppTheme.shadow,
    },
    removeProfile: {
        ...AppTheme.typography.sub_section,
        marginLeft: 20,
    },
    removeMsgContainer: {
        marginTop: 10,
    },
    removeMsg: {
        ...AppTheme.typography.overlay_sub_text,
        color: AppTheme.colors.font_color_2,
        lineHeight: 20,
        marginLeft: 10,
    },
});

export const switchAction = "switch";
export const removeAction = "remove";

export const getHeight = (height) => {
    if (height) {
        return `${height}cm`;
    }
    return undefined;
};
export const getWeight = (weight) => {
    if (weight) {
        return `${weight}kg`;
    }
    return undefined;
};

export const getInfoList = (profile, t) => {
    if (isEmpty(profile)) {
        return [];
    }

    let profilesInfo = [];
    if (isIndividualProfile(profile.profileType)) {
        profilesInfo = [
            {
                type: t("profile.dateOfBirth"),
                value: profile.dateOfBirth,
            },
            {
                type: t("profile.sex"),
                value: profile.gender,
            },

            {
                type: t("profile.hair"),
                value: profile.hair,
            },

            {
                type: t("profile.eyes"),
                value: profile.eye,
            },

            {
                type: t("profile.height"),
                value: getHeight(profile.height),
            },
            {
                type: t("profile.weight"),
                value: getWeight(profile.weight),
            },
        ];
    }

    if (profile.profileType === PROFILE_TYPE_IDS.business) {
        profilesInfo = [
            {
                type: t("profile.fishBusinessID"),
                value: profile.fishBusinessId,
            },
            {
                type: t("profile.ownershipType"),
                value: profile.ownershipType,
            },
        ];
    }

    if (profile.profileType === PROFILE_TYPE_IDS.vessel) {
        profilesInfo = [
            {
                type: t("profile.vesselName"),
                value: profile.vesselName,
            },
            {
                type: t("profile.ownerName"),
                value: profile.ownerName,
            },
            {
                type: t("profile.purchaseDate"),
                value: profile.purchaseDate,
            },
            {
                type: t("profile.currentDocumentation"),
                value: profile.currentDocumentation,
            },
        ];
    }

    return profilesInfo.map((item) => {
        return {
            type: item.type,
            value: item.value || "-",
        };
    });
};

export const getAddressList = (profile, t) => {
    if (isEmpty(profile)) {
        return [];
    }

    const profilesInfo = [];
    if (profile.residenceAddress) {
        profilesInfo.push({
            type: t("profile.physicalAddress"),
            value: profile.residenceAddress,
        });
    }
    if (profile.mailingAddress) {
        profilesInfo.push({ type: t("profile.mailingAddress"), value: profile.mailingAddress });
    }

    return profilesInfo;
};
