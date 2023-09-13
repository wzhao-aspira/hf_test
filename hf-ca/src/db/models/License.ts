/* eslint-disable no-use-before-define */
import Realm from "realm";

export default class License extends Realm.Object<License> {
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
        name: "License",
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
