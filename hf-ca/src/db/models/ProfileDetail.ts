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

    mailingAddress?: string;

    ownerGOIDNumber?: string;

    ownerPhysicalAddress?: string;

    ownerResidentMethodTypeId?: number;

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
            mailingAddress: "string?",
            ownerGOIDNumber: "string?",
            ownerPhysicalAddress: "string?",
            ownerResidentMethodTypeId: "int?",
        },
        primaryKey: "customerId",
    };
}
