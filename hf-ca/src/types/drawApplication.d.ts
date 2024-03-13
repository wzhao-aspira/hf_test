import { FileInfo } from "./notificationAndAttachment";

export interface DrawApplicationItem {
    isGeneratedDraw: boolean;
    type: string;
    status: string;
    partNumber: string;
    members: string[];
    choiceNumber: number;
    choiceCode: string;
    name: string;
    didIWin?: string;
    alternateNumber?: string;
    huntDate?: string;
    reservationNumber?: number;
    isReservationNumberDisplayed?: boolean;
    fileInfoList?: [FileInfo, FileInfo];
}

export interface DrawResultsListItem {
    id: string;
    year: string;
    drawStatus?: string;
    drawType: string;
    memberNames?: string[];
    partyNumber?: string;
    choice?: number;
    drawWon?: string;
    alternateSeq?: string;
    huntId?: string;
    huntCode?: string;
    huntName?: string;
    fileId?: string;
    fileTitle?: string;
    filename?: string;
    drawTicketLicenseId?: string;
    notificationAvailable?: boolean;
    notificationTitle?: string;
    notificationDescription?: string;
    drawnSequence?: number;
    huntDay?: string;
    formatHuntDay?: string;
    isDrawSequenceDisplayed?: boolean;
    huntFirstOpenDate?: string;
    huntLastCloseDate?: string;
    isGeneratedDraw?: boolean;
    isMultiChoice?: boolean;
}

export interface CopyHuntsItem {
    year: string;
    drawType: string;
    drawStatus: string;
    partyNumber: string;
    isMultiChoice: boolean;
    items?: DrawResultsListItem[];
}
export interface DrawTabData {
    copyHuntsList?: CopyHuntsItem[];
    generatedHuntsList?: DrawResultsListItem[];
}
export interface DrawApplicationList {
    instructions?: string;
    successList?: DrawTabData;
    unSuccessList?: DrawTabData;
    historyUnSuccessList: DrawTabData;
    historySuccessList: DrawTabData;
    pendingList?: DrawTabData;
    lastUpdateDate?: string;
}

export type DrawApplicationListTabName = "pending" | "successful" | "unsuccessful";
export type DrawApplicationListGroupName = "copyHunt" | "generatedHunt" | "multiChoiceCopy";
