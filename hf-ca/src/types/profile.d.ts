export interface Identification {
    ownerTypeId: null | string;
    typeId: string;
    idNumber: string;
    countryIssuedId?: string;
}

export interface Profile {
    profileId: string;
    ownerId?: null | string;
    profileType: string;
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

export interface ProfileDetail {
    customerId: string;
    customerTypeId?: null | number;
    goidNumber?: null | string;
    displayName?: null | string;
    dateOfBirth?: null | string;
    gender?: null | string;
    genderShortForm?: null | string;
    hair?: null | string;
    eye?: null | string;
    height?: null | number;
    weight?: null | number;
    fishBusinessId?: null | string;
    ownershipType?: null | string;
    vesselName?: null | string;
    ownerName?: null | string;
    purchaseDate?: null | string;
    currentDocumentation?: null | string;
    physicalAddress?: null | string;
    simplePhysicalAddress?: null | string;
    mailingAddress?: null | string;
    ownerGOIDNumber?: null | string;
    ownerPhysicalAddress?: null | string;
    ownerResidentMethodTypeId?: null | number;
    ownerSimplePhysicalAddress?: null | string;
    individualCustomerOfficialDocumentFieldName?: null | string;
    individualCustomerOfficialDocumentDisplayValue?: null | string;
    vesselCustomerDocumentIdentityFieldName?: null | string;
    vesselCustomerDocumentIdentityDisplayValue?: null | string;
    ownerOfficialDocumentFieldName?: null | string;
    ownerOfficialDocumentDisplayValue?: null | string;
}
