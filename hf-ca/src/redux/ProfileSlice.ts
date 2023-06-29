import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
    profileList: [],
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        setProfileList(state, action) {
            Object.assign(state, { profileList: action?.payload });
        },
        updateActiveProfileByID(state, { payload }) {
            const newList = state.profileList.map((item) => {
                Object.assign(item, { isActive: item.profileId === payload });
                return item;
            });
            Object.assign(state, { profileList: newList });
        },
    },
});

export const { setProfileList, updateActiveProfileByID } = profileSlice.actions;

const selectProfile = (state) => state.profile;
export const getActiveProfile = createSelector(
    selectProfile,
    (profile) => profile.profileList.find((item) => item.isActive) || {}
);
export const getOtherProfiles = createSelector(selectProfile, (profile) =>
    profile.profileList.filter((item) => !item.isActive)
);
export const getProfileDetailsById = (profileId) =>
    createSelector(selectProfile, (profile) => profile.profileList.find((item) => item.profileId === profileId) || {});

const profileReducer = profileSlice.reducer;
export default profileReducer;
