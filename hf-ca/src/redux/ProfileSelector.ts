import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./Store";

const selectProfileState = (state: RootState) => state.profile;

const selectActiveProfileID = createSelector(selectProfileState, (state) => state.activeProfileID);

const selectProfileList = createSelector(selectProfileState, (state) => state.profileList);

const selectActiveProfile = createSelector(selectActiveProfileID, selectProfileList, (activeProfileID, profileList) => {
    return profileList.find((profile) => {
        return profile.profileId === activeProfileID;
    });
});

const selectors = {
    selectProfileList,
    selectActiveProfile,
};

export default selectors;
