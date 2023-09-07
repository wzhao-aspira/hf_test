/* eslint-disable import/no-mutable-exports */
import Realm from "realm";
import AppContract from "../assets/_default/AppContract";
import { ERROR_CODE } from "../constants/Constants";
import ProfileDetail from "../db_schema/ProfileDetail";
import ProfileSummary from "../db_schema/ProfileSummary";

const schemaVersion = 1;

export let realm: Realm;

export async function openRealm() {
    realm = await Realm.open({
        schema: [ProfileSummary, ProfileDetail],
        path: `${AppContract.contractName}.realm`,
        schemaVersion,
        deleteRealmIfMigrationNeeded: !!__DEV__,
        // onMigration: (oldRealm, newRealm) => {
        //     if (oldRealm.schemaVersion < 2) {
        //         // Migration
        //     }
        // },
    });
}

export function closeRealm() {
    realm?.close();
}

export async function updateProfileListToDB2(profileList: Array<any>) {
    const result = { success: true, code: ERROR_CODE.COMMON_ERROR };
    try {
        profileList.forEach((ele) => {
            console.log("update profile summary", ele);
            realm.write(() => {
                realm.create(ProfileSummary, ele, true);
            });
        });
    } catch (error) {
        console.log(error);
        result.success = false;
    }
    return result;
}

export async function getProfileListFromDB2() {
    const result: { success: boolean; code: number; profileList: null | Realm.Results<ProfileSummary> } = {
        success: true,
        code: ERROR_CODE.COMMON_ERROR,
        profileList: null,
    };
    try {
        const summary = realm.objects(ProfileSummary);
        result.profileList = summary;
    } catch (error) {
        console.log(error);
        result.success = false;
    }
    console.log("get profile list", result);
    return result;
}

export async function updateProfileDetailToDB2(profile: any) {
    const result = { success: true, code: ERROR_CODE.COMMON_ERROR };
    try {
        console.log("update profile detail", profile);
        realm.write(() => {
            realm.create(ProfileDetail, profile, true);
        });
    } catch (error) {
        console.log(error);
        result.success = false;
    }
    return result;
}

export async function getProfileDetailFromDB2(profileId: string) {
    const result: { success: boolean; code: number; profile: null | Realm.Object<ProfileDetail> } = {
        success: true,
        code: ERROR_CODE.COMMON_ERROR,
        profile: null,
    };

    try {
        const detail = realm.objectForPrimaryKey<ProfileDetail>(ProfileDetail, profileId);
        result.profile = detail;
    } catch (error) {
        console.log(error);
        result.success = false;
    }
    console.log("get profile detail", result);
    return result;
}

export async function clearProfileListFromDB2() {
    console.log("clearProfileListFromDB");
    const result = { success: false, code: ERROR_CODE.COMMON_ERROR };
    try {
        realm.write(() => {
            realm.delete(realm.objects(ProfileSummary));
            realm.delete(realm.objects(ProfileDetail));
        });
    } catch (error) {
        result.success = false;
    }
    return result;
}
