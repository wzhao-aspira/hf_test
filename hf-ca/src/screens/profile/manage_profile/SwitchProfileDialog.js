import { View, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { DialogWrapper } from "../../../components/Dialog";
import { commonStyles, dialogStyles } from "./Styles";
import ProfileItem from "./ProfileItem";
import { selectors as profileSelectors } from "../../../redux/ProfileSlice";
import profileThunkActions from "../../../redux/ProfileThunk";
// import { getSwitchStatus } from "../../../services/ProfileService";
// import { selectUsername } from "../../../redux/AppSlice";
// import DialogHelper from "../../../helper/DialogHelper";
import NavigationService from "../../../navigation/NavigationService";

export default function SwitchProfileDialog({ hideDialog }) {
    const dispatch = useDispatch();
    const currentInUseProfile = useSelector(profileSelectors.selectCurrentInUseProfile);
    const otherProfiles = useSelector(profileSelectors.selectSortedByDisplayNameOtherProfileList);
    // const userID = useSelector(selectUsername);

    const switchProfileCallback = async () => {
        hideDialog();
        // dispatch(profileThunkActions.initProfile());
    };

    const handleSwitch = async (profileId) => {
        // TODO: get profile list from api
        // const switchStatus = await getSwitchStatus(userID, profileId);
        // if (switchStatus.error) {
        //     return;
        // }
        // if (!switchStatus.canSwitch) {
        //     DialogHelper.showSimpleDialog({
        //         title: "common.reminder",
        //         message: "errMsg.profileStatusChanged",
        //         okText: "common.gotIt",
        //         withModal: true,
        //         okAction: () => {
        //             switchProfileCallback();
        //         },
        //     });
        //     return;
        // }

        dispatch(profileThunkActions.switchCurrentInUseProfile(profileId)).then(() => {
            switchProfileCallback();
        });
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
