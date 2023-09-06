import { Pressable, ScrollView, Text, View, RefreshControl } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { selectors as profileSelectors } from "../../../redux/ProfileSlice";
import CommonHeader from "../../../components/CommonHeader";
import Page from "../../../components/Page";
import ProfileItem from "./ProfileItem";
import OtherProfiles from "./OtherProfiles";
import SwitchProfileDialog from "./SwitchProfileDialog";
import { commonStyles, profileScreenStyles } from "./Styles";
import { genTestId } from "../../../helper/AppHelper";
import NavigationService from "../../../navigation/NavigationService";
import Routers from "../../../constants/Routers";
import DialogHelper from "../../../helper/DialogHelper";
import ProfileThunk from "../../../redux/ProfileThunk";
import useFocus from "../../../hooks/useFocus";
import AppTheme from "../../../assets/_default/AppTheme";
import ProfileItemLoading from "./ProfileItemLoading";
import { REQUEST_STATUS } from "../../../constants/Constants";

function ProfileWithTitle({ isLoading, profile, showSwitchProfile, titleKey }) {
    const { t } = useTranslation();

    function handleSwitchClick() {
        DialogHelper.showCustomDialog({
            renderDialogContent: () => <SwitchProfileDialog hideDialog={() => NavigationService.back()} />,
        });
    }

    return (
        <View style={{ marginBottom: 36 }}>
            <View style={profileScreenStyles.horizontalContainer}>
                <Text style={commonStyles.subTitle}>{t(titleKey)}</Text>
                {showSwitchProfile && (
                    <Pressable onPress={handleSwitchClick} testID={genTestId("switchProfile")}>
                        <Text style={profileScreenStyles.switchProfile}>{t("profile.switchProfile")}</Text>
                    </Pressable>
                )}
            </View>

            {isLoading ? (
                <ProfileItemLoading />
            ) : (
                <ProfileItem
                    showGoToDetailsPageButton
                    profile={profile}
                    onPress={() => {
                        NavigationService.navigate(Routers.profileDetails, {
                            profileId: profile.profileId,
                        });
                    }}
                    profileItemStyles={{ container: commonStyles.profileContainer }}
                />
            )}
        </View>
    );
}

export default function ManageProfileScreen() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const profileListRequestStatus = useSelector(profileSelectors.selectProfileListRequestStatus);
    const currentInUseProfile = useSelector(profileSelectors.selectCurrentInUseProfile);
    const otherProfiles = useSelector(profileSelectors.selectSortedByDisplayNameOtherProfileList);
    const primaryProfile = useSelector(profileSelectors.selectPrimaryProfile);

    console.log(`current profileListRequestStatus::${profileListRequestStatus}`);

    useFocus(() => {
        console.log("manageProfile screen focus");
        dispatch(ProfileThunk.refreshProfileList());
    });

    const onRefresh = () => {
        dispatch(ProfileThunk.refreshProfileList({ isForce: true }));
    };

    return (
        <Page style={profileScreenStyles.container}>
            <CommonHeader title={t("profile.manageProfile")} />
            <ScrollView
                refreshControl={
                    <RefreshControl
                        colors={[AppTheme.colors.primary]}
                        tintColor={AppTheme.colors.primary}
                        refreshing={profileListRequestStatus == REQUEST_STATUS.pending}
                        onRefresh={onRefresh}
                    />
                }
            >
                <View style={profileScreenStyles.contentContainer}>
                    <ProfileWithTitle
                        isLoading={profileListRequestStatus == REQUEST_STATUS.pending}
                        profile={currentInUseProfile}
                        titleKey="profile.currentlyInUse"
                        showSwitchProfile={
                            otherProfiles.length > 0 && profileListRequestStatus != REQUEST_STATUS.pending
                        }
                    />

                    <ProfileWithTitle
                        isLoading={profileListRequestStatus == REQUEST_STATUS.pending}
                        profile={primaryProfile}
                        titleKey="profile.primaryProfile"
                    />

                    <OtherProfiles isLoading={profileListRequestStatus == REQUEST_STATUS.pending} />
                </View>
            </ScrollView>
        </Page>
    );
}
