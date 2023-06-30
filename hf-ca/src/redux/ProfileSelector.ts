import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./Store";
import { PROFILE_TYPE_IDS } from "../constants/Constants";

const selectProfileState = (state: RootState) => state.profile;

const selectProfileIDs = createSelector(selectProfileState, (state) => state.profilesIDs);

const selectCurrentInUseProfileID = createSelector(selectProfileState, (state) => state.currentInUseProfileID);

const selectOtherProfileIDs = createSelector(
    selectProfileIDs,
    selectCurrentInUseProfileID,
    (profileIDs, currentInUseProfileID) => {
        if (!profileIDs || profileIDs.length <= 0) return [];

        return profileIDs.filter((profileID) => profileID != currentInUseProfileID);
    }
);

const selectProfileList = createSelector(selectProfileState, (state) => state.profileList);

const selectProcessedProfileList = createSelector(selectProfileList, (profileList) => {
    return profileList.map((profile) => {
        // get vessel owner name
        if (profile.profileType === PROFILE_TYPE_IDS.vessel) {
            const ownerProfile = profileList.find((item) => item.profileId === profile.ownerId);
            const ownerName = ownerProfile.displayName;
            return { ...profile, ownerName };
        }

        // get adult associated profiles
        if (profile.profileType === PROFILE_TYPE_IDS.adult) {
            const associatedProfiles = profileList.filter((item) => item.ownerId === profile.profileId);
            if (associatedProfiles.length > 0)
                return {
                    ...profile,
                    associatedProfiles: associatedProfiles.map((item) => ({
                        profileId: item.profileId,
                        displayName: item.displayName,
                    })),
                };
        }

        return profile;
    });
});

const selectCurrentInUseProfile = createSelector(
    selectCurrentInUseProfileID,
    selectProcessedProfileList,
    (currentInUseProfileID, profileList) => {
        return profileList.find((profile) => {
            return profile.profileId === currentInUseProfileID;
        });
    }
);

const selectOtherProfileList = createSelector(
    selectProcessedProfileList,
    selectOtherProfileIDs,
    (profileList, otherProfileIDs) => {
        console.log({ profileList, otherProfileIDs });

        if (!otherProfileIDs || otherProfileIDs?.length <= 0) return [];

        return profileList.filter((profile) => otherProfileIDs.includes(profile.profileId));
    }
);

const selectSortedByDisplayNameOtherProfileList = createSelector(selectOtherProfileList, (otherProfileList) => {
    if (otherProfileList?.length <= 0) return [];

    return otherProfileList.sort((profileA, profileB) => {
        return profileA.displayName.localeCompare(profileB.displayName);
    });
});

const selectors = {
    selectCurrentInUseProfile,
    selectSortedByDisplayNameOtherProfileList,
};

export default selectors;
