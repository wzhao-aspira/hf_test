export const KEY_CONSTANT = {
    keyLoginSplash: "keyLoginSplash",
    keyAppConfig: "keyAppConfig",
    keyLatLon: "keyLatLon",
    keyOnboardingLocation: "keyOnboardingLocation",
};
export const DEBUG_MODE = false;
export const REQUEST_STATUS = { idle: "idle", pending: "pending", fulfilled: "fulfilled", rejected: "rejected" };
export const AUTO_REFRESH_TIMEOUT = 0.5 * 60 * 60;

export const CATEGORY = { Hunting: 1, Fishing: 2 };

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
export const IDENTIFICATION_OWNER_PARENT = "Parent";
