/* eslint-disable no-use-before-define */
import Realm from "realm";
import DrawApplicationItem from "./DrawApplicationItem";
import DrawApplicationNonPendingInfo from "./DrawApplicationNonPendingInfo";

const schemaName = "DrawApplication";

export default class DrawApplication extends Realm.Object<DrawApplication> {
    profileId: string;

    instructions?: string;

    successList: DrawApplicationNonPendingInfo;

    unSuccessList: DrawApplicationNonPendingInfo;

    pendingList: DrawApplicationItem[];

    static schema = {
        name: schemaName,
        primaryKey: "profileId",
        properties: {
            profileId: "string",
            instructions: "string?",
            successList: "DrawApplicationNonPendingInfo",
            unSuccessList: "DrawApplicationNonPendingInfo",
            pendingList: { type: "list", objectType: "DrawApplicationItem" },
        },
    };
}
