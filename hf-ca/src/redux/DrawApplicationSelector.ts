import { createSelector } from "@reduxjs/toolkit";
import { isEmpty } from "lodash";

import type { RootState } from "./Store";
import { getNonPendingDrawIsEmpty } from "../services/DrawApplicationServices";

const selectDrawApplicationState = (state: RootState) => state.drawApplication;

const selectDrawRequestStatus = createSelector(selectDrawApplicationState, (draw) => draw.requestStatus);

const selectSuccessfulData = createSelector(selectDrawApplicationState, (draw) => draw.successfulData);
const selectUnsuccessfulData = createSelector(selectDrawApplicationState, (draw) => draw.unsuccessfulData);
const selectPendingList = createSelector(selectDrawApplicationState, (draw) => draw.pendingList);

const selectSuccessfulDataIsEmpty = createSelector(selectSuccessfulData, (data) => getNonPendingDrawIsEmpty(data));
const selectUnsuccessfulDataIsEmpty = createSelector(selectUnsuccessfulData, (data) => getNonPendingDrawIsEmpty(data));
const selectPendingListIsEmpty = createSelector(selectPendingList, (data) => isEmpty(data));
const selectDrawListIsEmpty = createSelector(
    selectSuccessfulDataIsEmpty,
    selectUnsuccessfulDataIsEmpty,
    selectPendingListIsEmpty,
    (successfulIsEmpty, unsuccessfulIsEmpty, pendingIsEmpty) =>
        successfulIsEmpty && unsuccessfulIsEmpty && pendingIsEmpty
);

const selectors = {
    selectSuccessfulData,
    selectUnsuccessfulData,
    selectPendingList,
    selectSuccessfulDataIsEmpty,
    selectUnsuccessfulDataIsEmpty,
    selectPendingListIsEmpty,
    selectDrawListIsEmpty,
    selectDrawRequestStatus,
};

export default selectors;
