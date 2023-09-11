/* eslint-disable no-use-before-define */
import Realm from "realm";

export default class LicenseList extends Realm.Object<LicenseList> {
    pk: string;

    profileId!: string;

    id: string;

    name: string;

    validFrom?: string;

    validTo?: string;

    mobileAppNeedPhysicalDocument: boolean;

    uiTabName: string;

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
            mobileAppNeedPhysicalDocument: "bool",
            uiTabName: "string",
        },
    };
}
