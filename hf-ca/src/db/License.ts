import { ERROR_CODE } from "../constants/Constants";
import { realm } from "./ConfigRealm";
import License from "./models/License";
import LicenseLastUpdateTime from "./models/LicenseLastUpdateTime";

export async function getLicenseListData(activeProfileId: string) {
    console.log("Get license list data");
    return realm.objects(License).filtered("profileId = $0", activeProfileId);
}

export async function saveLicenseListData(activeProfileId: string, licenseList: Array<Partial<License>>) {
    console.log("Save license list data");
    await removeLicenseListDataByProfileId(activeProfileId);
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
        realm.delete(realm.objects(LicenseLastUpdateTime));
    });
}

export async function removeLicenseListDataByProfileId(activeProfileId: string) {
    console.log("Remove license list data by profile id");
    const result = { success: true, code: ERROR_CODE.COMMON_ERROR };
    try {
        const collection = await getLicenseListData(activeProfileId);
        realm.write(() => {
            realm.delete(collection);
        });
    } catch (error) {
        result.success = false;
    }
    return result;
}

export async function getLicenseLastUpdateTimeData(profileId: string) {
    console.log("Get license last update time data");
    return realm.objects(LicenseLastUpdateTime).filtered("profileId = $0", profileId);
}

export async function saveLicenseLastUpdateTimeData(licenseLastUpdateTime: any) {
    console.log("Save license last update time data");
    realm.write(() => {
        realm.create(LicenseLastUpdateTime, licenseLastUpdateTime, true);
    });
}
