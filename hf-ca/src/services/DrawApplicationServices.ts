import { isEmpty } from "lodash";
import type { DrawApplicationList, DrawTabData } from "../types/drawApplication";
import { getDrawApplicationListByCustomerId } from "../network/api_client/DrawResultsApi";
import DateUtils from "../utils/DateUtils";
import AppContract from "../assets/_default/AppContract";
import { DrawResultsListVM, DrawStatusList } from "../network/generated";

const convertDrawApplicationItem = (drawItem: DrawResultsListVM) => {
    const {
        id,
        year,
        drawType,
        drawStatus,
        huntId,
        huntCode,
        huntDay,
        drawnSequence,
        isDrawSequenceDisplayed,
        huntName,
        partyNumber,
        memberNames,
        choice,
        drawWon,
        alternateSeq,
        isGeneratedDraw,
        drawTicketLicenseId,
        notificationTitle,
        notificationAvailable,
        notificationDescription,
        filename,
        fileId,
        fileTitle,
        isMultiChoice,
    } = drawItem;

    return {
        id,
        year,
        drawType,
        drawStatus,
        huntId,
        huntCode,
        formatHuntDay:
            huntDay && DateUtils.dateToFormat(huntDay, AppContract.outputFormat.fmt_2, AppContract.inputFormat.fmt_2),
        drawnSequence,
        isDrawSequenceDisplayed,
        huntName,
        partyNumber,
        memberNames,
        choice,
        drawWon,
        alternateSeq,
        isGeneratedDraw,
        drawTicketLicenseId,
        notificationTitle,
        notificationAvailable,
        notificationDescription,
        filename,
        fileId,
        fileTitle,
        isMultiChoice,
    };
};

export const formateDrawList = (list: DrawStatusList) => {
    const copyHuntsList = list.copyHuntsList?.map((group) => {
        const { items = [] } = group;
        return {
            year: group.year,
            drawType: group.drawType,
            partyNumber: group.partyNumber,
            drawStatus: items[0]?.drawStatus || "",
            isMultiChoice: items[0]?.isMultiChoice,
            items: items?.map((item) => convertDrawApplicationItem(item)),
        };
    });

    const generatedHuntsList = list.generatedHuntsList?.map((item) => convertDrawApplicationItem(item));

    return { copyHuntsList, generatedHuntsList };
};

export async function getDrawApplicationList(profileId: string): Promise<DrawApplicationList> {
    const response = await getDrawApplicationListByCustomerId(profileId);

    const { result } = response.data;
    const lastUpdateDate = response?.headers?.["last-updated-date"];

    const successList = formateDrawList(result.successList || {});
    const unSuccessList = formateDrawList(result.unSuccessList || {});
    const historySuccessList = formateDrawList(result.historySuccessList || {});
    const historyUnSuccessList = formateDrawList(result.historyUnSuccessList || {});
    const pendingList = formateDrawList(result.pendingList || {});

    return {
        instructions: result.instructions,
        successList,
        historySuccessList,
        historyUnSuccessList,
        unSuccessList,
        pendingList,
        lastUpdateDate,
    };
}

export function getDrawTabDataIsEmpty(data: DrawTabData, historyData?: DrawTabData) {
    const { copyHuntsList, generatedHuntsList } = data || {};
    const { copyHuntsList: historyCopyHuntsList, generatedHuntsList: historyGeneratedHuntsList } = historyData || {};

    return (
        isEmpty(copyHuntsList) &&
        isEmpty(generatedHuntsList) &&
        isEmpty(historyCopyHuntsList) &&
        isEmpty(historyGeneratedHuntsList)
    );
}
