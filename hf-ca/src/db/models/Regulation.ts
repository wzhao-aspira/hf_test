import Realm from "realm";

export default class Regulation extends Realm.Object<Regulation> {

    regulationId: string;

    regulationTitle: string;

    regulationUrl: string;

    downloadedPath?: string;

    downloadedRegulationETag?: string;

    downloadedTimestamp?: number;

    regulationStatus?: number;  //Finished = 1,  AutoUpdateQueued = 2, AutoUpdateStarted = 3, AutoUpdateFailed = 4, AutoUpdateCompleted = 5, UpdateNotified = 6

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
