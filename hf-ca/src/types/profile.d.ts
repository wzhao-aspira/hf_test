import { CustomerVM } from "../network/generated";

export interface Identification {
    ownerTypeId: null | string;
    typeId: string;
    idNumber: string;
    countryIssuedId?: string;
}

export interface Profile {
    profileId: string;
    ownerId?: null | string;
    profileType: number;
    dateOfBirth?: null | string;
    goIDNumber: string;
    firstName?: null | string;
    lastName?: null | string;
    businessName?: null | string;
    displayName: string;
    postalCodeNumber?: null | string;
    fgNumber?: null | string;
    physicalAddress?: null | string;
    mailingAddress?: null | string;
    gender?: null | string;
    hair?: null | string;
    eye?: null | string;
    height?: number | null;
    weight?: number | null;
    fishBusinessId?: null | string;
    ownershipType?: null | string;
    vesselName?: null | string;
    purchaseDate?: null | string;
    currentDocumentation?: null | string;
    middleName?: string;
    ownerName?: string;
}

export interface ProfileDetail extends CustomerVM {
    individualCustomerOfficialDocumentFieldName?: null | string;
    individualCustomerOfficialDocumentDisplayValue?: null | string;
    vesselCustomerDocumentIdentityFieldName?: null | string;
    vesselCustomerDocumentIdentityDisplayValue?: null | string;
    ownerOfficialDocumentFieldName?: null | string;
    ownerOfficialDocumentDisplayValue?: null | string;
    displayBreadth?: null | string;
    displayDepth?: null | string;
    displayGrossTonnage?: null | string;
    displayLength?: null | string;
    displayNetTonnage?: null | string;
}
