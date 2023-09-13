/* eslint-disable no-use-before-define */
import Realm from "realm";

export default class LicenseList extends Realm.Object<LicenseList> {
    pk: string;

    profileId!: string;

    id: string;

    name: string;

    validFrom?: string;

    validTo?: string;

    uiTabId: number;

    uiTabName: string;

    mobileAppNeedPhysicalDocument: boolean;

    static schema = {
        name: "LicenseList",
        primaryKey: "pk",
        properties: {
            pk: "string",
            profileId: "string",
            id: "string",
            name: "string",
            validFrom: "string?",
            validTo: "string?",
            uiTabId: "int",
            uiTabName: "string",
            mobileAppNeedPhysicalDocument: "bool",
        },
    };
}
