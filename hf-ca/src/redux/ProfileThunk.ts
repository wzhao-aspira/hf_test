import { isEmpty, xor, includes } from "lodash";
import type { AppThunk } from "./Store";
import {
    getCountries,
    getIdentityTypes,
    getStates,
    getYouthIdentityOwners,
    updateCurrentInUseProfileID,
    getCurrentInUseProfileID,
    getProfileList,
    getProfileDetailsById,
} from "../services/ProfileService";
import { actions as profileActions, selectors as profileSelector } from "./ProfileSlice";
import { selectors as appSelectors } from "./AppSlice";
import { getLicense } from "./LicenseSlice";
import { handleError } from "../network/APIUtil";
import {
    getProfileDetailFromDB,
    getProfileListFromDB,
    updateProfileDetailToDB,
    updateProfileListToDB,
} from "../helper/DBHelper";
import { getProfileListUpdateTime, setProfileListUpdateTime } from "../helper/AutoRefreshHelper";
import { PROFILE_TYPE_IDS, REQUEST_STATUS } from "../constants/Constants";
import { checkNeedAutoRefreshData } from "../utils/GenUtil";
import DialogHelper from "../helper/DialogHelper";
import i18n from "../localization/i18n";
import NavigationService from "../navigation/NavigationService";
import Routers from "../constants/Routers";
import { Profile } from "../types/profile";

const formateProfile = (profile) => {
    const { customerId, name, customerTypeId, goidNumber, goid, ...otherProps } = profile;
    return {
        profileId: customerId,
        displayName: name,
        profileType: customerTypeId,
        goIDNumber: goidNumber || goid,
        ...otherProps,
    };
};

const getProfileData = (result = []) => {
    const profileListIDs: string[] = [];
    let primaryProfileId: string;

    const profileList: Profile[] = result.map((item) => {
        if (item.isPrimary) {
            primaryProfileId = item.customerId;
        }
        profileListIDs.push(item.customerId);
        const profile = formateProfile(item);
        return profile;
    });
    return { profileListIDs, primaryProfileId, profileList };
};

const showListChangedDialog = (message, okAction) =>
    DialogHelper.showSimpleDialog({
        title: i18n.t("common.reminder"),
        message,
        okText: i18n.t("common.gotIt"),
        okAction: () => okAction(),
    });

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

const initProfile =
    (isRemote = true): AppThunk =>
    async (dispatch, getState) => {
        const rootState = getState();
        const userState = appSelectors.selectUser(rootState);

        const { username } = userState;

        let result = null;
        if (isRemote) {
            const response = await handleError(getProfileList(), { dispatch, showLoading: true });
            if (!response.success) {
                return response;
            }

            result = response?.data?.data?.result;
            console.log(`fetch profile list:${JSON.stringify(result)}`);
            updateProfileListToDB(result);
            setProfileListUpdateTime();
        } else {
            const dbResult = await getProfileListFromDB();
            if (dbResult.success) {
                result = dbResult.profileList;
            }

            console.log(`db profile list:${JSON.stringify(result)}`);
        }

        const { profileList, primaryProfileId, profileListIDs } = getProfileData(result);
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
            console.log("switch profile error:", error);
        }
    };

const refreshProfiles = (result) => async (dispatch) => {
    // update database
    const dbResult = await updateProfileListToDB(result);
    if (dbResult.success) {
        setProfileListUpdateTime();
    } else {
        console.log("update profile list db error");
        return;
    }
    const { profileList, primaryProfileId, profileListIDs } = getProfileData(result);
    dispatch(profileActions.updatePrimaryProfileID(primaryProfileId));
    dispatch(profileActions.updateProfileIDs(profileListIDs));
    dispatch(profileActions.setProfileList(profileList));
    dispatch(profileActions.setProfileListRequestStatus(REQUEST_STATUS.fulfilled));
};

const refreshProfileList =
    ({ isForce = false, showListChangedMsg = false, showGlobalLoading = false } = {}): AppThunk =>
    async (dispatch, getState) => {
        console.log(`refresh profile list isForce:${isForce}`);
        const rootState = getState();
        const { profileListRequestStatus } = rootState.profile;
        const currentProfileIds = profileSelector.selectProfileIDs(rootState);
        const userState = appSelectors.selectUser(rootState);
        const { username } = userState;
        const currentInUseProfileID = await getCurrentInUseProfileID(username);

        if (profileListRequestStatus == REQUEST_STATUS.pending) {
            return { listChanged: false };
        }

        if (!isForce && checkNeedAutoRefreshData(getProfileListUpdateTime()) == false) {
            return { listChanged: false };
        }

        // dispatch loading start
        dispatch(profileActions.setProfileListRequestStatus(REQUEST_STATUS.pending));
        const response = await handleError(getProfileList(), { dispatch, showLoading: showGlobalLoading });
        // dispatch loading end
        if (!response.success) {
            dispatch(profileActions.setProfileListRequestStatus(REQUEST_STATUS.rejected));
            return response;
        }
        const result = response?.data?.data?.result;
        const { primaryProfileId, profileListIDs } = getProfileData(result);
        const differenceProfiles = xor(currentProfileIds, profileListIDs);
        console.log(`The difference profile ids are:[${differenceProfiles}]`);

        if (!isEmpty(differenceProfiles)) {
            const refreshCallback = (resetCurrentInUseProfile = false) => {
                if (resetCurrentInUseProfile) {
                    dispatch(switchCurrentInUseProfile(primaryProfileId));
                }
                dispatch(refreshProfiles(result));
                NavigationService.navigate(Routers.manageProfile);
            };

            if (!includes(profileListIDs, currentInUseProfileID)) {
                showListChangedDialog(i18n.t("profile.currentInUseInactiveMsg"), () => refreshCallback(true));
            } else if (showListChangedMsg) {
                showListChangedDialog(i18n.t("profile.profileListChanged"), refreshCallback);
            } else {
                refreshCallback();
            }
            return { listChanged: true };
        }

        dispatch(refreshProfiles(result));
        return { listChanged: false };
    };

const initProfileDetails = (profileId) => async (dispatch, getState) => {
    let result;
    const rootState = getState();
    const { profileList } = rootState.profile;

    const response = await handleError(getProfileDetailsById(profileId), { dispatch });
    if (response.success) {
        result = response.data.data.result;
        if (!isEmpty(result)) {
            updateProfileDetailToDB(result);
        }
    } else {
        const dbResult = await getProfileDetailFromDB(profileId);
        if (dbResult.success) {
            result = dbResult.profile;
        }
    }

    if (isEmpty(result)) {
        return;
    }

    const formattedProfile = formateProfile(result);
    if (formattedProfile.profileType === PROFILE_TYPE_IDS.vessel) {
        const owner = profileList.find((item) => item.profileId === formattedProfile.ownerId);
        formattedProfile.ownerName = owner.displayName;
    }
    dispatch(profileActions.updateProfileDetailsById(formattedProfile));
};

export default {
    initAddProfileCommonData,
    initProfile,
    switchCurrentInUseProfile,
    refreshProfileList,
    refreshProfiles,
    initProfileDetails,
};
