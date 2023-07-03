import { PROFILE_TYPE_IDS } from "../constants/Constants";

export function getGOIDLabel(t, profile) {
    if (profile.profileType === PROFILE_TYPE_IDS.business) {
        return t("profile.businessGOIDNumber");
    }
    if (profile.profileType === PROFILE_TYPE_IDS.vessel) {
        return t("profile.vesselGOIDNumber");
    }
    return t("profile.goIDNumber");
}