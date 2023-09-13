import { realm } from "./ConfigRealm";
import License from "./models/License";

export async function getLicenseListData(activeProfileId: string) {
    console.log("Get license list data");
    return realm.objects(License).filtered("profileId = $0", activeProfileId);
}

export async function saveLicenseListData(licenseList: Array<Partial<License>>) {
    console.log("Save license list data");
    licenseList.forEach((ele) => {
        realm.write(() => {
            realm.create(License, ele, true);
        });
    });
}

export async function removeLicenseListData() {
    console.log("Remove license list data");
    realm.write(() => {
        const objects = realm.objects(License);
        realm.delete(objects);
    });
}
