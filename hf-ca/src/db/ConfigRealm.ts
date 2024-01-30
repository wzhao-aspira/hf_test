import Realm from "realm";
import AppContract from "../assets/_default/AppContract";
import ProfileSummary from "./models/ProfileSummary";
import ProfileDetail from "./models/ProfileDetail";
import License from "./models/License";
import LicenseLastUpdateTime from "./models/LicenseLastUpdateTime";
import PreferencePoint from "./models/PreferencePoint";
import AccessPermit from "./models/AccessPermit";
import AccessPermitItem from "./models/AccessPermitItem";
import CustomerInfo from "./models/CustomerInfo";
import HuntDay from "./models/HuntDay";
import FileInfo from "./models/FileInfo";
import DrawApplicationItem from "./models/DrawApplicationItem";
import DrawApplication from "./models/DrawApplication";
import DrawApplicationListInfo from "./models/DrawApplicationListInfo";
import CopyHuntsInfo from "./models/CopyHuntsInfo";
import PreferencePointLastUpdateDate from "./models/PreferencePointLastUpdateDate";
import { sentryCaptureException } from "../helper/AppHelper";

const schemaVersion = 18;

export let realm: Realm;

export async function openRealm() {
    realm = await Realm.open({
        schema: [
            ProfileSummary,
            ProfileDetail,
            License,
            LicenseLastUpdateTime,
            PreferencePoint,
            PreferencePointLastUpdateDate,
            FileInfo,
            HuntDay,
            CustomerInfo,
            AccessPermitItem,
            AccessPermit,
            DrawApplicationItem,
            CopyHuntsInfo,
            DrawApplicationListInfo,
            DrawApplication,
        ],
        path: `${AppContract.contractName}.realm`,
        schemaVersion,
        deleteRealmIfMigrationNeeded: !!__DEV__,
        // onMigration: (oldRealm, newRealm) => {
        //     if (oldRealm.schemaVersion < 2) {
        //         // Migration
        //     }
        // },
    }).catch((e) => {
        console.error(e);
        sentryCaptureException(e);
    });
}

export function closeRealm() {
    realm?.close();
}
