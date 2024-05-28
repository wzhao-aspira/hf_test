import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./Store";
import { formateDateForList, formateDateForDashboard } from "../services/LicenseService";
import { getFormattedLastUpdateDate } from "../utils/DateUtils";
import { REQUEST_STATUS } from "../constants/Constants";

const selectLicenseState = (state: RootState) => state.license;

export const selectLicenseForList = createSelector(selectLicenseState, (licenseState) => {
    const licenseData = licenseState.data || [];
    let groupedData = licenseData.reduce((accumulator, item) => {
        const groupKey = item.uiTabId;
        if (!accumulator.has(groupKey)) {
            accumulator.set(groupKey, { groupKey, title: item.uiTabName, data: [] });
        }
        const { validFrom, validTo } = formateDateForList(item);
        accumulator.get(groupKey).data.push({ ...item, validFrom, validTo });

        return accumulator;
    }, new Map());

    const groupedDataResult = Array.from(groupedData.values());

    return { ...licenseState, data: groupedDataResult };
});

export const selectLastUpdateTimeFromServer = createSelector(selectLicenseForList, (licenseDataForList) => {
    return getFormattedLastUpdateDate(licenseDataForList.lastUpdateTimeFromServer);
});

export const selectLicenseForDashboard = createSelector(selectLicenseState, (licenseState) => {
    const licenseData = licenseState.data;
    const data = licenseData?.map((item) => {
        const { validFrom, validTo } = formateDateForDashboard(item);
        return { ...item, validFrom, validTo };
    });

    return { ...licenseState, data };
});

export const selectUpdateTime = createSelector(selectLicenseState, (license) => license.updateTime);

export const selectLicenseForDetailSwiper = createSelector(selectLicenseState, (licenseState) => {
    const licenseData = licenseState.data;
    const data = licenseData?.map((item) => {
        const { validFrom, validTo } = formateDateForList(item);
        return { ...item, validFrom, validTo };
    });

    return data;
});

export const selectIsLicenseRefreshing = createSelector(
    selectLicenseState,
    (reduxData) => reduxData.requestStatus === REQUEST_STATUS.pending
);
export const selectIsLicenseListChanged = createSelector(
    selectLicenseState,
    (reduxData) => reduxData.isLicenseListChanged
);
