export const KEY_CONSTANT = {
    keyLoginSplash: "keyLoginSplash",
    keyAppConfig: "keyAppConfig",
    keyLatLon: "keyLatLon",
    keyOnboardingLocation: "keyOnboardingLocation",
    keyLastUsedMobileAccountId: "keyLastUsedMobileAccountId",
    keyOnboardingBiometric: "keyOnboardingBiometricLogin",
    localAuthOnboardingHasAppear: "localAuthOnboardingHasAppear",
    biometricIDSwitchBlock: "biometricIDSwitchBlock",
    biometricIDSwitch: "biometricIDSwitch",
    loginCredential: "loginCredential",
    lastBiometricLoginUser: "lastBiometricLoginUser",
    lastBiometricLoginUserAuthInfo: "lastBiometricLoginUserAuthInfo",
    currentInUseProfileIDOfAccounts: "currentInUseProfileIDOfAccounts",
    keySalesAgentsRecentSearch: "keySalesAgentsRecentSearch",
    usefulLinks: "usefulLinks",
};
export const DEBUG_MODE = false;
export const REQUEST_STATUS = { idle: "idle", pending: "pending", fulfilled: "fulfilled", rejected: "rejected" };
export const AUTO_REFRESH_TIMEOUT = 0.5 * 60 * 60;

export const CATEGORY = { Hunting: 1, Fishing: 2 };
export const IDENTIFICATION_TYPE_GO_ID = "1";
export const DEFAULT_DATE_FORMAT = "MM DD YYYY";
export const DATE_OF_BIRTH_DISPLAY_FORMAT = "MM/DD/YYYY";
export const PROFILE_TYPE_IDS = {
    adult: "1",
    youth: "2",
    business: "3",
    vessel: "4",
};
export const PROFILE_TYPES = [
    {
        id: PROFILE_TYPE_IDS.adult,
        name: "Adult",
    },
    {
        id: PROFILE_TYPE_IDS.youth,
        name: "Youth",
    },
    {
        id: PROFILE_TYPE_IDS.business,
        name: "Business",
    },
    {
        id: PROFILE_TYPE_IDS.vessel,
        name: "Vessel",
    },
];

export const IDENTIFICATION_OWNER_YOUTH = "Youth";
export const IDENTIFICATION_OWNER_YOUTH_IDENTIFICATION = "Youth Identification";
export const IDENTIFICATION_OWNER_PARENT = "Parent";
export const ERROR_CODE = {
    COMMON_ERROR: -1,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SQLITE_CONSTRAINT_UNIQUE: 2067,
};
export const DEFAULT_STATE_ID = "6";
export const SUGGESTED_LOCATIONS = "Suggested Locations";
export const NETWORK_REQUEST_FAILED = "Network request failed";
export const BtnSizeEnum = { Large: "Large", Small: "Small" };
export const BtnTypeEnum = {
    Primary: "Primary",
    Secondary: "Secondary",
};
