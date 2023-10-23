import type { DrawResultsListItem, DrawApplicationItem } from "../../../../types/drawApplication";
import type { FileInfo } from "../../../../types/notificationAndAttachment";

function convertDrawResultsListToDrawApplicationList(DrawResultsList: DrawResultsListItem[]): DrawApplicationItem[] {
    return DrawResultsList.map((drawResultsItem) => {
        const {
            drawTicketLicenseId,
            notificationTitle,
            notificationAvailable,
            notificationDescription,
            huntId,
            filename,
            fileId,
            fileTitle,
            isGeneratedDraw,
            drawType,
            drawStatus,
            partyNumber,
            memberNames,
            choice,
            huntCode,
            huntName,
            drawWon,
            alternateSeq,
            formatHuntDay,
            drawnSequence,
        } = drawResultsItem;

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
            id: huntId,
            type: "attachment",
            name: filename,
            downloadId: fileId,
            available: !!fileId,
            title: fileTitle,
        };

        const fileInfoList: [FileInfo, FileInfo] = [notification, attachment];

        const drawApplicationItem: DrawApplicationItem = {
            isGeneratedDraw,
            type: drawType,
            status: drawStatus,
            partNumber: partyNumber, // copy hunt only
            members: memberNames, // copy hunt only
            choiceNumber: choice, // copy hunt only
            choiceCode: huntCode, // copy hunt only
            name: huntName, // choice name for copy hunt or hunt name for generated hunt
            didIWin: drawWon, // value can be "", "Y" or "N"
            alternateNumber: alternateSeq, // copy hunt only
            huntDate: formatHuntDay,
            reservationNumber: drawnSequence,
            fileInfoList,
        };

        return drawApplicationItem;
    });
}

export default convertDrawResultsListToDrawApplicationList;
