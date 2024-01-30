import Realm from "realm";

const schemaName = "PreferencePointLastUpdateDate";

export default class PreferencePointLastUpdateDate extends Realm.Object<PreferencePointLastUpdateDate> {
    profileId: string;

    lastUpdateDate?: string;

    static schema = {
        name: schemaName,
        primaryKey: "profileId",
        properties: {
            profileId: "string",
            lastUpdateDate: "string?",
        },
    };
}
