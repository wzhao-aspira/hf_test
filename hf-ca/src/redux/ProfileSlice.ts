/* eslint-disable no-param-reassign */
import { createSelector, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Profile } from "../types/profile";
import profileSelectors from "./ProfileSelector";

interface InitialState {
    currentInUseProfileID: string | null;
    primaryProfileID: string | null;
    profilesIDs: string[] | null;
    profileList: Profile[];
}

const initialState: InitialState = {
    currentInUseProfileID: null,
    primaryProfileID: null,
    profilesIDs: null,
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
        updateCurrentInUseProfileID(state, action: PayloadAction<string>) {
            const { payload } = action;

            state.currentInUseProfileID = payload;
        },
        updatePrimaryProfileID(state, action: PayloadAction<string>) {
            const { payload } = action;

            state.primaryProfileID = payload;
        },
        updateProfileIDs(state, action: PayloadAction<string[]>) {
            const { payload } = action;

            state.profilesIDs = payload || null;
        },
    },
});

const selectProfile = (state) => state.profile;

export const getProfileDetailsById = (profileId) =>
    createSelector(selectProfile, (profile) => profile.profileList.find((item) => item.profileId === profileId) || {});

const selectors = profileSelectors;

const { actions, reducer } = profileSlice;

export const { setProfileList } = profileSlice.actions;
export { actions, selectors };
export default reducer;
