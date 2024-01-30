import Realm from "realm";
import HuntDay from "./HuntDay";

const schemaName = "AccessPermitItem";

export default class AccessPermitItem extends Realm.Object<AccessPermitItem> {
    id: string;

    name: string;

    huntDays: HuntDay[];

    static schema = {
        name: schemaName,
        embedded: true,
        properties: {
            id: "string",
            name: "string",
            huntDays: { type: "list", objectType: "HuntDay" },
        },
    };
}
