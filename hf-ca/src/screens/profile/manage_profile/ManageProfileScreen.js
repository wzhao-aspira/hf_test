import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import CommonHeader from "../../../components/CommonHeader";
import Page from "../../../components/Page";
import ProfileItem from "./ProfileItem";
import OtherProfiles from "./OtherProfiles";
import SwitchProfileDialog from "./SwitchProfileDialog";
import { commonStyles, profileScreenStyles } from "./Styles";
import { selectors as profileSelectors } from "../../../redux/ProfileSlice";
import { genTestId } from "../../../helper/AppHelper";
import NavigationService from "../../../navigation/NavigationService";
import Routers from "../../../constants/Routers";

export default function ManageProfileScreen() {
    const { t } = useTranslation();

    const currentInUseProfile = useSelector(profileSelectors.selectCurrentInUseProfile);
    const otherProfiles = useSelector(profileSelectors.selectSortedByDisplayNameOtherProfileList);
    const [showSwitchProfile, setShowSwitchProfile] = useState(false);

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
                        profile={currentInUseProfile}
                        onPress={() => {
                            NavigationService.navigate(Routers.profileDetails, {
                                profileId: currentInUseProfile.profileId,
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
                            activeProfile={currentInUseProfile}
                        />
                    )}
                </Page>
            </ScrollView>
        </Page>
    );
}
