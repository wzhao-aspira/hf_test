import { isEmpty } from "lodash";
import { DrawApplicationList, DrawResultsListItem, NonPendingStatusList } from "../types/drawApplication";
import { getDrawApplicationListByCustomerId } from "../network/api_client/DrawResultsApi";
import DateUtils from "../utils/DateUtils";
import AppContract from "../assets/_default/AppContract";

const convertDrawApplicationItem = (drawItem: DrawResultsListItem) => {
    const { year, drawType, drawStatus, huntId, huntCode, huntDay, drawnSequence, huntName } = drawItem;
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
    };
};

export const formateNonPendingDrawList = (list: NonPendingStatusList) => {
    const copyHuntsList = list.copyHuntsList?.map((group) => {
        return group.map((item) => convertDrawApplicationItem(item));
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
