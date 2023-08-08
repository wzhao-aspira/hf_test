import { Pressable, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { faChevronRight } from "@fortawesome/pro-light-svg-icons/faChevronRight";
import { faBuilding } from "@fortawesome/pro-regular-svg-icons/faBuilding";
import { faShip } from "@fortawesome/pro-regular-svg-icons/faShip";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTranslation } from "react-i18next";
import AppTheme from "../../../assets/_default/AppTheme";
import { commonStyles, profileItemCommonStyle } from "./Styles";
import { PROFILE_TYPE_IDS } from "../../../constants/Constants";
import { shortName } from "../../../utils/GenUtil";
import { genTestId } from "../../../helper/AppHelper";
import getGOIDLabel, { isAssociatedProfile } from "../../../helper/ProfileHelper";
import { selectors as profileSelectors } from "../../../redux/ProfileSlice";

const typeIcons = {
    [PROFILE_TYPE_IDS.business]: faBuilding,
    [PROFILE_TYPE_IDS.vessel]: faShip,
};

export function ProfileShortNameOrIcon({
    profile,
    shortNameContainer = {},
    profileShortNameStyles = {},
    iconStyles = {},
}) {
    const { profileType, displayName, profileId } = profile;
    const typeIcon = typeIcons[profileType];
    const primaryProfileID = useSelector(profileSelectors.selectPrimaryProfileID);
    const borderColor = primaryProfileID === profileId ? AppTheme.colors.error : AppTheme.colors.primary_2;

    if (isAssociatedProfile(profileType)) {
        return (
            <View style={[profileItemCommonStyle.profileTypeContainer, iconStyles.container]}>
                <FontAwesomeIcon icon={typeIcon} size={iconStyles.iconSize || 26} color={AppTheme.colors.primary_2} />
            </View>
        );
    }

    return (
        <View style={[commonStyles.profileShortNameContainer, shortNameContainer, { borderColor }]}>
            <Text
                style={[commonStyles.profileShortName, profileShortNameStyles]}
                testID={genTestId("profileShortName")}
            >
                {shortName(displayName)}
            </Text>
        </View>
    );
}

function ProfileItem({ profile, onPress, showGoToDetailsPageButton, showNameInOneLine, profileItemStyles = {} }) {
    const { t } = useTranslation();
    let nameProps = {};

    if (showNameInOneLine) {
        nameProps = { numberOfLines: 1, ellipsizeMode: "tail" };
    }

    if (!profile) return null;

    return (
        <Pressable
            onPress={() => {
                if (onPress) onPress();
            }}
            style={profileItemStyles.pressable}
            testID={genTestId(`profile_${profile?.profileId}`)}
        >
            <View style={profileItemStyles.container}>
                <ProfileShortNameOrIcon profile={profile} shortNameContainer={profileItemStyles.shortNameContainer} />

                <View style={{ flex: 1 }}>
                    <Text style={commonStyles.profileDisplayName} testID={genTestId("profileName")} {...nameProps}>
                        {profile?.displayName}
                    </Text>
                    <Text style={commonStyles.profileItemNumber} testID={genTestId("profileGoIdNumber")}>
                        {getGOIDLabel(t, profile)} #: {profile?.goIDNumber}
                    </Text>
                </View>

                {showGoToDetailsPageButton && (
                    <FontAwesomeIcon icon={faChevronRight} size={22} color={AppTheme.colors.primary_2} />
                )}
            </View>
        </Pressable>
    );
}

export default ProfileItem;
