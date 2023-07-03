import { Pressable, ScrollView, Text, View } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faLinkSlash } from "@fortawesome/pro-regular-svg-icons";
import { DEFAULT_MARGIN } from "../../../constants/Dimension";
import CommonHeader from "../../../components/CommonHeader";
import Page from "../../../components/Page";
import { getAddressList, getInfoList, styles } from "./ProfileDetailsUtils";
import { getProfileDetailsById } from "../../../redux/ProfileSlice";
import { ProfileShortNameOrIcon } from "../manage_profile/ProfileItem";
import AppTheme from "../../../assets/_default/AppTheme";
import { genTestId } from "../../../helper/AppHelper";
import { getGOIDLabel } from "../../../helper/ProfileHelper";

const RenderItem = ({ item, divider }) => {
    if (!item.value) {
        return null;
    }
    return (
        <View style={styles.infoItem} key={item.type}>
            <Text style={styles.infoType} testID={genTestId("itemLabel")}>
                {item.type}
            </Text>
            <Text style={styles.infoValue} testID={genTestId("itemValue")}>
                {item.value || "-"}
            </Text>

            {divider && <View style={styles.divider} />}
        </View>
    );
};

const ProfileHeader = ({ profile }) => {
    const { t } = useTranslation();

    return (
        <View style={styles.headerContainer}>
            <ProfileShortNameOrIcon
                profile={profile}
                shortNameContainer={styles.profileShortNameContainer}
                profileShortNameStyles={styles.profileShortName}
                iconStyles={{ container: styles.profileTypeIconContainer, iconSize: 45 }}
            />

            <Text style={styles.profileDisplayName} testID={genTestId("profileDiaplyName")}>
                {profile.displayName}
            </Text>
            <Text style={styles.profileItemNumber} testID={genTestId("profileGoID")}>
                {getGOIDLabel(t, profile)} #: {profile.goIDNumber}
            </Text>
        </View>
    );
};

const ProfileDetailsScreen = ({ route }) => {
    const { params } = route;
    const profileId = params?.profileId;

    const { t } = useTranslation();
    const profileDetails = useSelector(getProfileDetailsById(profileId));
    const profilesInfo = getInfoList(profileDetails, t);
    const addressInfo = getAddressList(profileDetails, t);

    return (
        <Page style={styles.container}>
            <CommonHeader title={t("profile.profileDetails")} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainerStyle}>
                <ProfileHeader profile={profileDetails} />

                <View style={{ padding: DEFAULT_MARGIN, paddingBottom: 0 }}>
                    <Text style={styles.address}>{t("profile.address")}</Text>
                    <View style={styles.infoBox}>
                        {addressInfo.map((item, index) => (
                            <RenderItem item={item} divider={index < addressInfo.length - 1} key={item.type} />
                        ))}
                    </View>

                    <Text style={[styles.address, { marginTop: 36 }]}>{t("profile.basicInformation")}</Text>
                    <View style={styles.infoBox}>
                        {profilesInfo.map((item, index) => (
                            <RenderItem item={item} divider={index < profilesInfo.length - 1} key={item.type} />
                        ))}
                    </View>

                    <Pressable onPress={() => {}} style={styles.bottomBtnBox} testID={genTestId("removeProfileButton")}>
                        <FontAwesomeIcon icon={faLinkSlash} size={28} color={AppTheme.colors.error} />
                        <Text style={styles.removeProfile}>{t("profile.removeProfile")}</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </Page>
    );
};

export default ProfileDetailsScreen;
