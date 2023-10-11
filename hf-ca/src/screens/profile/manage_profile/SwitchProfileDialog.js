import { View, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { DialogWrapper } from "../../../components/Dialog";
import { commonStyles, dialogStyles } from "./Styles";
import ProfileItem from "./ProfileItem";
import { selectors as profileSelectors } from "../../../redux/ProfileSlice";
import profileThunkActions from "../../../redux/ProfileThunk";
import NavigationService from "../../../navigation/NavigationService";
import DialogHelper from "../../../helper/DialogHelper";
import { actions as appActions } from "../../../redux/AppSlice";
import Routers from "../../../constants/Routers";

export default function SwitchProfileDialog({ hideDialog }) {
    const dispatch = useDispatch();
    const currentInUseProfile = useSelector(profileSelectors.selectCurrentInUseProfile);
    const otherProfiles = useSelector(profileSelectors.selectSortedByDisplayNameOtherProfileList);

    const switchProfileCallback = async (showUpdatedDialog) => {
        NavigationService.navigate(Routers.manageProfile);
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

    const handleSwitch = async (profileId) => {
        hideDialog();
        dispatch(appActions.toggleIndicator(true));
        const response = await dispatch(profileThunkActions.getProfileListChangeStatus({ networkErrorByDialog: true }));
        if (!response.success || response.primaryIsInactivated || response.needCRSSVerify) {
            dispatch(appActions.toggleIndicator(false));
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

        dispatch(appActions.toggleIndicator(false));
    };

    return (
        <DialogWrapper
            closeModal={() => {
                NavigationService.back();
            }}
        >
            <View style={dialogStyles.switchProfileContainer}>
                <ProfileItem
                    profile={currentInUseProfile}
                    onPress={hideDialog}
                    profileItemStyles={{
                        container: dialogStyles.profileItemContainer,
                        shortNameContainer: dialogStyles.shortNameContainer(20),
                    }}
                />
                <View style={commonStyles.divider} />

                <ScrollView>
                    {otherProfiles.map((profile) => {
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
