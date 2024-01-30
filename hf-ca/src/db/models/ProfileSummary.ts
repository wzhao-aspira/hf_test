import Realm from "realm";

export default class ProfileSummary extends Realm.Object<ProfileSummary> {
    customerId: string;

    customerTypeId?: number;

    isPrimary?: boolean;

    goid?: string;

    name?: string;

    static schema = {
        name: "ProfileSummary",
        properties: {
            customerId: "string",
            customerTypeId: "int?",
            isPrimary: "bool?",
            goid: "string?",
            name: "string?",
        },
        primaryKey: "customerId",
    };
}
