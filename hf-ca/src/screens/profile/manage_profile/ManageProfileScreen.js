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

export default function ManageProfileScreen({ route }) {
    const { params } = route;
    const isForceRefresh = params?.isForceRefresh || false;

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const profileListRequestStatus = useSelector(profileSelectors.selectProfileListRequestStatus);
    const currentInUseProfile = useSelector(profileSelectors.selectCurrentInUseProfile);
    const otherProfiles = useSelector(profileSelectors.selectSortedByDisplayNameOtherProfileList);

    console.log(`current profileListRequestStatus::${profileListRequestStatus}`);

    useFocus(() => {
        console.log("start auto refresh profile list");
        dispatch(ProfileThunk.refreshProfileList({ isForce: isForceRefresh }));
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
                    <View style={profileScreenStyles.horizontalContainer}>
                        <Text style={commonStyles.subTitle}> {t("profile.currentlyInUse")}</Text>
                        {otherProfiles.length > 0 && profileListRequestStatus != REQUEST_STATUS.pending && (
                            <Pressable
                                onPress={() => {
                                    DialogHelper.showCustomDialog({
                                        renderDialogContent: () => (
                                            <SwitchProfileDialog hideDialog={() => NavigationService.back()} />
                                        ),
                                    });
                                }}
                                testID={genTestId("switchProfile")}
                            >
                                <Text style={profileScreenStyles.switchProfile}>{t("profile.switchProfile")}</Text>
                            </Pressable>
                        )}
                    </View>
                    {profileListRequestStatus == REQUEST_STATUS.pending ? (
                        <ProfileItemLoading />
                    ) : (
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
                    )}
                    <OtherProfiles
                        otherProfiles={otherProfiles}
                        isLoading={profileListRequestStatus == REQUEST_STATUS.pending}
                    />
                </View>
            </ScrollView>
        </Page>
    );
}
