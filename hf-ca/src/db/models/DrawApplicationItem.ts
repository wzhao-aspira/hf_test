/* eslint-disable no-use-before-define */
import Realm from "realm";

const schemaName = "DrawApplicationItem";

export default class DrawApplicationItem extends Realm.Object<DrawApplicationItem> {
    id: string;

    year: string;

    drawType: string;

    drawStatus?: string;

    huntId: string;

    huntCode: string;

    formatHuntDay?: string;

    drawnSequence?: number;

    isDrawSequenceDisplayed: boolean;

    huntName?: string;

    partyNumber?: string;

    memberNames?: string[];

    choice?: number;

    drawWon?: string;

    alternateSeq?: string;

    isGeneratedDraw: boolean;

    drawTicketLicenseId?: string;

    notificationTitle?: string;

    notificationAvailable: boolean;

    notificationDescription?: string;

    filename?: string;

    fileId?: string;

    fileTitle?: string;

    isMultiChoice: boolean;

    static schema = {
        name: schemaName,
        embedded: true,
        properties: {
            id: "string",
            year: "string",
            drawType: "string",
            drawStatus: "string?",
            huntId: "string",
            huntCode: "string",
            formatHuntDay: "string?",
            drawnSequence: "int?",
            isDrawSequenceDisplayed: "bool",
            huntName: "string?",
            partyNumber: "string?",
            memberNames: { type: "list", objectType: "string" },
            choice: "int?",
            drawWon: "string?",
            alternateSeq: "string?",
            isGeneratedDraw: "bool",
            drawTicketLicenseId: "string?",
            notificationTitle: "string?",
            notificationAvailable: "bool",
            notificationDescription: "string?",
            filename: "string?",
            fileId: "string?",
            fileTitle: "string?",
            isMultiChoice: "bool",
        },
    };
}
