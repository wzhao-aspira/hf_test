import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./Store";

export const selectAccessPermitState = (state: RootState) => state.accessPermit;

const selectRawLastUpdateDate = createSelector(selectAccessPermitState, (accessPermitState) => {
    return accessPermitState.data?.lastUpdateDate;
});

const selectors = {
    selectRawLastUpdateDate,
};

export default selectors;
