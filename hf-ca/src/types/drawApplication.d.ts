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
    fileInfoList?: [FileInfo, FileInfo];
}

export interface DrawResultsListItem {
    year?: string;
    drawStatus?: string;
    drawType?: string;
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
}

export interface FormattedCopyHuntListItem extends DrawResultsListItem {
    items?: { huntName: string; huntCode: string; isDrawWon: boolean }[];
}
export interface NonPendingStatusList {
    copyHuntsList?: DrawResultsListItem[][];
    generatedHuntsList?: DrawResultsListItem[];
    multiChoiceCopyHuntsList?: DrawResultsListItem[];
    formattedCopyHuntList?: FormattedCopyHuntListItem[];
}
export interface DrawApplicationList {
    instructions?: string;
    successList?: NonPendingStatusList;
    unSuccessList?: NonPendingStatusList;
    pendingList?: DrawResultsListItem[];
}

export type DrawApplicationListTabName = "pending" | "successful" | "unsuccessful";
export type DrawApplicationListGroupName = "copyHunt" | "generatedHunt" | "multiChoiceCopy";
