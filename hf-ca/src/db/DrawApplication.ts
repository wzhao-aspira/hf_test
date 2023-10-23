import { realm } from "./ConfigRealm";
import DrawApplication from "./models/DrawApplication";

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
    realm.write(() => {
        const objects = realm.objects(DrawApplication);
        realm.delete(objects);
    });
}
