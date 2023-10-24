import Realm from "realm";
import { ERROR_CODE } from "../constants/Constants";
import ProfileSummary from "./models/ProfileSummary";
import { realm } from "./ConfigRealm";
import ProfileDetail from "./models/ProfileDetail";

export async function updateProfileSummaryToDB(profileList: Array<any>) {
    console.log("ProfileSummary - updateProfileSummaryToDB");
    const result = { success: true, code: ERROR_CODE.COMMON_ERROR };
    try {
        await clearCustomerSummaryFromDB();
        profileList.forEach((ele) => {
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
    console.log("ProfileSummary - getProfileSummaryFromDB");
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
    return result;
}

export async function clearProfileSummaryFromDB() {
    console.log("ProfileSummary - clearProfileSummaryFromDB");
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

export async function clearCustomerSummaryFromDB() {
    console.log("ProfileSummary - clearCustomerSummaryFromDB");
    const result = { success: true, code: ERROR_CODE.COMMON_ERROR };
    try {
        realm.write(() => {
            realm.delete(realm.objects(ProfileSummary));
        });
    } catch (error) {
        result.success = false;
    }
    return result;
}

export async function clearCustomerSummaryById(customerId: string) {
    console.log("ProfileSummary - clearCustomerSummaryById");
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
