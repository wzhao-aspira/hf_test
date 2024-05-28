import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./Store";

const selectMobileAppAlertState = (state: RootState) => state.mobileAppAlert;

export const selectMobileAppAlertUnreadCount = createSelector(selectMobileAppAlertState, (mobileAppAlertState) => {
    const result = mobileAppAlertState?.data?.filter((x) => x.isRead == false).length || 0;
    return result;
});

export const selectMobileAppAlertListData = createSelector(selectMobileAppAlertState, (mobileAppAlertState) => {
    return mobileAppAlertState;
});
export const selectMobileAppAlertUpdateTime = createSelector(selectMobileAppAlertState, (mobileappAlertState) => {
    return mobileappAlertState?.updateTime;
});
