/* eslint-disable no-use-before-define */
import Realm from "realm";
import FileInfo from "./FileInfo";

const schemaName = "HuntDay";

export default class HuntDay extends Realm.Object<HuntDay> {
    id: string;

    huntCode: string;

    huntName: string;

    huntDay: string;

    huntDayForDetail: string;

    huntDayForSort: string;

    drawnSequence: number;

    fileInfoList: FileInfo[];

    static schema = {
        name: schemaName,
        properties: {
            id: "string",
            huntCode: "string",
            huntName: "string",
            huntDay: "string",
            huntDayForDetail: "string",
            huntDayForSort: "string",
            drawnSequence: "int",
            fileInfoList: { type: "list", objectType: "FileInfo" },
        },
    };
}
