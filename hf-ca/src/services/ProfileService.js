import countryStateMockData from "./mock_data/country_states.json";
import identificationTypesMockData from "./mock_data/identification_types.json";
import identificationOwnersMockData from "./mock_data/identification_owners.json";
import profileList from "./mock_data/profiles.json";
import { checkMobileAccount, getMobileAccountById, insertMobileAccount, updateMobileAccount } from "../helper/DBHelper";
import { storeItem } from "../helper/StorageHelper";
import { KEY_CONSTANT } from "../constants/Constants";

export async function getProfileList() {
    return new Promise((res) => {
        setTimeout(() => res(profileList), 100);
    });
}

export async function getCountriesStates() {
    return new Promise((res) => {
        setTimeout(() => res(countryStateMockData), 100);
    });
}

export async function getIdentificationTypes() {
    return new Promise((res) => {
        setTimeout(() => res(identificationTypesMockData), 100);
    });
}

export async function getIdentificationOwners() {
    return new Promise((res) => {
        setTimeout(() => res(identificationOwnersMockData), 100);
    });
}

export async function findProfile(profile) {
    const profiles = await getProfileList();
    return profiles.find((p) => p.lastName === profile.lastName || p.goIDNumber === profile.goIDNumber);
}

export async function isProfileAlreadyAssociatedWithAccount(mobileAccount, profile) {
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

export async function saveProfile(mobileAccount, profile) {
    if (profile.isPrimary) {
        await insertMobileAccount(mobileAccount.userID, mobileAccount.password, profile.profileId, "");
        await storeItem(KEY_CONSTANT.keyLastUsedMobileAccountId, mobileAccount.userID);
    } else {
        await updateMobileAccount(
            mobileAccount.userID,
            mobileAccount.password,
            mobileAccount.primaryProfileId,
            [...mobileAccount.otherProfileIds, profile.profileId].join(",")
        );
    }
}
