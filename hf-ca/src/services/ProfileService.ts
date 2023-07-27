import { difference } from "lodash";
import profileList from "./mock_data/profiles.json";
import { checkMobileAccount, getMobileAccountById, updateMobileAccountOtherProfileIds } from "../helper/DBHelper";
import { PROFILE_TYPE_IDS, PROFILE_TYPES, KEY_CONSTANT } from "../constants/Constants";
import { storeItem, retrieveItem } from "../helper/StorageHelper";
import { isAssociatedProfile } from "../helper/ProfileHelper";
import {
    getProfiles,
    findAndLinkAuditProfile,
    findAndLinkBusinessProfile,
    findAndLinkVesselProfile,
    findAndLinkYouthProfile,
} from "../network/api_client/CustomersApi";

import {
    getIdentityTypes as getIdentityTypesData,
    getYouthIdentityOwners as getYouthIdentityOwnersData,
    getCountries as getCountriesData,
    getStates as getStatesData,
} from "../network/api_client/StaticDataApi";
import { CountryVM, IdentityTypesVM, StateVM, YouthIdentityOwnerVM } from "../network/generated/api";

export async function getIdentityTypes(): Promise<IdentityTypesVM> {
    const ret = await getIdentityTypesData();
    return ret?.data?.result;
}
export async function getYouthIdentityOwners(): Promise<YouthIdentityOwnerVM[]> {
    const ret = await getYouthIdentityOwnersData();
    return ret?.data?.result;
}
export async function getCountries(): Promise<CountryVM[]> {
    const ret = await getCountriesData();
    return ret?.data?.result;
}
export async function getStates(): Promise<StateVM[]> {
    const ret = await getStatesData();
    return ret?.data?.result;
}

export async function getProfileList() {
    const response = await getProfiles();
    return response;
}

export function getProfileListByIDs(profileListIDs) {
    const profiles = profileList;
    return profiles.filter((profile) => profileListIDs.includes(profile.profileId));
}

export function isProfileAlreadyAssociatedWithAccount(mobileAccount, profile) {
    return (
        mobileAccount?.otherProfileIds?.find((pId) => pId === profile.profileId) ||
        mobileAccount?.primaryProfileId === profile.profileId
    );
}

export async function checkAccountEmailIsExisting(userID) {
    const checkResult = await checkMobileAccount(userID);
    return checkResult.success && checkResult.count > 0;
}

export async function getMobileAccountByUserId(userID) {
    const mobileAccount = await getMobileAccountById(userID);
    return mobileAccount?.account;
}
export async function removeProfilesByUserId(userID, deletedProfileIds) {
    const mobileAccount = await getMobileAccountById(userID);
    if (!mobileAccount?.account) {
        return { success: false };
    }
    const { otherProfileIds } = mobileAccount.account;

    const newOtherProfileIds = difference(otherProfileIds, deletedProfileIds);
    const updateResponse = await updateMobileAccountOtherProfileIds(userID, newOtherProfileIds.join(","));

    if (updateResponse.success) {
        return { success: true };
    }

    return { success: false };
}

export function getIndividualProfileTypes() {
    return PROFILE_TYPES.filter((p) => PROFILE_TYPE_IDS.adult === p.id || PROFILE_TYPE_IDS.youth === p.id);
}

function shouldShowBusinessVessel() {
    const showBusiness = true;
    const showVessel = true;
    return { showBusiness, showVessel };
}

export async function getProfileTypes() {
    const profileTypes = [];
    const individualProfileTypes = getIndividualProfileTypes();
    profileTypes.push(...individualProfileTypes);
    const showBusinessVessel = shouldShowBusinessVessel();
    if (showBusinessVessel.showBusiness) {
        profileTypes.push(PROFILE_TYPES.find((p) => PROFILE_TYPE_IDS.business === p.id));
    }
    if (showBusinessVessel.showVessel) {
        profileTypes.push(PROFILE_TYPES.find((p) => PROFILE_TYPE_IDS.vessel === p.id));
    }
    return profileTypes;
}

function buildIdentityInfo(config, identificationInfo) {
    return {
        idNumber: config.idNumberRequired ? identificationInfo?.idNumber : null,
        issuedStateId: config.issuedStateRequired ? identificationInfo?.stateIssued.id : null,
        issuedCountryId: config.issuedCountryRequired ? identificationInfo?.countryIssued.id : null,
    };
}

