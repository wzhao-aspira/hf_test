import { isEmpty } from "lodash";
import type { DrawApplicationList, DrawResultsListItem, NonPendingStatusList } from "../types/drawApplication";
// import { getDrawApplicationListByCustomerId } from "../network/api_client/DrawResultsApi";
import DateUtils from "../utils/DateUtils";
import AppContract from "../assets/_default/AppContract";
import DrawList from "./mock_data/drawList.json";

const convertDrawApplicationItem = (drawItem: DrawResultsListItem) => {
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

export const formateNonPendingDrawList = (list: NonPendingStatusList) => {
    const copyHuntsList = list.copyHuntsList?.map((group) => {
        const { items = [] } = group;
        return {
            ...group,
            drawStatus: items[0].drawStatus,
            items: items?.map((item) => convertDrawApplicationItem(item)),
        };
    });

    const generatedHuntsList = list.generatedHuntsList?.map((item) => convertDrawApplicationItem(item));
    const multiChoiceCopyHuntsList = list.multiChoiceCopyHuntsList?.map((item) => convertDrawApplicationItem(item));

    return { copyHuntsList, generatedHuntsList, multiChoiceCopyHuntsList };
};

export async function getDrawApplicationList(profileId: string): Promise<DrawApplicationList> {
    // const response = await getDrawApplicationListByCustomerId(profileId);
    // const { result } = response.data;

    // TODO: use mock data since API is not completed
    const mockData: any = await new Promise((resolve) => {
        setTimeout(() => {
            if (profileId === "K3jp4_b6KVO81uU6cIE1Zw") {
                resolve(DrawList);
            } else {
                resolve({ result: {} });
            }
        }, 1000);
    });
    const { result } = mockData;

    const successList = formateNonPendingDrawList(result.successList || {});
    const unSuccessList = formateNonPendingDrawList(result.unSuccessList || {});
    const pendingList = result.pendingList?.pendingHuntsList?.map((item) => convertDrawApplicationItem(item));

    return { instructions: result.instructions, successList, unSuccessList, pendingList };
}

export function getNonPendingDrawIsEmpty(data: NonPendingStatusList) {
    const { copyHuntsList, generatedHuntsList, multiChoiceCopyHuntsList } = data || {};

    return isEmpty(copyHuntsList) && isEmpty(generatedHuntsList) && isEmpty(multiChoiceCopyHuntsList);
}
