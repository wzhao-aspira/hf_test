import Realm from "realm";
import { ERROR_CODE } from "../constants/Constants";
import ProfileDetail from "./models/ProfileDetail";
import { realm } from "./ConfigRealm";

export async function updateProfileDetailToDB(profile: any) {
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

export async function getProfileDetailFromDB(profileId: string) {
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

export async function clearCustomerDetailById(customerId: string) {
    console.log("clearCustomerDetailById");
    const result = { success: true, code: ERROR_CODE.COMMON_ERROR };
    try {
        const collection = realm.objects(ProfileDetail).filtered("customerId= $0", customerId);
        realm.write(() => {
            realm.delete(collection);
        });
    } catch (error) {
        result.success = false;
    }
    return result;
}
