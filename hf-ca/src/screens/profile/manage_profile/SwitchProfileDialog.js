import { View, ScrollView, Text, Pressable } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { t } from "i18next";
import { faPlus } from "@fortawesome/pro-regular-svg-icons/faPlus";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { DialogWrapper } from "../../../components/Dialog";
import { commonStyles, dialogStyles, primaryProfileInactiveStyles } from "./Styles";
import ProfileItem from "./ProfileItem";
import { selectors as profileSelectors } from "../../../redux/ProfileSlice";
import profileThunkActions from "../../../redux/ProfileThunk";
import NavigationService from "../../../navigation/NavigationService";
import DialogHelper from "../../../helper/DialogHelper";
import { selectors as appSelectors } from "../../../redux/AppSlice";
import Routers from "../../../constants/Routers";
import AppTheme from "../../../assets/_default/AppTheme";
import { genTestId } from "../../../helper/AppHelper";
import { handleError } from "../../../network/APIUtil";
import { goToAddNewPrimaryProfilePage, switchToPrimary } from "../../../services/ProfileService";

function AddPrimaryProfile({ currentRoute }) {
    const userID = useSelector(appSelectors.selectUsername);
    return (
        <Pressable
            onPress={() => {
                goToAddNewPrimaryProfilePage(userID, currentRoute);
            }}
            testID={genTestId("addPrimaryProfile")}
        >
            <View style={dialogStyles.profileItemContainer}>
                <View style={commonStyles.profileShortNameContainer}>
                    <FontAwesomeIcon icon={faPlus} size={24} color={AppTheme.colors.primary_2} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={commonStyles.profileDisplayName}>{t("profile.addNewPrimaryProfile")}</Text>
                </View>
            </View>
        </Pressable>
    );
}

export default function SwitchProfileDialog({ hideDialog, postProcess, isSwitchToPrimary, currentRoute }) {
    const dispatch = useDispatch();
    const currentInUseProfile = useSelector(profileSelectors.selectCurrentInUseProfile);
    const otherProfiles = useSelector(profileSelectors.selectSortedByDisplayNameOtherProfileList);
    const individualProfiles = useSelector(profileSelectors.selectIndividualProfiles);

    const switchToProfiles = isSwitchToPrimary ? individualProfiles : otherProfiles;

    const switchProfileCallback = async (showUpdatedDialog) => {
        console.log("SwitchProfileDialog - switchProfileCallback - refreshProfileList after switch profile");
        const listResponse = await dispatch(profileThunkActions.refreshProfileList({ isForce: true }));
        if (listResponse.primaryIsInactivated || listResponse.ciuIsInactivated || listResponse.needCRSSVerify) {
            return;
        }
        if (listResponse.listChanged && showUpdatedDialog) {
            DialogHelper.showSimpleDialog({
                title: "common.reminder",
                message: "profile.profileListUpdated",
                okText: "common.gotIt",
            });
        }
    };

    const switchToOthers = async (profileId) => {
        console.log("SwitchProfileDialog - switchToOthers - getProfileListChangeStatus before switch profile");
        const response = await dispatch(
            profileThunkActions.getProfileListChangeStatus({ showCRSSVerifyMsg: false, needCacheLicense: false })
        );
        // if network error, user can switch the profile, other api error will block switch profile
        if (!response.success && response.isNetworkError) {
            await dispatch(profileThunkActions.switchCurrentInUseProfile(profileId));
            return;
        }

        if (!response.success || response.primaryIsInactivated) {
            return;
        }

        const profile = response.profiles.find((item) => item.customerId === profileId);
        if (profile) {
            await dispatch(profileThunkActions.switchCurrentInUseProfile(profileId));
            switchProfileCallback(true);
        } else {
            DialogHelper.showSimpleDialog({
                title: "common.reminder",
                message: "profile.profileListUpdatedAndRefresh",
                okText: "common.gotIt",
                okAction: () => switchProfileCallback(),
            });
        }
    };

    const handleSwitch = async (profileId) => {
        try {
            hideDialog();
            if (isSwitchToPrimary) {
                const response = await handleError(switchToPrimary(profileId), { dispatch, showLoading: true });
                if (response.success) {
                    NavigationService.navigate(Routers.manageProfile);
                    dispatch(profileThunkActions.refreshProfileList({ isForce: true }));
                }
            } else {
                await switchToOthers(profileId);
                if (postProcess) {
                    postProcess();
                }
            }
        } catch (error) {
            console.log("switch error", error);
        }
    };

    return (
        <DialogWrapper
            closeModal={() => {
                NavigationService.back();
            }}
        >
            <View style={dialogStyles.switchProfileContainer}>
                {isSwitchToPrimary ? (
                    <View>
                        <Text testID={genTestId("noPrimaryAvailable")} style={primaryProfileInactiveStyles.subTitle}>
                            {t("profile.noPrimaryAvailable")}
                        </Text>
                        <AddPrimaryProfile currentRoute={currentRoute} />
                    </View>
                ) : (
                    <ProfileItem
                        profile={currentInUseProfile}
                        onPress={hideDialog}
                        profileItemStyles={{
                            container: dialogStyles.profileItemContainer,
                            shortNameContainer: dialogStyles.shortNameContainer(20),
                        }}
                    />
                )}

                {isSwitchToPrimary ? (
                    <Text style={primaryProfileInactiveStyles.subTitle}>{t("profile.orSwitchTo")}</Text>
                ) : (
                    <View style={commonStyles.divider} />
                )}

                <ScrollView>
                    {switchToProfiles.map((profile) => {
                        return (
                            <ProfileItem
                                key={profile.profileId}
                                profile={profile}
                                onPress={() => {
                                    handleSwitch(profile.profileId);
                                }}
                                profileItemStyles={{
                                    container: dialogStyles.profileItemContainer,
                                    shortNameContainer: dialogStyles.shortNameContainer(18),
                                }}
                            />
                        );
                    })}
                </ScrollView>
            </View>
        </DialogWrapper>
    );
}
