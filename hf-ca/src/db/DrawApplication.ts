import { realm } from "./ConfigRealm";
import CopyHuntsInfo from "./models/CopyHuntsInfo";
import DrawApplication from "./models/DrawApplication";
import DrawApplicationItem from "./models/DrawApplicationItem";
import DrawApplicationNonPendingInfo from "./models/DrawApplicationNonPendingInfo";

export async function getDrawApplicationDataFromDB(activeProfileId: string) {
    let response = {};
    try {
        console.log("Get draw application data");
        const data = realm.objects(DrawApplication).filtered("profileId = $0", activeProfileId);
        if (data && data.length > 0) {
            return JSON.parse(JSON.stringify(data[0]));
        }
        response = data;
    } catch (error) {
        console.log("getDrawApplicationDataFromDB error", error);
    }
    return response;
}

export async function saveDrawApplicationDataToDB(drawData: any) {
    console.log("Save draw application data");
    realm.write(() => {
        realm.create(DrawApplication, drawData, true);
    });
}

export async function deleteDrawApplicationDataFromDB() {
    console.log("Remove draw application data");
    try {
        realm.write(() => {
            realm.delete(realm.objects(DrawApplication));
            realm.delete(realm.objects(CopyHuntsInfo));
            realm.delete(realm.objects(DrawApplicationItem));
            realm.delete(realm.objects(DrawApplicationNonPendingInfo));
        });
    } catch (error) {
        console.log("deleteDrawApplicationDataFromDB error:", error);
    }
}
