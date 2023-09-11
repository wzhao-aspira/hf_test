import { realm, openRealm } from "./ConfigRealm";
import { updateProfileSummaryToDB, getProfileSummaryFromDB, clearProfileSummaryFromDB } from "./ProfileSummary";
import { getProfileDetailFromDB, updateProfileDetailToDB } from "./ProfileDetail";
import { getLicenseList, saveLicenseList, removeLicenseList } from "./LicenseList";

export {
    realm,
    openRealm,
    updateProfileSummaryToDB,
    getProfileSummaryFromDB,
    clearProfileSummaryFromDB,
    getProfileDetailFromDB,
    updateProfileDetailToDB,
    getLicenseList,
    saveLicenseList,
    removeLicenseList,
};
