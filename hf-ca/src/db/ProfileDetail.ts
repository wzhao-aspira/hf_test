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
