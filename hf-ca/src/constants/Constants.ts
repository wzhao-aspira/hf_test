export const KEY_CONSTANT = {
    keyLoginSplash: "keyLoginSplash",
    keyAppLoadingSplash: "keyAppLoadingSplash",
    keyAppConfig: "keyAppConfigV1_3",
    keyResidentMethodTypes: "keyResidentMethodTypes",
    keyLatLon: "keyLatLon",
    keyOnboardingLocation: "keyOnboardingLocation",
    keyLastUsedMobileAccountId: "keyLastUsedMobileAccountId",
    keyOnboardingBiometric: "keyOnboardingBiometricLogin",
    localAuthOnboardingHasAppear: "localAuthOnboardingHasAppear",
    biometricIDSwitchBlock: "biometricIDSwitchBlock",
    biometricIDSwitch: "biometricIDSwitch",
    biometricIDChanged: "biometricIDChanged",
    loginCredential: "loginCredential",
    lastBiometricLoginUser: "lastBiometricLoginUser",
    lastBiometricLoginUserAuthInfo: "lastBiometricLoginUserAuthInfo",
    currentInUseProfileID: "currentInUseProfileID",
    keySalesAgentsRecentSearch: "keySalesAgentsRecentSearch",
    usefulLinks: "usefulLinks",
    regulations: "regulations",
    keyLastLocation: "keyLastLocation",
    keyPasswordChanged: "keyPasswordChanged",
    keyWeatherData: "keyWeatherData",
    keyIsEmptyOnlineDataCached: "keyIsEmptyOnlineDataCached",
    keyIsEmptyPreferencePointOnlineDataCached: "keyIsEmptyPreferencePointOnlineDataCached",
    keyUpdatePromoteCount: "keyUpdatePromoteCount",
    keyVersionInfo: "keyVersionInfo",
    lastUpdateDateOfCustomers: "lastUpdateDateOfCustomers",
};
export const DEBUG_MODE = false;
export const REQUEST_STATUS = {
    idle: "idle",
    pending: "pending",
    fulfilled: "fulfilled",
    rejected: "rejected",
} as const;
export const AUTO_REFRESH_TIMEOUT = 0.5 * 60 * 60;
export const OFFLINE_BAR_SHOW_TWO_LINES_BREAK_POINT = 360;

export const CATEGORY = { Hunting: 1, Fishing: 2 };
export const IDENTIFICATION_TYPE_GO_ID = "1";
export const DEFAULT_DATE_FORMAT = "MM DD YYYY";
export const DATE_OF_BIRTH_DISPLAY_FORMAT = "MM/DD/YYYY";
export const LAST_UPDATE_TIME_DISPLAY_FORMAT = "MM/DD/YYYY hh:mm A";
export const PROFILE_TYPE_IDS = {
    adult: 1,
    youth: 3,
    business: 2,
    vessel: 4,
    individual: 5,
};
export const PROFILE_TYPES = [
    {
        id: PROFILE_TYPE_IDS.individual,
        name: "Individual",
    },
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
export const SUGGESTED_LOCATIONS = "Suggested Locations";
export const NETWORK_REQUEST_FAILED = "Network request failed";
export const BtnSizeEnum = { Large: "Large", Small: "Small" };
export const BtnTypeEnum = {
    Primary: "Primary",
    Secondary: "Secondary",
};
