import { isEmpty } from "lodash";
import type { DrawApplicationList, DrawResultsListItem, NonPendingStatusList } from "../types/drawApplication";
// import { getDrawApplicationListByCustomerId } from "../network/api_client/DrawResultsApi";
import DateUtils from "../utils/DateUtils";
import AppContract from "../assets/_default/AppContract";
import DrawList from "./mock_data/drawList.json";

const convertDrawApplicationItem = (drawItem: DrawResultsListItem) => {
    const {
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

function formatCopyHuntList(copyList: DrawResultsListItem[][]) {
    const result = [];
    copyList?.forEach((copyGroup) => {
        const items = copyGroup.map((copyItem) => ({
            isDrawWon: copyItem.drawWon === "Y",
            huntName: copyItem.huntName,
            huntCode: copyItem.huntCode,
        }));
        const { year, drawType, drawStatus, huntId } = copyGroup[0];
        result.push({ items, year, drawType, drawStatus, huntId });
    });
    return result;
}

export const formateNonPendingDrawList = (list: NonPendingStatusList) => {
    const copyHuntsList = list.copyHuntsList?.map((group) => {
        return group.map((item) => convertDrawApplicationItem(item));
    });
    const formattedCopyHuntList = formatCopyHuntList(list.copyHuntsList);
    const generatedHuntsList = list.generatedHuntsList?.map((item) => convertDrawApplicationItem(item));
    const multiChoiceCopyHuntsList = list.multiChoiceCopyHuntsList?.map((item) => convertDrawApplicationItem(item));

    return { copyHuntsList, generatedHuntsList, multiChoiceCopyHuntsList, formattedCopyHuntList };
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
