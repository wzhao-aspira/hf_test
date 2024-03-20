import { AccessPermitItem, AccessPermit, FileInfo } from "../types/accessPermit";
import DateUtils from "../utils/DateUtils";
import AppContract from "../assets/_default/AppContract";
import { getActivePermitsByCustomerId } from "../network/api_client/DrawResultsApi";
import type { ActivePermitListVM } from "../network/api_client/DrawResultsApi";
import { saveAccessPermitDataToDB } from "../db";
import { handleError } from "../network/APIUtil";

const formateHuntDay = (huntDay, outputFormat) => {
    return huntDay && DateUtils.dateToFormat(huntDay, outputFormat, AppContract.inputFormat.fmt_2);
};

const convertAccessPermitItem = (activePermit: ActivePermitListVM): AccessPermitItem => {
    const { applicationYear, masterHuntTypeName, masterHuntTypeId, huntDays } = activePermit;
    const id = applicationYear + masterHuntTypeId;
    const name = `${applicationYear} ${masterHuntTypeName}`;
    const activePermitHuntDays = huntDays.map((item) => {
        const {
            huntId: hunIDFromAPI,
            huntCode,
            huntName,
            huntDay,
            drawnSequence,
            notificationTitle,
            notificationDescription,
            drawTicketLicenseId,
            notificationAvailable,
            fileTitle,
            fileId,
            filename,
            isDrawSequenceDisplayed,
            isGeneratedDraw,
            huntFirstOpenDate,
            huntLastCloseDate,
        } = item;

        const huntId = huntDay + huntCode;

        const notification: FileInfo = {
            id: drawTicketLicenseId,
            type: "notificationPDF",
            name: `${notificationTitle}.pdf`,
            downloadId: drawTicketLicenseId,
            available: notificationAvailable,
            title: notificationTitle,
            description: notificationDescription, // notification only
        };

        const attachment: FileInfo = {
            id: hunIDFromAPI,
            type: "attachment",
            name: filename,
            downloadId: fileId,
            available: !!fileId,
            title: fileTitle,
        };

        const fileInfoList = [notification, attachment];
        let formattedHuntDay = formateHuntDay(huntDay, AppContract.outputFormat.fmt_1);
        if (!isGeneratedDraw) {
            const firstOpenDate = formateHuntDay(huntFirstOpenDate, AppContract.outputFormat.fmt_1);
            const lastCloseDate = formateHuntDay(huntLastCloseDate, AppContract.outputFormat.fmt_1);
            formattedHuntDay = `${firstOpenDate} - ${lastCloseDate}`;
        }
        // upland type doesn't display reservation alway, common type reservation display is controlled by isDrawSequenceDisplayed
        const isDisplayReservation = isGeneratedDraw ? isDrawSequenceDisplayed : false;

        return {
            id: huntId,
            huntCode,
            huntName,
            huntDayForSort: huntDay,
            huntDay: formattedHuntDay,
            huntDayForDetail: formateHuntDay(huntDay, AppContract.outputFormat.fmt_2),
            drawnSequence,
            isDisplayReservation,
            fileInfoList,
            isGeneratedDraw, // isGeneratedDraw=false means upland
        };
    });

    return { id, name, huntDays: activePermitHuntDays };
};

const convertCustomerInfo = (customerInfo) => {
    const { firstName, lastName, goId, mailingAddress } = customerInfo;
    return { name: `${firstName} ${lastName}`, address: mailingAddress, goId };
};

export async function getAccessPermitData(searchParams: { activeProfileId: string }): Promise<AccessPermit> {
    const { activeProfileId } = searchParams;
    const getActivePermitsResult = await getActivePermitsByCustomerId(activeProfileId);
    const { result } = getActivePermitsResult.data;
    const lastUpdateDate = getActivePermitsResult?.headers?.["last-updated-date"];

    const { instructions, activePermitList, customerInfo } = result;
    const accessPermits = activePermitList.map((item) => {
        return convertAccessPermitItem(item);
    });
    const customer = convertCustomerInfo(customerInfo);
    const data = { attention: instructions, accessPermits, customer, lastUpdateDate };
    return data;
}

export async function getAccessPermitDataAndSaveToDB(profileId: string) {
    const response = await handleError(getAccessPermitData({ activeProfileId: profileId }), {
        dispatch: (actionPayload) => {
            console.log("mock dispatch function for getAccessPermitDataAndSaveToDB ", JSON.stringify(actionPayload));
        },
        showLoading: false,
        showError: false,
    });

    if (response.success) {
        const dataForOffline = { ...response.data, profileId };
        await saveAccessPermitDataToDB(dataForOffline);
        console.log("access permit data successfully saved into the database", profileId);
    }
}

export function getLoadingData() {
    const data = [];
    for (let index = 0; index < 5; index++) {
        const loadingItem = { isLoading: true, id: `Loading${index}` };
        data[index] = loadingItem;
    }
    return data;
}
