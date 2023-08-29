export interface HuntDay {
    id: String;
    huntCode: string;
    huntName: string;
    huntDay: string;
    huntDayForDetail: string;
    huntDayForSort: string;
    drawnSequence: number;
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
