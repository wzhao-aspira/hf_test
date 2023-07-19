export interface Identification {
    ownerTypeId: null | string;
    typeId: string;
    idNumber: string;
    countryIssuedId?: string;
}

export interface Profile {
    profileId: string;
    ownerId: null | string;
    profileType: string;
    dateOfBirth: null | string;
    goIDNumber: string;
    firstName: null | string;
    lastName: null | string;
    businessName?: null | string;
    displayName: string;
    isNeedCRSS: boolean;
    crssPassword: null | string;
    crssEmail: null | string;
    postalCodeNumber: null | string;
    fgNumber: null | string;
    identification: Identification[] | null;
    residenceAddress: null | string;
    mailingAddress: null | string;
    gender: null | string;
    hair: null | string;
    eye: null | string;
    height: number | null;
    weight: number | null;
    fishBusinessId: null | string;
    ownershipType: null | string;
    vesselName: null | string;
    purchaseDate: null | string;
    currentDocumentation: null | string;
    middleName?: string;
    valid: boolean;
}
