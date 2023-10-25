import { realm } from "./ConfigRealm";
import AccessPermit from "./models/AccessPermit";

export async function getAccessPermitDataFromDB(activeProfileId: string) {
    console.log("Get access permit data");
    const data = realm.objects(AccessPermit).filtered("profileId = $0", activeProfileId);
    if (data && data.length > 0) {
        return JSON.parse(JSON.stringify(data[0]));
    }
    return data;
}

export async function saveAccessPermitDataToDB(accessPermit: any) {
    console.log("Save access permit data");
    try {
        realm.write(() => {
            realm.create(AccessPermit, accessPermit, true);
        });
    } catch (error) {
        console.log(error);
    }
}

export async function removeAccessPermitFromDB() {
    console.log("Remove access permit data");
    realm.write(() => {
        const objects = realm.objects(AccessPermit);
        realm.delete(objects);
    });
}
