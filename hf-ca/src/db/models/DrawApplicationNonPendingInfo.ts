/* eslint-disable no-use-before-define */
import Realm from "realm";
import DrawApplicationItem from "./DrawApplicationItem";
import CopyHuntsInfo from "./CopyHuntsInfo";

const schemaName = "DrawApplicationNonPendingInfo";

export default class DrawApplicationNonPendingInfo extends Realm.Object<DrawApplicationNonPendingInfo> {
    copyHuntsList: CopyHuntsInfo[];

    generatedHuntsList: DrawApplicationItem[];

    multiChoiceCopyHuntsList: DrawApplicationItem[];

    static schema = {
        name: schemaName,
        embedded: true,
        properties: {
            copyHuntsList: { type: "list", objectType: "CopyHuntsInfo" },
            generatedHuntsList: { type: "list", objectType: "DrawApplicationItem" },
            multiChoiceCopyHuntsList: { type: "list", objectType: "DrawApplicationItem" },
        },
    };
}
