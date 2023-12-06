import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./Store";

import { getFormattedLastUpdateDate } from "../utils/DateUtils";

export const selectAccessPermitState = (state: RootState) => state.accessPermit;

const selectLastUpdateDate = createSelector(selectAccessPermitState, (accessPermitState) => {
    return getFormattedLastUpdateDate(accessPermitState.data?.lastUpdateDate);
});

const selectors = {
    selectLastUpdateDate,
};

export default selectors;
