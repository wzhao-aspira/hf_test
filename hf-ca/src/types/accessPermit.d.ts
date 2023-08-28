export interface HuntDay {
    id: String;
    huntCode: string;
    huntName: string;
    huntDay: string;
}

export interface AccessPermitItem {
    id: string;
    name: string;
    huntDays: HuntDay[];
}

export interface AccessPermit {
    accessPermits: AccessPermitItem[];
    attention: string;
}
