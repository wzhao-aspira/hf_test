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
    getLatestCustomerList,
    getResidentMethodTypes,
    saveCustomerLicenseToDB,
    getCustomerLicenseFromDB,
} from "../services/ProfileService";
import { actions as profileActions, selectors as profileSelector } from "./ProfileSlice";
import { actions as appActions, selectors as appSelectors } from "./AppSlice";
import { handleError } from "../network/APIUtil";
import {
    getProfileDetailFromDB,
    getProfileSummaryFromDB,
    updateProfileDetailToDB,
    updateProfileSummaryToDB,
} from "../db";
import {
    getCurrentProfileDetailsUpdateTime,
    getProfileListUpdateTime,
    setCurrentProfileDetailsUpdateTime,
    setProfileListUpdateTime,
} from "../helper/AutoRefreshHelper";
import { KEY_CONSTANT, REQUEST_STATUS } from "../constants/Constants";
import { checkNeedAutoRefreshData } from "../utils/GenUtil";
import DialogHelper from "../helper/DialogHelper";
import i18n from "../localization/i18n";
import NavigationService from "../navigation/NavigationService";
import Routers from "../constants/Routers";
import { Profile } from "../types/profile";
import { actions as licenseActions } from "./LicenseSlice";
import { actions as preferencePointActions } from "./PreferencePointSlice";
import { retrieveItem, storeItem } from "../helper/StorageHelper";
import { getLicenseLastUpdateTimeDataFromDB } from "../services/LicenseService";

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
        okAction: () => setTimeout(() => okAction()),
    });

