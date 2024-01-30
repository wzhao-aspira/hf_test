import Realm from "realm";

const schemaName = "LicenseLastUpdateTime";

export default class LicenseLastUpdateTime extends Realm.Object<LicenseLastUpdateTime> {
    profileId: string;

    lastUpdateTime?: string;

    static schema = {
        name: schemaName,
        primaryKey: "profileId",
        properties: {
            profileId: "string",
            lastUpdateTime: "string?",
        },
    };
}
