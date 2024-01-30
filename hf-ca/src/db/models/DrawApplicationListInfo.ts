import Realm from "realm";
import DrawApplicationItem from "./DrawApplicationItem";
import CopyHuntsInfo from "./CopyHuntsInfo";

const schemaName = "DrawApplicationListInfo";

export default class DrawApplicationListInfo extends Realm.Object<DrawApplicationListInfo> {
    copyHuntsList: CopyHuntsInfo[];

    generatedHuntsList: DrawApplicationItem[];

    static schema = {
        name: schemaName,
        embedded: true,
        properties: {
            copyHuntsList: { type: "list", objectType: "CopyHuntsInfo" },
            generatedHuntsList: { type: "list", objectType: "DrawApplicationItem" },
        },
    };
}
