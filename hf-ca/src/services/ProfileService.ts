import { PROFILE_TYPE_IDS, PROFILE_TYPES, KEY_CONSTANT } from "../constants/Constants";
import { storeItem, retrieveItem } from "../helper/StorageHelper";
import {
    getProfiles,
    findAndLinkAuditProfile,
    findAndLinkBusinessProfile,
    findAndLinkVesselProfile,
    findAndLinkYouthProfile,
    removeProfileById,
    getCustomersOwnerships,
    linkProfileBasedOnCustomerId,
    getProfileDetails,
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

export async function removeProfile(profileId) {
    return removeProfileById(profileId);
}

export function getIndividualProfileTypes() {
    return PROFILE_TYPES.filter((p) => PROFILE_TYPE_IDS.individual === p.id);
}

async function shouldShowBusinessVessel() {
    const ret = await getCustomersOwnerships();
    const { hasBusiness, hasVessel } = ret?.data?.result || { hasBusiness: false, hasVessel: false };
    return { showBusiness: hasBusiness, showVessel: hasVessel };
}

export async function getProfileTypes() {
    const profileTypes = [];
    const individualProfileTypes = getIndividualProfileTypes();
    profileTypes.push(...individualProfileTypes);
    const showBusinessVessel = await shouldShowBusinessVessel();
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
    const { config, identificationInfo } = identificationType || {};
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

export async function linkCRSSProfile(customerId, password, isPrimaryCustomer) {
    return linkProfileBasedOnCustomerId({ customerId, password, isPrimaryCustomer });
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

export async function getProfileDetailsById(profileId) {
    return getProfileDetails(profileId);
}
