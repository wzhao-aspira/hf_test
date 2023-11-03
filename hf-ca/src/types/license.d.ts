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
    documentNumber: string;
    uiTabId: string;
    uiTabName: string;
    validFrom: string;
    validTo: string;
    documentCode: string;
    validityCornerTitle: string;
    altTextValidFromTo: string;
    lePermitTypeName: string;
    lePermitId: string;
    printedDescriptiveText: string;
    duplicateWatermark: string;
    itemName: string;
    itemYear: string;
    altTextValidFromTo: string;
    additionalValidityText: string;
    amount: number;
    mobileAppNeedPhysicalDocument: boolean;
    isHarvestReportSubmissionAllowed: boolean;
    isHarvestReportSubmissionEnabled: boolean;
    isHarvestReportSubmitted: boolean;
    licenseReportId: string;
    licenseNotInReportingPeriodAttention: string;
    huntTagDescription: string;
}

export interface LicenseLastUpdateTime {
    profileId: string;
    lastUpdateTime: string;
}
