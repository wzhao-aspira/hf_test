// export type FileType = "File1" | "File2";
import { FileInfo } from "./notificationAndAttachment";

export { FileInfo };

export interface HuntDay {
    id: string;
    huntCode: string;
    huntName: string;
    huntDay: string;
    huntDayForDetail: string;
    huntDayForSort: string;
    drawnSequence: number;
    fileInfoList: FileInfo[];
    isDisplayReservation: boolean;
    isGeneratedDraw: boolean;
    huntFirstOpenDate: string;
    huntLastCloseDate: string;
}

export interface AccessPermitItem {
    id: string;
    name: string;
    huntDays: HuntDay[];
}

export interface CustomerInfo {
    name: string;
    address: string;
    goId: string;
}

export interface AccessPermit {
    accessPermits: AccessPermitItem[];
    attention: string;
    customer: CustomerInfo;
}
