import Realm from "realm";
import DrawApplicationListInfo from "./DrawApplicationListInfo";

const schemaName = "DrawApplication";

export default class DrawApplication extends Realm.Object<DrawApplication> {
    profileId: string;

    instructions?: string;

    successList: DrawApplicationListInfo;

    unSuccessList: DrawApplicationListInfo;

    pendingList: DrawApplicationListInfo;

    lastUpdateDate?: string;

    static schema = {
        name: schemaName,
        primaryKey: "profileId",
        properties: {
            profileId: "string",
            instructions: "string?",
            successList: "DrawApplicationListInfo",
            unSuccessList: "DrawApplicationListInfo",
            pendingList: "DrawApplicationListInfo",
            lastUpdateDate: "string?",
        },
    };
}
