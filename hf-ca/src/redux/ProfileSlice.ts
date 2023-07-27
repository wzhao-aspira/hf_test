/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Profile } from "../types/profile";
import profileSelectors from "./ProfileSelector";
import { CountryVM, IdentityTypesVM, StateVM, YouthIdentityOwnerVM } from "../network/generated";

interface InitialState {
    youthIdentityOwners: YouthIdentityOwnerVM[];
    identityTypes: IdentityTypesVM;
    countries: CountryVM[];
    states: StateVM[];
    currentInUseProfileID: string | null;
    primaryProfileID: string | null;
    profilesIDs: string[] | null;
    profileList: Profile[];
}

const initialState: InitialState = {
    youthIdentityOwners: null,
    identityTypes: null,
    countries: null,
    states: null,
    currentInUseProfileID: null,
    primaryProfileID: null,
    profilesIDs: null,
    profileList: [],
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        setYouthIdentifyOwners(state, action: PayloadAction<YouthIdentityOwnerVM[]>) {
            const { payload } = action;
            state.youthIdentityOwners = payload;
        },
        setIdentityTypes(state, action: PayloadAction<IdentityTypesVM>) {
            const { payload } = action;
            state.identityTypes = payload;
        },
        setCountries(state, action: PayloadAction<CountryVM[]>) {
            const { payload } = action;
            state.countries = payload;
        },
        setStates(state, action: PayloadAction<StateVM[]>) {
            const { payload } = action;
            state.states = payload;
        },
        setProfileList(state, action: PayloadAction<Profile[]>) {
            const { payload } = action;

            state.profileList = payload;
        },
        addProfileToProfileList(state, action: PayloadAction<Profile>) {
            const { payload } = action;

            state.profileList = [...state.profileList, payload];
        },
        updateCurrentInUseProfileID(state, action: PayloadAction<Profile["profileId"]>) {
            const { payload } = action;

            state.currentInUseProfileID = payload;
        },
        updatePrimaryProfileID(state, action: PayloadAction<Profile["profileId"]>) {
            const { payload } = action;

            state.primaryProfileID = payload;
        },
        updateProfileIDs(state, action: PayloadAction<Profile["profileId"][]>) {
            const { payload } = action;

            state.profilesIDs = payload || null;
        },
        restProfileToInitialState: () => initialState,
    },
});

const selectors = profileSelectors;

const { actions, reducer } = profileSlice;

export const { setProfileList } = profileSlice.actions;
export { actions, selectors };
export default reducer;
