import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./Store";
import { IdentityTypeVM } from "../network/generated";
import { isAssociatedProfile } from "../services/ProfileService";
import { Profile } from "../types/profile";

const selectProfileState = (state: RootState) => state.profile;

const selectProfileListRequestStatus = createSelector(selectProfileState, (state) => state.profileListRequestStatus);

const selectYouthIdentityOwners = createSelector(selectProfileState, (state) => state.youthIdentityOwners);
const selectIdentityTypes = (selectOne: IdentityTypeVM) =>
    createSelector(selectProfileState, (state) => {
        const { identityTypes } = state;
        if (identityTypes) {
            return {
                adultOrYouth: [selectOne, ...identityTypes.adultOrYouth],
                parentOrGuardian: [selectOne, ...identityTypes.parentOrGuardian],
            };
        }
        return {
            adultOrYouth: [selectOne],
            parentOrGuardian: [selectOne],
        };
    });
const selectCountries = createSelector(selectProfileState, (state) => state.countries);
const selectStates = createSelector(selectProfileState, (state) => state.states);
const selectCountriesStates = createSelector(selectProfileState, (state) => {
    return {
        countries: state.countries || [],
        states: state.states || [],
    };
});

const selectProfileIDs = createSelector(selectProfileState, (state) => state.profilesIDs);

const selectPrimaryProfileID = createSelector(selectProfileState, (profileState) => profileState.primaryProfileID);

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

const selectCurrentInUseProfile = createSelector(
    selectCurrentInUseProfileID,
    selectProfileList,
    (currentInUseProfileID, profileList) => {
        return profileList?.find((profile) => {
            return profile.profileId === currentInUseProfileID;
        });
    }
);

const selectCurrentProfileFirstName = createSelector(selectCurrentInUseProfile, (profile: Profile) => {
    if (isAssociatedProfile(profile.profileType)) {
        return "";
    }
    return profile.displayName?.split(" ")[0];
});

const selectPrimaryProfile = createSelector(
    selectPrimaryProfileID,
    selectProfileList,
    (primaryProfileID, profileList) => {
        return profileList?.find((profile) => {
            return profile.profileId === primaryProfileID;
        });
    }
);

const selectOtherProfileList = createSelector(
    selectProfileList,
    selectOtherProfileIDs,
    (profileList, otherProfileIDs) => {
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

const selectOtherProfileListWithoutPrimary = createSelector(
    selectSortedByDisplayNameOtherProfileList,
    selectPrimaryProfileID,
    (otherProfileList, primaryProfileID) => {
        return otherProfileList.filter((profile) => profile.profileId !== primaryProfileID);
    }
);

const selectProfileDetailsById = (profileId) =>
    createSelector(selectProfileList, (profileList) => profileList.find((item) => item.profileId === profileId) || {});

const residentMethodTypes = createSelector(selectProfileState, (state) => state.residentMethodTypes);
const selectResidentMethodTypeById = (residentMethodTypeId) =>
    createSelector(residentMethodTypes, (residentMethodTypeList) => {
        return residentMethodTypeList?.find((item) => item.residentMethodTypeId === residentMethodTypeId) || {};
    });

const selectCiuIsInactive = createSelector(selectProfileState, (profile) => profile.ciuProfileIsInactive);

const selectIsPrimaryOrCiuProfile = (profileId) =>
    createSelector(
        selectCurrentInUseProfileID,
        selectPrimaryProfileID,
        (ciuProfileId, primaryProfileId) => profileId === ciuProfileId || profileId === primaryProfileId
    );

const selectAssociatedProfiles = createSelector(selectProfileList, (profileList: Profile[]) =>
    profileList.filter((profile) => isAssociatedProfile(profile.profileType))
);

const selectIndividualProfiles = createSelector(selectProfileState, (state) => {
    const { individualProfiles } = state;
    if (individualProfiles?.length <= 0) return [];
    return individualProfiles;
});

const selectors = {
    selectProfileListRequestStatus,
    selectYouthIdentityOwners,
    selectIdentityTypes,
    selectCountries,
    selectStates,
    selectCountriesStates,
    selectCurrentInUseProfile,
    selectCurrentInUseProfileID,
    selectPrimaryProfileID,
    selectPrimaryProfile,
    selectProfileIDs,
    selectProfileDetailsById,
    selectResidentMethodTypeById,
    selectSortedByDisplayNameOtherProfileList,
    selectCiuIsInactive,
    selectOtherProfileListWithoutPrimary,
    selectCurrentProfileFirstName,
    selectIsPrimaryOrCiuProfile,
    selectAssociatedProfiles,
    selectIndividualProfiles,
};

export default selectors;
