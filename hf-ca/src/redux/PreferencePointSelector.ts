import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./Store";

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