async function linkProfile(profile, isPrimary) {
    const { identificationType } = profile;
    const { config, identificationInfo } = identificationType;
    if (PROFILE_TYPE_IDS.adult === profile.profileType.id) {
        const identityInfo = buildIdentityInfo(config, identificationInfo);
        const ret = await findAndLinkAuditProfile({
            lastName: profile.lastName,
            dateOfBirth: profile.dateOfBirth,
            identityTypeId: identificationType.id,
            ...identityInfo,
            isPrimary,
        });
        return ret.data.result;
    }
    if (PROFILE_TYPE_IDS.youth === profile.profileType.id) {
        const identityInfo = buildIdentityInfo(config, identificationInfo);
        const ret = await findAndLinkYouthProfile({
            firstName: profile.firstName,
            lastName: profile.lastName,
            dateOfBirth: profile.dateOfBirth,
            identityTypeId: identificationType.id,
            ...identityInfo,
            isPrimary,
        });
        return ret.data.result;
    }
    if (PROFILE_TYPE_IDS.business === profile.profileType.id) {
        const ret = await findAndLinkBusinessProfile({
            goid: profile.goIDNumber,
            postalCode: profile.postalCodeNumber,
            isPrimary,
        });
        return ret.data.result;
    }
    if (PROFILE_TYPE_IDS.vessel === profile.profileType.id) {
        const ret = await findAndLinkVesselProfile({
            goid: profile.goIDNumber,
            dfgNumber: profile.fgNumber,
            isPrimary,
        });
        return ret.data.result;
    }
    return null;
}

export async function findAndLinkPrimaryProfile(profile) {
    return linkProfile(profile, true);
}

export async function findAndLinkProfile(profile) {
    return linkProfile(profile, false);
}

export async function updateCurrentInUseProfileID(accountID, currentInUseProfileID) {
    const currentInUseProfileIDOfAccounts = await retrieveItem(KEY_CONSTANT.currentInUseProfileIDOfAccounts);

    if (currentInUseProfileIDOfAccounts) {
        const parsedCurrentInUseProfileIDOfAccounts = JSON.parse(currentInUseProfileIDOfAccounts);
        const updatedCurrentInUseProfileIDOfAccount = {
            ...parsedCurrentInUseProfileIDOfAccounts,
            [accountID]: currentInUseProfileID,
        };

        await storeItem(
            KEY_CONSTANT.currentInUseProfileIDOfAccounts,
            JSON.stringify(updatedCurrentInUseProfileIDOfAccount)
        );
    } else {
        await storeItem(
            KEY_CONSTANT.currentInUseProfileIDOfAccounts,
            JSON.stringify({ [accountID]: currentInUseProfileID })
        );
    }
}

export async function getCurrentInUseProfileID(accountID) {
    const currentInUseProfileIDOfAccounts = await retrieveItem(KEY_CONSTANT.currentInUseProfileIDOfAccounts);

    if (currentInUseProfileIDOfAccounts) {
        const parsedCurrentInUseProfileIDOfAccounts = JSON.parse(currentInUseProfileIDOfAccounts);

        return parsedCurrentInUseProfileIDOfAccounts[accountID];
    }

    return null;
}

export async function removeAccountCurrentInUseProfileID(accountID) {
    const currentInUseProfileIDOfAccounts = await retrieveItem(KEY_CONSTANT.currentInUseProfileIDOfAccounts);

    if (currentInUseProfileIDOfAccounts) {
        const parsedAccountsCurrentInUseProfileID = JSON.parse(currentInUseProfileIDOfAccounts);

        if (parsedAccountsCurrentInUseProfileID[accountID]) {
            delete parsedAccountsCurrentInUseProfileID[accountID];

            await storeItem(
                KEY_CONSTANT.currentInUseProfileIDOfAccounts,
                JSON.stringify(parsedAccountsCurrentInUseProfileID)
            );
        }
    }
}

export async function getProfilesByUserID(userID) {
    const accountData = await getMobileAccountById(userID);
    const account = accountData?.account;

    const profileIds = [account.primaryProfileId, ...account.otherProfileIds];
    const profiles = getProfileListByIDs(profileIds);

    return profiles;
}

export async function getSwitchStatus(userId, profileID) {
    try {
        let canSwitch = true;
        const ownerStatusChangedProfileIds = [];
        const profiles = await getProfilesByUserID(userId);
        const profile = profiles.find((item) => item.profileId === profileID);
        const inactiveProfileIds = profiles.filter((item) => !item.valid).map((item) => item.profileId);
        const activeProfiles = profiles.filter((item) => item.valid);

        if (inactiveProfileIds.includes(profileID)) {
            canSwitch = false;
        }

        if (isAssociatedProfile(profile.profileType)) {
            const ownerProfile = profiles.find((item) => item.profileId === profile.ownerId);
            // 1. The profile's owner is changed but not added; 2. The profile's owner is inactive
            if (!ownerProfile || inactiveProfileIds.includes(ownerProfile.profileId)) {
                canSwitch = false;
            }
        }

        activeProfiles.forEach((activeProfile) => {
            if (isAssociatedProfile(activeProfile.profileType)) {
                const ownerProfile = activeProfiles.find((item) => item.profileId === activeProfile.ownerId);
                if (!ownerProfile) {
                    ownerStatusChangedProfileIds.push(activeProfile.profileId);
                }
            }
        });

        await removeProfilesByUserId(userId, [...inactiveProfileIds, ...ownerStatusChangedProfileIds]);
        return { canSwitch };
    } catch (error) {
        console.log("getSwitchStatus error", error);
        return { error: true };
    }
}
