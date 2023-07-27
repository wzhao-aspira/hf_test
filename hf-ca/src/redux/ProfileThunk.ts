import { isEmpty } from "lodash";
import type { AppThunk } from "./Store";
import {
    getCountries,
    getIdentityTypes,
    getStates,
    getYouthIdentityOwners,
    updateCurrentInUseProfileID,
    getCurrentInUseProfileID,
    getProfileList,
} from "../services/ProfileService";
import { actions as profileActions } from "./ProfileSlice";
import { selectors as appSelectors } from "./AppSlice";
import { getLicense } from "./LicenseSlice";
import { handleError } from "../network/APIUtil";

const initAddProfileCommonData = (): AppThunk => async (dispatch, getState) => {
    const state = getState();
    const shouldCountriesInitialize = isEmpty(state.profile.countries);
    if (shouldCountriesInitialize) {
        const countries = await handleError(getCountries(), { dispatch });
        dispatch(profileActions.setCountries(countries?.data));
    }

    const shouldStateInitialize = isEmpty(state.profile.states);
    if (shouldStateInitialize) {
        const states = await handleError(getStates(), { dispatch });
        dispatch(profileActions.setStates(states?.data));
    }

    const shouldIdentityTypesInitialize = isEmpty(state.profile.identityTypes);
    if (shouldIdentityTypesInitialize) {
        const identityTypes = await handleError(getIdentityTypes(), { dispatch });
        dispatch(profileActions.setIdentityTypes(identityTypes?.data));
    }

    const shouldYouthIdentityOwnersInitialize = isEmpty(state.profile.youthIdentityOwners);
    if (shouldYouthIdentityOwnersInitialize) {
        const youthIdentityOwners = await handleError(getYouthIdentityOwners(), { dispatch });
        dispatch(profileActions.setYouthIdentifyOwners(youthIdentityOwners?.data));
    }
};

const initProfile = (): AppThunk => async (dispatch, getState) => {
    const rootState = getState();
    const userState = appSelectors.selectUser(rootState);

    const { username } = userState;

    const profileListIDs: string[] = [];
    let primaryProfileId: string;

    const response = await handleError(getProfileList(), { dispatch, showLoading: true });
    if (!response.success) {
        return response;
    }

    const { result } = response.data.data;
    const profileList = result.map((item) => {
        if (item.isPrimary) {
            primaryProfileId = item.customerId;
        }

        profileListIDs.push(item.customerId);
        return {
            profileId: item.customerId,
            displayName: item.name,
            profileType: item.customerTypeId,
            goIDNumber: item.goid,
        };
    });

    const currentInUseProfileID = await getCurrentInUseProfileID(username);

    if (currentInUseProfileID) {
        dispatch(profileActions.updateCurrentInUseProfileID(currentInUseProfileID));
    } else {
        updateCurrentInUseProfileID(username, primaryProfileId);
        dispatch(profileActions.updateCurrentInUseProfileID(primaryProfileId));
    }

    dispatch(profileActions.updatePrimaryProfileID(primaryProfileId));
    dispatch(profileActions.updateProfileIDs(profileListIDs));
    dispatch(profileActions.setProfileList(profileList));

    return { success: true, data: profileList };
};

const switchCurrentInUseProfile =
    (profileID): AppThunk =>
    async (dispatch, getState) => {
        const rootState = getState();
        const userState = appSelectors.selectUser(rootState);

        const { username } = userState;

        try {
            await updateCurrentInUseProfileID(username, profileID);
            dispatch(profileActions.updateCurrentInUseProfileID(profileID));
            // force update license by profileID when switch profile
            /* @ts-ignore */
            dispatch(getLicense({ isForce: true, searchParams: { activeProfileId: profileID } }));
        } catch (error) {
            // TODO: handle error
        }
    };

export default {
    initAddProfileCommonData,
    initProfile,
    switchCurrentInUseProfile,
};
