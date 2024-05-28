import moment from "moment";
import { MarkMobileAppIdAsReadVM } from "../network/generated";
import { realm } from "./ConfigRealm";
import { MobileAppAlert } from "./models/MobileAppAlert";

export async function getMobileAppAlertRealmQuery() {
    console.log("Get MobileAppAlert data from DB");
    return realm.objects(MobileAppAlert).sorted("order", false);
}

export async function saveMobileAppAlertData(mobileAppAlerts: Array<Partial<MobileAppAlert>>) {
    console.log("Save mobile app alert data");
    mobileAppAlerts.forEach((x) => {
        x.needSynchronizeReadState = false;
        realm.write(() => {
            realm.create(MobileAppAlert, x, true);
        });
    });
}

export async function removeMobileAppAlertData() {
    console.log("Remove MobileAppAlertData");
    realm.write(() => {
        const objects = realm.objects(MobileAppAlert);
        realm.delete(objects);
    });
}

export async function markMobileAppAlertAsReadDbCommand(markAsReadVms: Array<MarkMobileAppIdAsReadVM>) {
    console.log(
        `Mark the following MobileAppAlerts as read: ${markAsReadVms.map((x) => x.mobileAppAlertId).join(",")}`
    );
    const MobileAppAlerts = realm.objects(MobileAppAlert);
    const realmObjects = MobileAppAlerts.filtered(
        "mobileAppAlertId IN $0",
        markAsReadVms.map((x) => x.mobileAppAlertId)
    );
    realm.write(() => {
        realmObjects.forEach((x) => {
            x.isRead = true;
            x.readDate = moment().toISOString();
            x.needSynchronizeReadState = false;
        });
    });
}
export function getByIds(ids: number[]) {
    const MobileAppAlerts = realm.objects(MobileAppAlert);
    const realmObjects = MobileAppAlerts.filtered("mobileAppAlertId IN $0", ids);

    return realmObjects;
}
export function markMobileAppAlertNeedSynchronize(markAsReadVms: Array<MarkMobileAppIdAsReadVM>) {
    const realmObjects = getByIds(markAsReadVms.map((x) => x.mobileAppAlertId));
    realm.write(() => {
        realmObjects.forEach((x) => {
            x.needSynchronizeReadState = true;
        });
    });
}

export function getAllPendingSynchronizeObjects() {
    const MobileAppAlerts = realm.objects(MobileAppAlert);
    const realmObjects = MobileAppAlerts.filtered("needSynchronizeReadState = $0", true);
    return realmObjects;
}

export function markAsSynchronized(markAsReadVms: Array<MarkMobileAppIdAsReadVM>) {
    const realmObjects = getByIds(markAsReadVms.map((x) => x.mobileAppAlertId));
    realm.write(() => {
        realmObjects.forEach((x) => {
            x.needSynchronizeReadState = false;
        });
    });
}
