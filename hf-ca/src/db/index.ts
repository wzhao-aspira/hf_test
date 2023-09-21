import { realm, openRealm } from "./ConfigRealm";
import { updateProfileSummaryToDB, getProfileSummaryFromDB, clearProfileSummaryFromDB } from "./ProfileSummary";
import { getProfileDetailFromDB, updateProfileDetailToDB } from "./ProfileDetail";
import { getLicenseListData, saveLicenseListData, removeLicenseListData } from "./License";
import {
    getPreferencePointListFromDB,
    savePreferencePointListToDB,
    removePreferencePointListFromDB,
} from "./PreferencePointList";
import { saveAccessPermitDataToDB, getAccessPermitDataFromDB, removeAccessPermitFromDB } from "./AccessPermit";

export {
    realm,
    openRealm,
    updateProfileSummaryToDB,
    getProfileSummaryFromDB,
    clearProfileSummaryFromDB,
    getProfileDetailFromDB,
    updateProfileDetailToDB,
    getLicenseListData,
    saveLicenseListData,
    removeLicenseListData,
    getPreferencePointListFromDB,
    savePreferencePointListToDB,
    removePreferencePointListFromDB,
    getAccessPermitDataFromDB,
    saveAccessPermitDataToDB,
    removeAccessPermitFromDB,
};