const initProfileCommonData = (): AppThunk => async (dispatch, getState) => {
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

const initResidentMethodTypes =
    ({ networkErrorByDialog = false } = {}): AppThunk =>
    async (dispatch, getState) => {
        const state = getState();
        const shouldResidentMethodTypesInitialize = isEmpty(state.profile.residentMethodTypes);
        if (shouldResidentMethodTypesInitialize) {
            const residentMethodTypes = await handleError(getResidentMethodTypes(), {
                dispatch,
                showError: false,
                networkErrorByDialog,
            });
            if (residentMethodTypes?.success) {
                await storeItem(KEY_CONSTANT.keyResidentMethodTypes, residentMethodTypes?.data);
                dispatch(profileActions.setResidentMethodTypes(residentMethodTypes?.data));
            } else {
                const residentMethodTypesData = await retrieveItem(KEY_CONSTANT.keyResidentMethodTypes);
                dispatch(profileActions.setResidentMethodTypes(residentMethodTypesData));
            }
        }
    };

const getCRSSVerifyProfiles = async (result = []) => {
    const profiles = result.filter((profile) => profile.needVerifyCRSS);
    const crssVerifyProfiles = profiles.map((profile) => {
        const formattedProfile = formateProfile(profile);
        return formattedProfile;
    });
    const needCRSSVerify = crssVerifyProfiles.length > 0;
    console.log("ProfileThunk - getCRSSVerifyProfiles - needCRSSVerify: ", needCRSSVerify);
    console.log("ProfileThunk - getCRSSVerifyProfiles - crssVerifyProfiles:", crssVerifyProfiles);
    return { needCRSSVerify, crssVerifyProfiles };
};

const updateCustomerLicenseToRedux = (customerId) => async (dispatch) => {
    console.log("ProfileThunk - updateCustomerLicenseToRedux - customerId:", customerId);
    const licenseData = await getCustomerLicenseFromDB(customerId);
    await dispatch(licenseActions.updateLicense(licenseData));
    const timeResultFromDB = await getLicenseLastUpdateTimeDataFromDB({ activeProfileId: customerId });
    const { lastUpdateTime } = timeResultFromDB;
    console.log("ProfileThunk - updateCustomerLicenseToRedux - lastUpdateTime:", lastUpdateTime);
    await dispatch(licenseActions.updateLastUpdateTime(lastUpdateTime));
};

const initProfile =
    (isRemote = true, isReopenApp = false): AppThunk =>
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

        console.log("ProfileThunk - initProfile - saveCustomerLicenseToDB");
        if (isRemote) {
            dispatch(initResidentMethodTypes());
            saveCustomerLicenseToDB(profileListIDs);
        }
        if (isReopenApp) {
            if (currentInUseProfileID && includes(profileListIDs, currentInUseProfileID)) {
                dispatch(profileActions.updateCurrentInUseProfileID(currentInUseProfileID));
            }
        }

        if (!isReopenApp && primaryProfileId) {
            await updateCurrentInUseProfileID(username, primaryProfileId);
            dispatch(profileActions.updateCurrentInUseProfileID(primaryProfileId));
        }

        dispatch(profileActions.updatePrimaryProfileID(primaryProfileId));
        dispatch(profileActions.updateProfileIDs(profileListIDs));
        dispatch(profileActions.setProfileList(profileList));

        return { success: true, primaryProfileId, profileList };
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
            dispatch(preferencePointActions.clearUpdateTime());
            await dispatch(updateCustomerLicenseToRedux(profileID));
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
        networkErrorByDialog = false,
        updateProfileWithNewData = false,
        showCRSSVerifyMsg = true,
        needCacheLicense = true,
    } = {}) =>
    async (dispatch, getState) => {
        const rootState = getState();

        const currentProfileIds = profileSelector.selectProfileIDs(rootState);
        const previousPrimaryProfileID = profileSelector.selectPrimaryProfileID(rootState);
        const currentInUseProfileID = profileSelector.selectCurrentInUseProfileID(rootState);

        const profileResponse = await handleError(getProfileList(), {
            dispatch,
            showLoading: showGlobalLoading,
            networkErrorByDialog,
        });
        if (!profileResponse.success) {
            return profileResponse;
        }

        const { result } = profileResponse.data.data;
        const { profileList, primaryProfileId, profileListIDs } = getProfileData(result);
        const differenceProfiles = xor(currentProfileIds, profileListIDs);

        const response = {
            success: true,
            listChanged: false,
            primaryIsInactivated: false,
            ciuIsInactivated: false,
            needCRSSVerify: false,
            profiles: result,
        };

        const ciuIsInactivated = !includes(profileListIDs, currentInUseProfileID);
        const primaryIsInactivated = !includes(profileListIDs, previousPrimaryProfileID);
        const noPrimaryProfile = primaryIsInactivated && !primaryProfileId;

        response.listChanged = !isEmpty(differenceProfiles);
        response.ciuIsInactivated = ciuIsInactivated;
        response.primaryIsInactivated = primaryIsInactivated;
        const { needCRSSVerify, crssVerifyProfiles } = await getCRSSVerifyProfiles(result);
        response.needCRSSVerify = needCRSSVerify;

        console.log("ProfileService - getProfileListChangeStatus - needCacheLicense:", needCacheLicense);
        if (needCacheLicense) {
            await saveCustomerLicenseToDB(profileListIDs);
            await dispatch(updateCustomerLicenseToRedux(currentInUseProfileID));
        }

        if (noPrimaryProfile) {
            await dispatch(profileActions.setIndividualProfiles(profileList));
            dispatch(appActions.toggleShowPrimaryProfileInactiveMsg(true));
            return response;
        }

        const primaryChanged = primaryIsInactivated && primaryProfileId;
        if ((showCIUChangedMsg && ciuIsInactivated) || primaryChanged) {
            const message = primaryChanged
                ? i18n.t("profile.profileListUpdatedAndRefresh")
                : i18n.t("profile.currentInUseInactiveMsg");

            showProfileDialog(message, () => {
                if (ciuIsInactivated) {
                    dispatch(switchCurrentInUseProfile(primaryProfileId));
                }
                dispatch(updateProfileData(result));
                NavigationService.navigate(Routers.manageProfile);
            });
            return response;
        }

        // Verify CRSS
        if (needCRSSVerify && showCRSSVerifyMsg) {
            DialogHelper.showSimpleDialog({
                title: i18n.t("profile.crssRequiredTitle"),
                message: i18n.t("profile.crssRequiredContent"),
                okText: i18n.t("common.gotIt"),
                okAction: () => {
                    NavigationService.navigate(Routers.crss, { crssVerifyProfiles });
                },
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

const initProfileDetails =
    ({ profileId, isForce = true }) =>
    async (dispatch, getState) => {
        let result;
        const rootState = getState();
        const { profileDetailsRequestStatus } = rootState.profile;

        if (profileDetailsRequestStatus == REQUEST_STATUS.pending) {
            return result;
        }
        dispatch(profileActions.setProfileDetailsRequestStatus(REQUEST_STATUS.pending));
        console.log("ProfileThunk - initProfileDetails - isForce:", isForce);
        console.log("ProfileThunk - initProfileDetails - profileId:", profileId);
        if (isForce || checkNeedAutoRefreshData(getCurrentProfileDetailsUpdateTime())) {
            const response = await handleError(getProfileDetailsById(profileId), {
                dispatch,
                networkErrorByDialog: false,
            });
            if (response.success) {
                result = response.data.data.result;
                console.log("ProfileThunk - initProfileDetails - getProfileDetailsById:", result);
                if (!isEmpty(result)) {
                    await updateProfileDetailToDB(result);
                    setCurrentProfileDetailsUpdateTime();
                }
                dispatch(profileActions.setProfileDetailsRequestStatus(REQUEST_STATUS.fulfilled));
            } else {
                dispatch(profileActions.setProfileDetailsRequestStatus(REQUEST_STATUS.rejected));
            }
            result = { ...result, success: response.success };
        }
        if (!result || !result.success) {
            const dbResult = await getProfileDetailFromDB(profileId);
            console.log("ProfileThunk - initProfileDetails - getProfileDetailFromDB:", dbResult);
            if (dbResult.success) {
                result = dbResult.profile;
            }
            if (isEmpty(result)) {
                const filteredVal = getState()?.profile?.profileList?.find((ele) => ele?.profileId == profileId);
                result = { ...filteredVal, noCacheData: true };
            }
            result = { ...result, success: result.success };
        }

        const formattedProfile = formateProfile(result);
        dispatch(profileActions.updateProfileDetailsById(formattedProfile));
        dispatch(profileActions.setProfileDetailsRequestStatus(REQUEST_STATUS.fulfilled));
        return formattedProfile;
    };

const refreshProfileList =
    ({ isForce = false, showCIUChangedMsg = true, showGlobalLoading = false } = {}): AppThunk =>
    async (dispatch, getState) => {
        console.log(`refresh profile list isForce:${isForce}`);
        const rootState = getState();
        const { profileListRequestStatus } = rootState.profile;

        if (profileListRequestStatus == REQUEST_STATUS.pending) {
            return { isReloadData: false };
        }
        // kill app and reopen, the getProfileListUpdateTime is null and checkNeedAutoRefreshData(getProfileListUpdateTime()) is true
        console.log("checkNeedAutoRefreshData", checkNeedAutoRefreshData(getProfileListUpdateTime()));
        if (!isForce && checkNeedAutoRefreshData(getProfileListUpdateTime()) == false) {
            return { isReloadData: false };
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
        // @ts-ignore Initial Current User Profile Details
        const { ciuIsInactivated } = response;
        if (!ciuIsInactivated) {
            const currentInUseProfileID = profileSelector.selectCurrentInUseProfileID(rootState);
            if (currentInUseProfileID) {
                await dispatch(initProfileDetails({ profileId: currentInUseProfileID, isForce: false }));
            }
        }
        return { ...response, isReloadData: true };
    };

const getLatestCustomerLists = () => async (dispatch) => {
    const searchResult = { success: false, customerList: null };
    const response = await handleError(getLatestCustomerList(), { dispatch });
    if (response.success) {
        const { result } = response.data.data;
        const { profileList } = getProfileData(result);
        searchResult.success = true;
        searchResult.customerList = profileList;
    }
    return searchResult;
};

export default {
    initProfileCommonData,
    initResidentMethodTypes,
    initProfile,
    switchCurrentInUseProfile,
    refreshProfileList,
    updateProfileData,
    initProfileDetails,
    getProfileListChangeStatus,
    getLatestCustomerLists,
    updateCustomerLicenseToRedux,
};
