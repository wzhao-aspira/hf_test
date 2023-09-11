import { realm } from "./ConfigRealm";
import LicenseList from "./models/LicenseList";

export async function getLicenseList(activeProfileId: string) {
    console.log("Get license list");
    return realm.objects(LicenseList).filtered("profileId = $0", activeProfileId);
}

export async function saveLicenseList(licenseList: Array<any>) {
    console.log("Save license list item");
    licenseList.forEach((ele) => {
        realm.write(() => {
            realm.create(LicenseList, ele, true);
        });
    });
}

export async function removeLicenseList() {
    console.log("Remove license list");
    realm.write(() => {
        const objects = realm.objects(LicenseList);
        realm.delete(objects);
    });
}
