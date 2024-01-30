import Realm from "realm";
import AccessPermitItem from "./AccessPermitItem";
import CustomerInfo from "./CustomerInfo";

const schemaName = "AccessPermit";

export default class AccessPermit extends Realm.Object<AccessPermit> {
    profileId: string;

    attention: string;

    customer: CustomerInfo;

    accessPermits: AccessPermitItem[];

    lastUpdateDate?: string;

    static schema = {
        name: schemaName,
        primaryKey: "profileId",
        properties: {
            profileId: "string",
            attention: "string",
            customer: "CustomerInfo",
            accessPermits: { type: "list", objectType: "AccessPermitItem" },
            lastUpdateDate: "string?",
        },
    };
}
