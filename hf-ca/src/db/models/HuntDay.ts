import Realm from "realm";
import FileInfo from "./FileInfo";

const schemaName = "HuntDay";

export default class HuntDay extends Realm.Object<HuntDay> {
    id: string;

    huntCode?: string;

    huntName: string;

    huntDay?: string;

    huntDayForDetail?: string;

    huntDayForSort?: string;

    drawnSequence?: number;

    isDisplayReservation: boolean;

    isGeneratedDraw: boolean;

    fileInfoList: FileInfo[];

    static schema = {
        name: schemaName,
        embedded: true,
        properties: {
            id: "string",
            huntCode: "string?",
            huntName: "string",
            huntDay: "string?",
            huntDayForDetail: "string?",
            huntDayForSort: "string?",
            drawnSequence: "int?",
            isDisplayReservation: "bool",
            isGeneratedDraw: "bool",
            fileInfoList: { type: "list", objectType: "FileInfo" },
        },
    };
}
