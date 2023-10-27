/* eslint-disable no-use-before-define */
import Realm from "realm";

const schemaName = "FileInfo";

export default class FileInfo extends Realm.Object<FileInfo> {
    type: string;

    title: string;

    description?: string;

    downloadId: string;

    isShow: boolean;

    static schema = {
        name: schemaName,
        embedded: true,
        properties: {
            type: "string",
            title: "string?",
            description: "string?",
            downloadId: "string?",
            available: "bool",
        },
    };
}
