import { realm } from "./ConfigRealm";
import PreferencePoint from "./models/PreferencePoint";

export async function getPreferencePointListFromDB(activeProfileId: string) {
    console.log("Get preference point list");
    return realm.objects(PreferencePoint).filtered("profileId = $0", activeProfileId);
}

export async function savePreferencePointListToDB(preferencePointList: Array<PreferencePoint>) {
    console.log("Save preference point list item");
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
