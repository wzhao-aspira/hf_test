// export type FileType = "File1" | "File2";

export interface FileInfo {
    type: "notificationPDF" | "attachment";
    id: string;
    name: string;
    title: string;
    description?: string;
    downloadId: string;
    available: boolean;
}

export interface HuntDay {
    id: string;
    huntCode: string;
    huntName: string;
    huntDay: string;
    huntDayForDetail: string;
    huntDayForSort: string;
    drawnSequence: number;
    fileInfoList: FileInfo[];
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
