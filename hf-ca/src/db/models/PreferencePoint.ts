import Realm from "realm";

export default class PreferencePoint extends Realm.Object<PreferencePoint> {
    pk: string;

    profileId!: string;

    huntTypeName!: string;

    currentPreferencePoints!: number;

    lastParticipationLicenseYear!: number;

    static schema = {
        name: "PreferencePoint",
        primaryKey: "pk",
        properties: {
            pk: "string",
            profileId: "string",
            huntTypeName: "string",
            currentPreferencePoints: "int",
            lastParticipationLicenseYear: "int",
        },
    };
}
