import Realm from "realm";
import { ERROR_CODE } from "../constants/Constants";
import ProfileSummary from "./models/ProfileSummary";
import { realm } from "./ConfigRealm";
import ProfileDetail from "./models/ProfileDetail";

export async function updateProfileSummaryToDB(profileList: Array<any>) {
    const result = { success: true, code: ERROR_CODE.COMMON_ERROR };
    try {
        await clearProfileSummaryFromDB();
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

export async function getProfileSummaryFromDB() {
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

export async function clearProfileSummaryFromDB() {
    console.log("clearProfileSummaryFromDB");
    const result = { success: true, code: ERROR_CODE.COMMON_ERROR };
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

export async function clearCustomerSummaryById(customerId: string) {
    console.log("clearCustomerSummaryById");
    const result = { success: true, code: ERROR_CODE.COMMON_ERROR };
    try {
        const collection = realm.objects(ProfileSummary).filtered("customerId= $0", customerId);
        realm.write(() => {
            realm.delete(collection);
        });
    } catch (error) {
        result.success = false;
    }
    return result;
}
