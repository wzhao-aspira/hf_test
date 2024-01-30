import Realm from "realm";

const schemaName = "CustomerInfo";

export default class CustomerInfo extends Realm.Object<CustomerInfo> {
    name: string;

    address: string;

    goId: string;

    static schema = {
        name: schemaName,
        embedded: true,
        properties: {
            name: "string",
            address: "string",
            goId: "string",
        },
    };
}
