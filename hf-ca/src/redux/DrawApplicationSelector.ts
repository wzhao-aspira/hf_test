import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "./Store";
import { getDrawTabDataIsEmpty } from "../services/DrawApplicationServices";
import { REQUEST_STATUS } from "../constants/Constants";
import { getFormattedLastUpdateDate } from "../utils/DateUtils";

const selectDrawApplicationState = (state: RootState) => state.drawApplication;

const selectDrawRequestStatus = createSelector(selectDrawApplicationState, (draw) => draw.requestStatus);
const selectIsDrawListLoading = createSelector(selectDrawRequestStatus, (status) => status === REQUEST_STATUS.pending);
const selectInstructions = createSelector(selectDrawApplicationState, (draw) => draw.instructions);
const selectIsUseCacheData = createSelector(selectDrawApplicationState, (draw) => draw.isUseCacheData);
const selectNoCacheData = createSelector(selectDrawApplicationState, (draw) => draw.noCacheData);

const selectSuccessfulData = createSelector(selectDrawApplicationState, (draw) => draw.successfulData);
const selectUnsuccessfulData = createSelector(selectDrawApplicationState, (draw) => draw.unsuccessfulData);
const selectPendingList = createSelector(selectDrawApplicationState, (draw) => draw.pendingData);

const selectSuccessfulDataIsEmpty = createSelector(selectSuccessfulData, (data) => getDrawTabDataIsEmpty(data));
const selectUnsuccessfulDataIsEmpty = createSelector(selectUnsuccessfulData, (data) => getDrawTabDataIsEmpty(data));
const selectPendingListIsEmpty = createSelector(selectPendingList, (data) => getDrawTabDataIsEmpty(data));
const selectDrawListIsEmpty = createSelector(
    selectSuccessfulDataIsEmpty,
    selectUnsuccessfulDataIsEmpty,
    selectPendingListIsEmpty,
    (successfulIsEmpty, unsuccessfulIsEmpty, pendingIsEmpty) =>
        successfulIsEmpty && unsuccessfulIsEmpty && pendingIsEmpty
);

const selectLastUpdateDate = createSelector(selectDrawApplicationState, (draw) => {
    const { lastUpdateDate } = draw;
    return getFormattedLastUpdateDate(lastUpdateDate);
});

const selectors = {
    selectSuccessfulData,
    selectUnsuccessfulData,
    selectPendingList,
    selectSuccessfulDataIsEmpty,
    selectUnsuccessfulDataIsEmpty,
    selectPendingListIsEmpty,
    selectDrawListIsEmpty,
    selectDrawRequestStatus,
    selectIsDrawListLoading,
    selectInstructions,
    selectIsUseCacheData,
    selectNoCacheData,
    selectLastUpdateDate,
};

export default selectors;
