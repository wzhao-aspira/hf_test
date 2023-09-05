interface BasicInformation {
    DOB: string;
    gender: string;
    hair: string;
    eyes: string;
    height: string;
    weight: string;
    resident: string;
}

interface Notification {
    text: string;
}

export interface License {
    id: string;
    name: string;
    validFrom: string;
    validTo: string;
    licenseOwner: string;
    GOID: number;
    stateID: string;
    documentNumber: string;
    basicInformation: BasicInformation;
    notification: Notification;
    uiTabId: number;
    uiTabName: string;
    mobileAppNeedPhysicalDocument: boolean;
}
