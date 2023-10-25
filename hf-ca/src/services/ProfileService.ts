import { isEmpty } from "lodash";
import { PROFILE_TYPE_IDS, PROFILE_TYPES, KEY_CONSTANT } from "../constants/Constants";
import { updateProfileDetailToDB } from "../db";
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
    crssVerifyPerCustomer,
    switchProfileToPrimary,
} from "../network/api_client/CustomersApi";
import {
    getIdentityTypes as getIdentityTypesData,
    getYouthIdentityOwners as getYouthIdentityOwnersData,
    getCountries as getCountriesData,
    getStates as getStatesData,
    getResidentMethodTypes as getResidentMethodTypesData,
} from "../network/api_client/StaticDataApi";
import {
    CountryVM,
    CustomerVM,
    IdentityTypesVM,
    ResidentMethodTypeVM,
    StateVM,
    YouthIdentityOwnerVM,
} from "../network/generated/api";
import { ProfileDetail } from "../types/profile";
import NavigationService from "../navigation/NavigationService";
import Routers from "../constants/Routers";
import { clearCustomerDetailById } from "../db/ProfileDetail";
import { clearCustomerSummaryById } from "../db/ProfileSummary";
import { getLicenseData, getLicenseListDataFromDB } from "./LicenseService";

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

export async function getResidentMethodTypes(): Promise<ResidentMethodTypeVM[]> {
    const ret = await getResidentMethodTypesData();
    return ret?.data?.result;
}

export async function getProfileList() {
    const response = await getProfiles();
    batchUpdateProfileDetails(response);
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

export const convertProfileDetail = (customer: CustomerVM): ProfileDetail => {
    // @ts-ignore API provide base class type's props, API have story try to back all props use sub class props.
    const { individualCustomerOfficialDocument, vesselCustomerDocumentIdentity, ownerOfficialDocument } = customer;
    // @ts-ignore API provide base class type's props, API have story try to back all props use sub class props.
    const { breadth, depth, grossTonnage, length, netTonnage } = customer;
    const profileDetail: ProfileDetail = {
        ...customer,
        individualCustomerOfficialDocumentFieldName: individualCustomerOfficialDocument?.identityFieldName,
        individualCustomerOfficialDocumentDisplayValue: individualCustomerOfficialDocument?.identityDisplayValue,
        vesselCustomerDocumentIdentityFieldName: vesselCustomerDocumentIdentity?.identityFieldName,
        vesselCustomerDocumentIdentityDisplayValue: vesselCustomerDocumentIdentity?.identityDisplayValue,
        ownerOfficialDocumentFieldName: ownerOfficialDocument?.identityFieldName,
        ownerOfficialDocumentDisplayValue: ownerOfficialDocument?.identityDisplayValue,
        displayBreadth: breadth?.toString(),
        displayDepth: depth?.toString(),
        displayGrossTonnage: grossTonnage?.toString(),
        displayLength: length?.toString(),
        displayNetTonnage: netTonnage?.toString(),
    };
    return profileDetail;
};

export async function getProfileDetailsById(profileId) {
    const profileDetails = await getProfileDetails(profileId);
    const { result, errors, isValidResponse } = profileDetails.data;
    const formattedResult = convertProfileDetail(result);
    return { data: { errors, result: formattedResult, isValidResponse } };
}

export function batchUpdateProfileDetails(profiles) {
    if (profiles?.success && !isEmpty(profiles?.data?.result)) {
        profiles?.data?.result?.forEach((ele) => {
            console.log("backend profile id:", ele?.customerId);
            getProfileDetailsById(ele?.customerId)
                .then((v) => {
                    if (!isEmpty(v?.data?.result)) {
                        updateProfileDetailToDB(v?.data?.result);
                    }
                })
                .catch((e) => {
                    console.log(e);
                });
        });
    }
}

export function crssVerify(customerId, password) {
    return crssVerifyPerCustomer(customerId, { password });
}

export function getGOIDLabel(t, profile) {
    if (profile.profileType === PROFILE_TYPE_IDS.business) {
        return t("profile.businessGOIDNumber");
    }
    if (profile.profileType === PROFILE_TYPE_IDS.vessel) {
        return t("profile.vesselGOIDNumber");
    }
    return t("profile.goIDNumber");
}

export function isIndividualProfile(profileType: number) {
    return profileType === PROFILE_TYPE_IDS.adult;
}
export function isAssociatedProfile(profileType: number) {
    return profileType === PROFILE_TYPE_IDS.business || profileType === PROFILE_TYPE_IDS.vessel;
}

export async function switchToPrimary(customerId: string) {
    const response = await switchProfileToPrimary({ customerId });
    return response;
}

export const goToAddNewPrimaryProfilePage = (userID: string, route: string) => {
    let routeScreen;
    if (route === Routers.manageProfile || route === Routers.profileDetails) {
        routeScreen = Routers.manageProfile;
    } else {
        routeScreen = Routers.home;
    }
    console.log("inactive primary in ", routeScreen);

    NavigationService.navigate(Routers.addIndividualProfile, {
        mobileAccount: { userID },
        isAddPrimaryProfile: true,
        noBackBtn: true,
        routeScreen,
    });
};

export async function removeCustomerFromDB(customerId: string) {
    await clearCustomerDetailById(customerId);
    await clearCustomerSummaryById(customerId);
}

export async function getLatestCustomerList() {
    return getProfiles();
}

export async function saveCustomerLicenseToDB(profileListIDs) {
    console.log("ProfileService - saveCustomerLicenseToDB - profileListIDs:", profileListIDs);
    await Promise.all(
        profileListIDs.map(async (profileId) => {
            try {
                await getLicenseData(profileId);
            } catch (error) {
                console.log(error);
            }
        })
    );
}

export async function getCustomerLicenseFromDB(customerId) {
    return getLicenseListDataFromDB({ activeProfileId: customerId });
}
