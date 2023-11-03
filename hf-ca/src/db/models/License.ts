/* eslint-disable no-use-before-define */
import Realm from "realm";

export default class License extends Realm.Object<License> {
    pk: string;

    profileId!: string;

    id: string;

    name: string;

    validFrom?: string;

    validTo?: string;

    uiTabId: string;

    uiTabName: string;

    mobileAppNeedPhysicalDocument: boolean;

    documentCode: string;

    validityCornerTitle: string;

    altTextValidFromTo: string;

    additionalValidityText: string;

    itemTypeId: number;

    itemName: string;

    lePermitTypeName: string;

    lePermitId: string;

    printedDescriptiveText: string;

    duplicateWatermark: string;

    amount: number;

    documentNumber: string;

    isHarvestReportSubmissionAllowed: boolean;

    isHarvestReportSubmissionEnabled: boolean;

    isHarvestReportSubmitted: boolean;

    licenseNotInReportingPeriodAttention?: string;

    licenseReportId?: string;

    huntTagDescription?: string;

    static schema = {
        name: "License",
        primaryKey: "pk",
        properties: {
            pk: "string",
            profileId: "string",
            id: "string",
            name: "string",
            validFrom: "string?",
            validTo: "string?",
            uiTabId: "string",
            uiTabName: "string",
            mobileAppNeedPhysicalDocument: "bool",
            documentCode: "string",
            validityCornerTitle: "string?",
            altTextValidFromTo: "string",
            additionalValidityText: "string?",
            itemTypeId: "int",
            itemName: "string",
            lePermitTypeName: "string?",
            lePermitId: "string?",
            printedDescriptiveText: "string?",
            duplicateWatermark: "string?",
            amount: "double",
            documentNumber: "string",
            isHarvestReportSubmissionAllowed: "bool",
            isHarvestReportSubmissionEnabled: "bool",
            isHarvestReportSubmitted: "bool",
            licenseNotInReportingPeriodAttention: "string?",
            licenseReportId: "string?",
            huntTagDescription: "string?",
        },
    };
}
