/* eslint-disable no-param-reassign */
import { createSelector, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Profile } from "../types/profile";
import profileSelectors from "./ProfileSelector";

interface InitialState {
    activeProfileID: string | null;
    profileList: Profile[];
}

const initialState: InitialState = {
    activeProfileID: null,
    profileList: [],
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        setProfileList(state, action: PayloadAction<Profile[]>) {
            const { payload } = action;

            state.profileList = payload;
        },
        addProfileToProfileList(state, action: PayloadAction<Profile>) {
            const { payload } = action;

            state.profileList = [...state.profileList, payload];
        },
        /** @deprecated */
        updateActiveProfileByID(state, { payload }) {
            const newList = state.profileList.map((item) => {
                Object.assign(item, { isActive: item.profileId === payload });
                return item;
            });
            Object.assign(state, { profileList: newList });
        },
        updateActiveProfileID(state, action: PayloadAction<string>) {
            const { payload } = action;

            state.activeProfileID = payload;
        },
    },
});

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

const selectors = {
    getActiveProfile,
    getOtherProfiles,
    ...profileSelectors,
};

const { actions, reducer } = profileSlice;

export const { setProfileList, updateActiveProfileByID } = profileSlice.actions;
export { actions, selectors };
export default reducer;
