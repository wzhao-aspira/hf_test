import { isEmpty } from "lodash";
import moment from "moment";
import countryStateMockData from "./mock_data/country_states.json";
import identificationTypesMockData from "./mock_data/identification_types.json";
import identificationOwnersMockData from "./mock_data/identification_owners.json";
import profileList from "./mock_data/profiles.json";
import {
    checkMobileAccount,
    getMobileAccountById,
    insertMobileAccount,
    updateMobileAccountOtherProfileIds,
} from "../helper/DBHelper";
import {
    PROFILE_TYPE_IDS,
    DATE_OF_BIRTH_DISPLAY_FORMAT,
    DEFAULT_DATE_FORMAT,
    PROFILE_TYPES,
} from "../constants/Constants";

export function getProfileList() {
    return profileList;
}

export function getProfileListByIDs(profileListIDs) {
    const profiles = getProfileList();
    return profiles.filter((profile) => profileListIDs.includes(profile.profileId));
}

export function getCountriesStates() {
    return countryStateMockData;
}

export function getIdentificationTypes() {
    return identificationTypesMockData;
}

export function getIdentificationOwners() {
    return identificationOwnersMockData;
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

export async function addPrimaryProfile(mobileAccount, profileId) {
    const result = await insertMobileAccount(mobileAccount.userID, mobileAccount.password, profileId, "");
    return result?.success;
}

export async function addProfile(mobileAccount, profileId) {
    const result = await updateMobileAccountOtherProfileIds(
        mobileAccount.userID,
        [...mobileAccount.otherProfileIds, profileId].join(",")
    );
    return result?.success;
}
export function getIndividualProfileTypes() {
    return PROFILE_TYPES.filter((p) => PROFILE_TYPE_IDS.adult === p.id || PROFILE_TYPE_IDS.youth === p.id);
}

function shouldShowProfileByType(associatedProfileIds, profileType) {
    let shouldShow = false;
    const profiles = getProfileList();
    const haveProfile = profiles.find((profile) => profile.profileType === profileType);
    if (haveProfile) {
        associatedProfileIds.some((profileId) => {
            const ownerProfile = profiles.find(
                (profile) => profile.ownerId === profileId && profile.profileType === profileType
            );
            if (ownerProfile) {
                shouldShow = true;
                return true;
            }
            return false;
        });
    }
    return shouldShow;
}

function shouldShowBusinessVessel(associatedProfileIds) {
    const showBusiness = shouldShowProfileByType(associatedProfileIds, PROFILE_TYPE_IDS.business);
    const showVessel = shouldShowProfileByType(associatedProfileIds, PROFILE_TYPE_IDS.vessel);
    return { showBusiness, showVessel };
}

export function getProfileTypes(mobileAccount) {
    const profileTypes = [];
    const individualProfileTypes = getIndividualProfileTypes();
    profileTypes.push(...individualProfileTypes);
    if (!mobileAccount) {
        return profileTypes;
    }
    const associatedProfileIds = [mobileAccount.primaryProfileId, ...mobileAccount.otherProfileIds];
    const showBusinessVessel = shouldShowBusinessVessel(associatedProfileIds);
    if (showBusinessVessel.showBusiness) {
        profileTypes.push(PROFILE_TYPES.find((p) => PROFILE_TYPE_IDS.business === p.id));
    }
    if (showBusinessVessel.showVessel) {
        profileTypes.push(PROFILE_TYPES.find((p) => PROFILE_TYPE_IDS.vessel === p.id));
    }
    return profileTypes;
}

function isProfileIdentificationOwnerMatched(mockedIdentifications, identificationOwner) {
    if (isEmpty(mockedIdentifications) || !identificationOwner) return false;
    const { id } = identificationOwner;
    const matchedIdentification = mockedIdentifications?.find((mockIdentification) => {
        if (!mockIdentification) return false;
        return mockIdentification.ownerTypeId === id;
    });
    return !!matchedIdentification;
}

function isProfileIdentificationMatched(mockedIdentifications, identificationType) {
    if (isEmpty(mockedIdentifications) || !identificationType) return false;
    const { id, config, identificationInfo } = identificationType;
    const matchedIdentification = mockedIdentifications?.find((mockIdentification) => {
        if (!mockIdentification) return false;
        let matched = mockIdentification.typeId === id;
        if (config.idNumberRequired) {
            matched =
                matched &&
                mockIdentification?.idNumber?.toUpperCase()?.trim() ===
                    identificationInfo.idNumber.toUpperCase().trim();
        }
        if (config.issuedStateRequired) {
            matched = matched && mockIdentification?.stateIssuedId === identificationInfo.stateIssued.id;
        }
        if (config.issuedCountryRequired) {
            matched = matched && mockIdentification?.countryIssuedId === identificationInfo.countryIssued.id;
        }
        return matched;
    });
    return !!matchedIdentification;
}

export async function findProfile(profile) {
    const profiles = getProfileList();
    return profiles.find((p) => {
        if (PROFILE_TYPE_IDS.adult === profile.profileType.id) {
            return (
                moment(p?.dateOfBirth, DATE_OF_BIRTH_DISPLAY_FORMAT)?.isSame(
                    moment(profile.dateOfBirth, DEFAULT_DATE_FORMAT)
                ) &&
                p.lastName?.toUpperCase()?.trim() === profile.lastName.toUpperCase().trim() &&
                isProfileIdentificationMatched(p.identification, profile.identificationType)
            );
        }
        if (PROFILE_TYPE_IDS.youth === profile.profileType.id) {
            return (
                p.firstName?.toUpperCase()?.trim() === profile.firstName.toUpperCase().trim() &&
                p.lastName?.toUpperCase()?.trim() === profile.lastName.toUpperCase().trim() &&
                isProfileIdentificationOwnerMatched(p.identification, profile.identificationOwner) &&
                isProfileIdentificationMatched(p.identification, profile.identificationType)
            );
        }
        if (PROFILE_TYPE_IDS.business === profile.profileType.id) {
            return (
                p.goIDNumber?.toUpperCase()?.trim() === profile.goIDNumber.toUpperCase().trim() &&
                p.postalCodeNumber?.toUpperCase()?.trim() === profile.postalCodeNumber.toUpperCase().trim()
            );
        }
        if (PROFILE_TYPE_IDS.vessel === profile.profileType.id) {
            return (
                p.goIDNumber?.toUpperCase()?.trim() === profile.goIDNumber.toUpperCase().trim() &&
                p.fgNumber?.toUpperCase()?.trim() === profile.fgNumber.toUpperCase().trim()
            );
        }
        return false;
    });
}
