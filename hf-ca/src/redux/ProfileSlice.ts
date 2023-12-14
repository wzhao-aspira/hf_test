/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Profile } from "../types/profile";
import profileSelectors from "./ProfileSelector";
import { CountryVM, IdentityTypesVM, ResidentMethodTypeVM, StateVM, YouthIdentityOwnerVM } from "../network/generated";
import { REQUEST_STATUS } from "../constants/Constants";
import { isIndividualProfile } from "../services/ProfileService";

interface InitialState {
    youthIdentityOwners: YouthIdentityOwnerVM[];
    identityTypes: IdentityTypesVM;
    countries: CountryVM[];
    states: StateVM[];
    residentMethodTypes: ResidentMethodTypeVM[];
    currentInUseProfileID: string | null;
    primaryProfileID: string | null;
    profilesIDs: string[] | null;
    profileList: Profile[];
    profileListRequestStatus: string;
    profileDetailsRequestStatus: string;
    ciuProfileIsInactive: boolean;
    individualProfiles: Profile[];
    noDetailCacheData: boolean;
}

const initialState: InitialState = {
    youthIdentityOwners: null,
    identityTypes: null,
    countries: null,
    states: null,
    residentMethodTypes: null,
    currentInUseProfileID: null,
    primaryProfileID: null,
    profilesIDs: null,
    profileList: [],
    profileListRequestStatus: REQUEST_STATUS.idle,
    profileDetailsRequestStatus: REQUEST_STATUS.idle,
    ciuProfileIsInactive: false,
    individualProfiles: [],
    noDetailCacheData: false,
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        setProfileListRequestStatus(state, action: PayloadAction<string>) {
            const { payload } = action;
            state.profileListRequestStatus = payload;
            state.profileDetailsRequestStatus = initialState.profileDetailsRequestStatus;
        },
        setProfileDetailsRequestStatus(state, action: PayloadAction<string>) {
            const { payload } = action;
            state.profileDetailsRequestStatus = payload;
        },
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
        setResidentMethodTypes(state, action: PayloadAction<ResidentMethodTypeVM[]>) {
            const { payload } = action;
            state.residentMethodTypes = payload;
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
        updateProfileDetailsById: (state, action: PayloadAction<Profile>) => {
            const profile = action.payload;
            const profileIndex = state.profileList.findIndex((item) => item.profileId === profile.profileId);
            state.profileList[profileIndex] = profile;
        },
        updateProfileDetailsNoCacheData: (state, action: PayloadAction<boolean>) => {
            state.noDetailCacheData = action.payload;
        },
        setIndividualProfiles(state, action: PayloadAction<Profile[]>) {
            const profiles = action.payload || [];
            const individualProfiles = profiles
                .filter((profile) => isIndividualProfile(profile.profileType))
                .sort((profileA, profileB) => {
                    return profileA.displayName.localeCompare(profileB.displayName);
                });
            state.individualProfiles = individualProfiles;
        },
    },
});

const selectors = profileSelectors;

const { actions, reducer } = profileSlice;

export const { setProfileList } = profileSlice.actions;
export { actions, selectors };
export default reducer;
