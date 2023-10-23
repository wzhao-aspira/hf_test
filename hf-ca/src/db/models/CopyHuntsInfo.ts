/* eslint-disable no-use-before-define */
import Realm from "realm";
import DrawApplicationItem from "./DrawApplicationItem";

const schemaName = "CopyHuntsInfo";

export default class CopyHuntsInfo extends Realm.Object<CopyHuntsInfo> {
    year: string;

    drawType: string;

    drawStatus?: string;

    items: DrawApplicationItem[];

    static schema = {
        name: schemaName,
        properties: {
            year: "string",
            drawType: "string",
            drawStatus: "string?",
            items: { type: "list", objectType: "DrawApplicationItem" },
        },
    };
}
