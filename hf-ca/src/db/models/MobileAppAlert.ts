import Realm from "realm";
const schemaName = "MobileAppAlert";
export class MobileAppAlert extends Realm.Object<MobileAppAlert> {
    mobileAppAlertId: number;
    subject: string | null;
    message: string | null;
    displayBeginDate: string;
    displayEndDate: string;
    isRead: boolean;
    readDate?: string | null;
    needSynchronizeReadState: boolean | null;
    order: number;

    static schema = {
        name: schemaName,
        embedded: false,
        primaryKey: "mobileAppAlertId",
        properties: {
            mobileAppAlertId: "int",
            subject: "string",
            message: "string",
            displayBeginDate: "string",
            displayEndDate: "string",
            isRead: "bool",
            readDate: "string?",
            needSynchronizeReadState: "bool",
            order: "int",
        },
    };
}
