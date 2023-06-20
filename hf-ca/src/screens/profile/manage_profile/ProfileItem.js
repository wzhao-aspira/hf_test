import React from "react";
import { Pressable, Text, View } from "react-native";
import { faChevronRight } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTranslation } from "react-i18next";
import AppTheme from "../../../assets/_default/AppTheme";
import { commonStyles } from "./Styles";
import { PROFILE_TYPE_IDS } from "../../../constants/Constants";
import { shortName } from "../../../utils/GenUtil";
import { genTestId } from "../../../helper/AppHelper";

const getProfileShortName = (profile) => {
    if (profile.profileType === PROFILE_TYPE_IDS.business) {
        return "B"; // TODO: UI design not ready
    }
    if (profile.profileType === PROFILE_TYPE_IDS.vessel) {
        return "V"; // TODO: UI design not ready
    }
    return shortName(profile.displayName);
};

const getGOIDLabel = (t, profile) => {
    if (profile.profileType === PROFILE_TYPE_IDS.business) {
        return t("profile.businessGOIDNumber");
    }
    if (profile.profileType === PROFILE_TYPE_IDS.vessel) {
        return t("profile.vesselGOIDNumber");
    }
    return t("profile.goIDNumber");
};

const ProfileItem = ({ profile, onPress, showGoToDetailsPageButton, profileItemStyles = {} }) => {
    const { t } = useTranslation();

    return (
        <Pressable
            onPress={() => {
                onPress && onPress();
            }}
            style={profileItemStyles.pressable}
            testID={genTestId(`profile_${profile.profileId}`)}
        >
            <View style={profileItemStyles.container}>
                <View style={[commonStyles.profileShortNameContainer, profileItemStyles.shortNameContainer]}>
                    <Text style={commonStyles.profileShortName} testID={genTestId("profileShortName")}>
                        {getProfileShortName(profile)}
                    </Text>
                </View>

                <View>
                    <Text style={commonStyles.profileDisplayName} testID={genTestId("profileName")}>
                        {profile.displayName}
                    </Text>
                    <Text style={commonStyles.profileItemNumber} testID={genTestId("profileGoIdNumber")}>
                        {getGOIDLabel(t, profile)} : {profile.goIDNumber}
                    </Text>
                </View>

                <View style={{ flexGrow: 1 }} />
                {showGoToDetailsPageButton && (
                    <FontAwesomeIcon icon={faChevronRight} size={22} color={AppTheme.colors.primary_2} />
                )}
            </View>
        </Pressable>
    );
};

export default ProfileItem;
