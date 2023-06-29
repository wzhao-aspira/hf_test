import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import CommonHeader from "../../../components/CommonHeader";
import Page from "../../../components/Page";
import ProfileItem from "./ProfileItem";
import OtherProfiles from "./OtherProfiles";
import SwitchProfileDialog from "./SwitchProfileDialog";
import { getProfileList } from "../../../services/ProfileService";
import { commonStyles, profileScreenStyles } from "./Styles";
import { getActiveProfile, getOtherProfiles, setProfileList } from "../../../redux/ProfileSlice";
import { genTestId } from "../../../helper/AppHelper";
import NavigationService from "../../../navigation/NavigationService";
import Routers from "../../../constants/Routers";
import { PROFILE_TYPE_IDS } from "../../../constants/Constants";

export default function ManageProfileScreen() {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const activeProfile = useSelector(getActiveProfile);
    const otherProfiles = useSelector(getOtherProfiles);
    const [showSwitchProfile, setShowSwitchProfile] = useState(false);

    const getProfiles = async () => {
        const profiles = await getProfileList();
        const formattedProfiles = profiles.map((profile) => {
            // get vessel owner name
            if (profile.profileType === PROFILE_TYPE_IDS.vessel) {
                const ownerProfile = profiles.find((item) => item.profileId === profile.ownerId);
                const ownerName = ownerProfile.displayName;
                return { ...profile, ownerName };
            }

            // get adult associated profiles
            if (profile.profileType === PROFILE_TYPE_IDS.adult) {
                const associatedProfiles = profiles.filter((item) => item.ownerId === profile.profileId);
                if (associatedProfiles.length > 0)
                    return {
                        ...profile,
                        associatedProfiles: associatedProfiles.map((item) => ({
                            profileId: item.profileId,
                            displayName: item.displayName,
                        })),
                    };
            }

            return profile;
        });
        dispatch(setProfileList(formattedProfiles));
    };

    useEffect(() => {
        getProfiles();
    }, []);

    const hideDialog = () => {
        setShowSwitchProfile(false);
    };

    return (
        <Page style={profileScreenStyles.container}>
            <CommonHeader title={t("profile.manageProfile")} />
            <ScrollView>
                <Page style={profileScreenStyles.contentContainer}>
                    <View style={profileScreenStyles.horizontalContainer}>
                        <Text style={commonStyles.subTitle}> {t("profile.currentlyInUse")}</Text>
                        {otherProfiles.length > 0 && (
                            <Pressable
                                onPress={() => {
                                    setShowSwitchProfile(true);
                                }}
                                testID={genTestId("switchProfile")}
                            >
                                <Text style={profileScreenStyles.switchProfile}>{t("profile.switchProfile")}</Text>
                            </Pressable>
                        )}
                    </View>

                    <ProfileItem
                        showGoToDetailsPageButton
                        profile={activeProfile}
                        onPress={() => {
                            NavigationService.navigate(Routers.profileDetails, {
                                profileId: activeProfile.profileId,
                            });
                        }}
                        profileItemStyles={{
                            container: commonStyles.profileContainer,
                        }}
                    />
                    <OtherProfiles otherProfiles={otherProfiles} />

                    {showSwitchProfile && (
                        <SwitchProfileDialog
                            closeModal={() => {
                                setShowSwitchProfile(false);
                            }}
                            hideDialog={hideDialog}
                            inactiveProfiles={otherProfiles}
                            activeProfile={activeProfile}
                        />
                    )}
                </Page>
            </ScrollView>
        </Page>
    );
}
