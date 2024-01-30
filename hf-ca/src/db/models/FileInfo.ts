import Realm from "realm";

const schemaName = "FileInfo";

export default class FileInfo extends Realm.Object<FileInfo> {
    type: string;

    id: string;

    name: string | null;

    title: string;

    description?: string;

    downloadId: string;

    available: boolean;

    static schema = {
        name: schemaName,
        embedded: true,
        properties: {
            type: "string",
            id: "string",
            name: "string?",
            title: "string?",
            description: "string?",
            downloadId: "string?",
            available: "bool",
        },
    };
}
