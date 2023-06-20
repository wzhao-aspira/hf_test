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

export default function ManageProfileScreen() {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const activeProfile = useSelector(getActiveProfile);
    const otherProfiles = useSelector(getOtherProfiles);
    const [showSwitchProfile, setShowSwitchProfile] = useState(false);

    const getProfiles = async () => {
        const profiles = await getProfileList();
        dispatch(setProfileList(profiles));
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
                        onPress={() => {}}
                        profileItemStyles={{
                            container: commonStyles.profileContainer,
                            shortNameContainer: commonStyles.profileShortNameContainer,
                        }}
                    />
                    <OtherProfiles otherProfiles={otherProfiles} />

                    {showSwitchProfile && (
                        <SwitchProfileDialog
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
