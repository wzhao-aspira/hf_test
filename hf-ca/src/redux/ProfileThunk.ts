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
    getProfileSummaryFromDB,
    updateProfileDetailToDB,
    updateProfileSummaryToDB,
} from "../db";
import { getProfileListUpdateTime, setProfileListUpdateTime } from "../helper/AutoRefreshHelper";
import { REQUEST_STATUS } from "../constants/Constants";
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

    const profileList: Profile[] = result?.map((item) => {
        if (item.isPrimary) {
            primaryProfileId = item.customerId;
        }
        profileListIDs.push(item.customerId);
        const profile = formateProfile(item);
        return profile;
    });
    return { profileListIDs, primaryProfileId, profileList };
};

const showProfileDialog = (message, okAction) =>
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
            updateProfileSummaryToDB(result);
            setProfileListUpdateTime();
        } else {
            const dbResult = await getProfileSummaryFromDB();
            if (dbResult.success) {
                result = dbResult.profileList;
            }

            console.log(`db profile list:${JSON.stringify(result)}`);
        }

        const { profileList, primaryProfileId, profileListIDs } = getProfileData(result);
        const currentInUseProfileID = await getCurrentInUseProfileID(username);

        if (currentInUseProfileID && !includes(profileListIDs, currentInUseProfileID)) {
            dispatch(profileActions.updateCiuProfileIsInactive(true));
        }
        if (currentInUseProfileID && includes(profileListIDs, currentInUseProfileID)) {
            dispatch(profileActions.updateCurrentInUseProfileID(currentInUseProfileID));
        }
        if (!currentInUseProfileID && primaryProfileId) {
            await updateCurrentInUseProfileID(username, primaryProfileId);
            dispatch(profileActions.updateCurrentInUseProfileID(primaryProfileId));
        }

        dispatch(profileActions.updatePrimaryProfileID(primaryProfileId));
        dispatch(profileActions.updateProfileIDs(profileListIDs));
        dispatch(profileActions.setProfileList(profileList));

        return { success: true, primaryProfileId };
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
            dispatch(getLicense({ isForce: true, searchParams: { activeProfileId: profileID } }));
        } catch (error) {
            console.log("switch profile error:", error);
        }
    };

const updateProfileData = (result) => async (dispatch) => {
    const dbResult = await updateProfileSummaryToDB(result);
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

const getProfileListChangeStatus =
    ({
        showGlobalLoading = false,
        showCIUChangedMsg = false,
        showListChangedMsg = false,
        updateProfileWithNewData = false,
    } = {}) =>
    async (dispatch, getState) => {
        const rootState = getState();
        const user = appSelectors.selectUser(rootState);
        const { username } = user;

        const currentProfileIds = profileSelector.selectProfileIDs(rootState);
        const previousPrimaryProfileID = profileSelector.selectPrimaryProfileID(rootState);
        const currentInUseProfileID = profileSelector.selectCurrentInUseProfileID(rootState);

        const profileResponse = await handleError(getProfileList(), { dispatch, showLoading: showGlobalLoading });
        if (!profileResponse.success) {
            return profileResponse;
        }

        const { result } = profileResponse.data.data;
        const { primaryProfileId, profileListIDs } = getProfileData(result);
        const differenceProfiles = xor(currentProfileIds, profileListIDs);
        console.log(`The difference profile ids are:[${differenceProfiles}]`);

        const response = {
            success: true,
            listChanged: false,
            primaryIsInactivated: false,
            ciuIsInactivated: false,
            profiles: result,
        };

        const ciuIsInactivated = !includes(profileListIDs, currentInUseProfileID);
        const primaryIsInactivated = !includes(profileListIDs, previousPrimaryProfileID);
        const noPrimaryProfile = primaryIsInactivated && !primaryProfileId;

        response.listChanged = !isEmpty(differenceProfiles);
        response.ciuIsInactivated = ciuIsInactivated;
        response.primaryIsInactivated = primaryIsInactivated;

        if (noPrimaryProfile) {
            showProfileDialog(i18n.t("profile.primaryChanged"), () => {
                NavigationService.navigate(Routers.addIndividualProfile, {
                    mobileAccount: { userID: username },
                    isAddPrimaryProfile: true,
                    noBackBtn: true,
                });
                dispatch(updateProfileData(result));
            });
            return response;
        }

        const primaryChanged = primaryIsInactivated && primaryProfileId;
        if ((showCIUChangedMsg && ciuIsInactivated) || primaryChanged) {
            const message = primaryChanged
                ? i18n.t("profile.profileListUpdatedAndRefresh")
                : i18n.t("profile.currentInUseInactiveMsg");

            showProfileDialog(message, () => {
                dispatch(switchCurrentInUseProfile(primaryProfileId));
                dispatch(updateProfileData(result));
                NavigationService.navigate(Routers.manageProfile);
            });
            return response;
        }

        if (!isEmpty(differenceProfiles)) {
            if (showListChangedMsg) {
                showProfileDialog(i18n.t("profile.profileListUpdatedAndRefresh"), () => {
                    dispatch(updateProfileData(result));
                });
            }
        }

        if (updateProfileWithNewData) {
            dispatch(updateProfileData(result));
        }
        return response;
    };

const refreshProfileList =
    ({ isForce = false, showCIUChangedMsg = true, showGlobalLoading = false } = {}): AppThunk =>
    async (dispatch, getState) => {
        console.log(`refresh profile list isForce:${isForce}`);
        const rootState = getState();
        const { profileListRequestStatus } = rootState.profile;

        if (profileListRequestStatus == REQUEST_STATUS.pending) {
            return {};
        }
        // kill app and reopen, the getProfileListUpdateTime is null and checkNeedAutoRefreshData(getProfileListUpdateTime()) is true
        console.log("checkNeedAutoRefreshData", checkNeedAutoRefreshData(getProfileListUpdateTime()));
        if (!isForce && checkNeedAutoRefreshData(getProfileListUpdateTime()) == false) {
            return {};
        }
        dispatch(profileActions.setProfileListRequestStatus(REQUEST_STATUS.pending));
        const response = await dispatch(
            getProfileListChangeStatus({ showGlobalLoading, showCIUChangedMsg, updateProfileWithNewData: true })
        );
        if (!response.success) {
            dispatch(profileActions.setProfileListRequestStatus(REQUEST_STATUS.rejected));
        } else {
            dispatch(profileActions.setProfileListRequestStatus(REQUEST_STATUS.fulfilled));
        }

        return response;
    };

const initProfileDetails = (profileId) => async (dispatch) => {
    let result;
    const networkErrorByDialog = false;
    const response = await handleError(getProfileDetailsById(profileId), { dispatch, networkErrorByDialog });
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
        if (!result) {
            result.noCacheData = true;
        }
    }

    if (isEmpty(result)) {
        return;
    }

    const formattedProfile = formateProfile(result);
    dispatch(profileActions.updateProfileDetailsById(formattedProfile));
};

export default {
    initAddProfileCommonData,
    initProfile,
    switchCurrentInUseProfile,
    refreshProfileList,
    updateProfileData,
    initProfileDetails,
    getProfileListChangeStatus,
};
