import { isEmpty } from "lodash";
import type { DrawApplicationList, NonPendingStatusList } from "../types/drawApplication";
import { getDrawApplicationListByCustomerId } from "../network/api_client/DrawResultsApi";
import DateUtils from "../utils/DateUtils";
import AppContract from "../assets/_default/AppContract";
import { DrawResultsListVM, DrawStatusList as APINonPendingStatusList } from "../network/generated";

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
    };
};

export const formateNonPendingDrawList = (list: APINonPendingStatusList) => {
    const copyHuntsList = list.copyHuntsList?.map((group) => {
        const { items = [] } = group;
        return {
            year: group.year,
            drawType: group.drawType,
            partyNumber: group.partyNumber,
            drawStatus: items[0]?.drawStatus || "",
            items: items?.map((item) => convertDrawApplicationItem(item)),
        };
    });

    const generatedHuntsList = list.generatedHuntsList?.map((item) => convertDrawApplicationItem(item));
    const multiChoiceCopyHuntsList = list.multiChoiceCopyHuntsList?.map((item) => convertDrawApplicationItem(item));

    return { copyHuntsList, generatedHuntsList, multiChoiceCopyHuntsList };
};

export async function getDrawApplicationList(profileId: string): Promise<DrawApplicationList> {
    const response = await getDrawApplicationListByCustomerId(profileId);
    const { result } = response.data;

    const successList = formateNonPendingDrawList(result.successList || {});
    const unSuccessList = formateNonPendingDrawList(result.unSuccessList || {});
    const pendingList = result.pendingList?.pendingHuntsList?.map((item) => convertDrawApplicationItem(item));

    return { instructions: result.instructions, successList, unSuccessList, pendingList };
}

export function getNonPendingDrawIsEmpty(data: NonPendingStatusList) {
    const { copyHuntsList, generatedHuntsList, multiChoiceCopyHuntsList } = data || {};

    return isEmpty(copyHuntsList) && isEmpty(generatedHuntsList) && isEmpty(multiChoiceCopyHuntsList);
}
