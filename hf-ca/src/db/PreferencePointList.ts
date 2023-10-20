import { ERROR_CODE } from "../constants/Constants";
import { realm } from "./ConfigRealm";
import PreferencePoint from "./models/PreferencePoint";

export async function getPreferencePointListFromDB(activeProfileId: string) {
    console.log("Get preference point list");
    return realm.objects(PreferencePoint).filtered("profileId = $0", activeProfileId);
}

export async function savePreferencePointListToDB(
    activeProfileId: string,
    preferencePointList: Array<Partial<PreferencePoint>>
) {
    console.log("Save preference point list item");
    await removePreferencePointListByProfileId(activeProfileId);
    preferencePointList.forEach((ele) => {
        realm.write(() => {
            realm.create(PreferencePoint, ele, true);
        });
    });
}

export async function removePreferencePointListFromDB() {
    console.log("Remove preference point list");
    realm.write(() => {
        const objects = realm.objects(PreferencePoint);
        realm.delete(objects);
    });
}

export async function removePreferencePointListByProfileId(activeProfileId: string) {
    console.log("Remove preference point list by profile id");
    const result = { success: true, code: ERROR_CODE.COMMON_ERROR };
    try {
        const collection = await getPreferencePointListFromDB(activeProfileId);
        realm.write(() => {
            realm.delete(collection);
        });
    } catch (error) {
        result.success = false;
    }
    return result;
}
