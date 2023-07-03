import React from "react";
import { View, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Dialog } from "../../../components/Dialog";
import { commonStyles, dialogStyles } from "./Styles";
import ProfileItem from "./ProfileItem";
import { selectors as profileSelectors } from "../../../redux/ProfileSlice";
import profileThunkActions from "../../../redux/ProfileThunk";

export default function SwitchProfileDialog({ hideDialog }) {
    const dispatch = useDispatch();

    const currentInUseProfile = useSelector(profileSelectors.selectCurrentInUseProfile);
    const otherProfiles = useSelector(profileSelectors.selectSortedByDisplayNameOtherProfileList);

    return (
        <Dialog visible closeModal={hideDialog}>
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
                                    dispatch(profileThunkActions.switchCurrentInUseProfile(profile.profileId)).then(
                                        () => {
                                            hideDialog();
                                        }
                                    );
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
        </Dialog>
    );
}
