import React from "react";
import { View, ScrollView } from "react-native";
import { useDispatch } from "react-redux";
import { Dialog } from "../../../components/Dialog";
import { commonStyles, dialogStyles } from "./Styles";
import ProfileItem from "./ProfileItem";
import { updateActiveProfileByID } from "../../../redux/ProfileSlice";

export default function SwitchProfileDialog({ closeModal, hideDialog, activeProfile, inactiveProfiles = [] }) {
    const dispatch = useDispatch();

    return (
        <Dialog visible closeModal={closeModal}>
            <View style={dialogStyles.switchProfileContainer}>
                <ProfileItem
                    profile={activeProfile}
                    onPress={hideDialog}
                    profileItemStyles={{
                        container: dialogStyles.profileItemContainer,
                        shortNameContainer: dialogStyles.shortNameContainer(20),
                    }}
                />
                <View style={commonStyles.divider} />

                <ScrollView>
                    {inactiveProfiles.map((profile) => {
                        return (
                            <ProfileItem
                                key={profile.profileId}
                                profile={profile}
                                onPress={() => {
                                    dispatch(updateActiveProfileByID(profile.profileId));
                                    hideDialog();
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
