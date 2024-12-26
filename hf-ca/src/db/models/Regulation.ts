import Realm from "realm";

export default class Regulation extends Realm.Object<Regulation> {

    regulationId: string;

    regulationTitle: string;

    regulationUrl: string;

    downloadedPath?: string;

    downloadedRegulationETag?: string;

    downloadedTimestamp?: number;

    regulationStatus?: number;  // 1: downloaded; 2: outdated;

    static schema = {
        name: "Regulation",
        primaryKey: "regulationId",
        properties: {
            regulationId: "string",
            regulationTitle: "string",
            regulationUrl: "string",
            downloadedPath: "string?",
            downloadedRegulationETag: "string?",
            downloadedTimestamp: "int?",
            regulationStatus: "int?"
        }
    };
}
