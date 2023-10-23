import { realm, openRealm } from "./ConfigRealm";
import { updateProfileSummaryToDB, getProfileSummaryFromDB, clearProfileSummaryFromDB } from "./ProfileSummary";
import { getProfileDetailFromDB, updateProfileDetailToDB } from "./ProfileDetail";
import {
    getLicenseListData,
    saveLicenseListData,
    removeLicenseListData,
    saveLicenseLastUpdateTimeData,
    getLicenseLastUpdateTimeData,
} from "./License";
import {
    getPreferencePointListFromDB,
    savePreferencePointListToDB,
    removePreferencePointListFromDB,
} from "./PreferencePointList";
import { saveAccessPermitDataToDB, getAccessPermitDataFromDB, removeAccessPermitFromDB } from "./AccessPermit";
import {
    getDrawApplicationDataFromDB,
    saveDrawApplicationDataToDB,
    deleteDrawApplicationDataFromDB,
} from "./DrawApplication";

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
    saveLicenseLastUpdateTimeData,
    getLicenseLastUpdateTimeData,
    getPreferencePointListFromDB,
    savePreferencePointListToDB,
    removePreferencePointListFromDB,
    getAccessPermitDataFromDB,
    saveAccessPermitDataToDB,
    removeAccessPermitFromDB,
    getDrawApplicationDataFromDB,
    saveDrawApplicationDataToDB,
    deleteDrawApplicationDataFromDB,
};
