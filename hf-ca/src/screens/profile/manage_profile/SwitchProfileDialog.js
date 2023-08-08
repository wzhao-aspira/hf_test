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
import { handleError } from "../../../network/APIUtil";
import { getProfileList } from "../../../services/ProfileService";

export default function SwitchProfileDialog({ hideDialog }) {
    const dispatch = useDispatch();
    const currentInUseProfile = useSelector(profileSelectors.selectCurrentInUseProfile);
    const otherProfiles = useSelector(profileSelectors.selectSortedByDisplayNameOtherProfileList);

    const switchProfileCallback = (result) => {
        dispatch(profileThunkActions.refreshProfiles(result));
        hideDialog();
    };

    const handleSwitch = async (profileId) => {
        dispatch(appActions.toggleIndicator(true));
        const response = await handleError(getProfileList(), { dispatch });

        if (response.success) {
            const { result } = response?.data?.data || [];
            const profile = result.find((item) => item.customerId === profileId);
            if (profile) {
                await dispatch(profileThunkActions.switchCurrentInUseProfile(profileId));
                switchProfileCallback(result);
            } else {
                DialogHelper.showSimpleDialog({
                    title: "common.reminder",
                    message: "profile.targetProfileIsInactive",
                    okText: "common.gotIt",
                    okAction: () => switchProfileCallback(result),
                });
            }
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
