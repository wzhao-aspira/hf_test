/* eslint-disable no-use-before-define */
import Realm from "realm";

const schemaName = "CustomerInfo";

export default class CustomerInfo extends Realm.Object<CustomerInfo> {
    name: string;

    address: string;

    goId: string;

    static schema = {
        name: schemaName,
        properties: {
            name: "string",
            address: "string",
            goId: "string",
        },
    };
}
