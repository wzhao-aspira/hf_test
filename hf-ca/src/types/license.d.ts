export interface License {
    id: number;
    profileId: string;
    productName: string;
    validFrom?: Date;
    validTo?: Date;
    legalName: string;
}
