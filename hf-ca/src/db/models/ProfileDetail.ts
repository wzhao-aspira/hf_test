/* eslint-disable no-use-before-define */
import Realm from "realm";

export default class ProfileDetail extends Realm.Object<ProfileDetail> {
    customerId: string;

    customerTypeId?: number;

    goidNumber?: string;

    displayName?: string;

    dateOfBirth?: string;

    gender?: string;

    genderShortForm?: string;

    hair?: string;

    eye?: string;

    height?: number;

    weight?: number;

    fishBusinessId?: string;

    ownershipType?: string;

    vesselName?: string;

    ownerName?: string;

    purchaseDate?: string;

    currentDocumentation?: string;

    physicalAddress?: string;

    simplePhysicalAddress?: string;

    mailingAddress?: string;

    ownerGOIDNumber?: string;

    ownerPhysicalAddress?: string;

    ownerResidentMethodTypeId?: number;

    ownerSimplePhysicalAddress?: string;

    individualCustomerOfficialDocumentFieldName?: string;

    individualCustomerOfficialDocumentDisplayValue?: string;

    vesselCustomerDocumentIdentityFieldName?: string;

    vesselCustomerDocumentIdentityDisplayValue?: string;

    ownerOfficialDocumentFieldName?: string;

    ownerOfficialDocumentDisplayValue?: string;

    static schema = {
        name: "ProfileDetail",
        properties: {
            customerId: "string",
            customerTypeId: "int?",
            goidNumber: "string?",
            displayName: "string?",
            dateOfBirth: "string?",
            gender: "string?",
            genderShortForm: "string?",
            hair: "string?",
            eye: "string?",
            height: "int?",
            weight: "int?",
            fishBusinessId: "string?",
            ownershipType: "string?",
            vesselName: "string?",
            ownerName: "string?",
            purchaseDate: "string?",
            currentDocumentation: "string?",
            physicalAddress: "string?",
            simplePhysicalAddress: "string?",
            mailingAddress: "string?",
            ownerGOIDNumber: "string?",
            ownerPhysicalAddress: "string?",
            ownerResidentMethodTypeId: "int?",
            ownerSimplePhysicalAddress: "string?",
            individualCustomerOfficialDocumentFieldName: "string?",
            individualCustomerOfficialDocumentDisplayValue: "string?",
            vesselCustomerDocumentIdentityFieldName: "string?",
            vesselCustomerDocumentIdentityDisplayValue: "string?",
            ownerOfficialDocumentFieldName: "string?",
            ownerOfficialDocumentDisplayValue: "string?",
        },
        primaryKey: "customerId",
    };
}
