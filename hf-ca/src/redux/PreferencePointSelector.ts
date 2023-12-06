import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./Store";
import { getFormattedLastUpdateDate } from "../utils/DateUtils";

const selectPreferencePointState = (state: RootState) => state.preferencePoint;

export const selectPreferencePointList = createSelector(selectPreferencePointState, (preferencePointState) => {
    return preferencePointState.data;
});

export const selectPreferencePointRequestStatus = createSelector(selectPreferencePointState, (preferencePointState) => {
    return preferencePointState.requestStatus;
});

export const selectShowSkeletonWhenOffline = createSelector(selectPreferencePointState, (preferencePointState) => {
    return preferencePointState.isShowSkeletonWhenOffline;
});
export const selectLastUpdateDate = createSelector(selectPreferencePointState, (preferencePointState) => {
    return getFormattedLastUpdateDate(preferencePointState.lastUpdateDate);
});

const selectRawLastUpdateDate = createSelector(selectPreferencePointState, (preferencePointState) => {
    return preferencePointState.lastUpdateDate;
});

const selectors = {
    selectPreferencePointList,
    selectPreferencePointRequestStatus,
    selectShowSkeletonWhenOffline,
    selectLastUpdateDate,
    selectRawLastUpdateDate,
};

export default selectors;
