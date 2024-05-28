export interface MobileAppAlert {
    mobileAppAlertId: number;
    subject: string;
    message: string;
    displayBeginDate: string;
    displayEndDate: string;
    isRead: boolean;
    readDate?: string;
    needSynchronizeReadState: boolean;
}
